"""Data pipeline entry point for crawlers."""

import asyncio
import hashlib
import logging
from typing import Any

from base import Article, BaseCrawler, SourceType
from config import config
from deduplicator import Deduplicator
from supabase import Client, create_client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Pipeline:
    """Main pipeline for running crawlers."""

    def __init__(self):
        self.supabase_client: Client | None = None
        self.deduplicator = Deduplicator()
        self._source_cache: dict[str, str] = {}  # source_name -> source_id

        if config.supabase.url and config.supabase.key:
            self.supabase_client = create_client(
                config.supabase.url,
                config.supabase.key
            )

    async def run_crawler(self, crawler: BaseCrawler, **kwargs) -> list[Article]:
        """Run a single crawler through the pipeline."""
        logger.info(f"Starting crawler: {crawler.source_name}")

        try:
            articles = await crawler.run(**kwargs)
            logger.info(f"Fetched {len(articles)} articles from {crawler.source_name}")

            filtered_articles = self._deduplicate(articles)
            logger.info(f"After deduplication: {len(filtered_articles)} articles")

            if self.supabase_client:
                await self._store_articles(filtered_articles, crawler.source_name, crawler.source_type)

            return filtered_articles
        except Exception as e:
            logger.error(f"Crawler {crawler.source_name} failed: {e}")
            return []

    async def run_crawlers(self, crawlers: list[BaseCrawler], **kwargs) -> dict[str, list[Article]]:
        """Run multiple crawlers concurrently."""
        tasks = [self.run_crawler(crawler, **kwargs) for crawler in crawlers]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        output: dict[str, list[Article]] = {}
        for crawler, result in zip(crawlers, results):
            if isinstance(result, Exception):
                logger.error(f"Crawler {crawler.source_name} failed: {result}")
                output[crawler.source_name] = []
            else:
                output[crawler.source_name] = result

        return output

    def _deduplicate(self, articles: list[Article]) -> list[Article]:
        """Remove duplicate articles."""
        unique_articles = []
        for article in articles:
            if not self.deduplicator.is_duplicate(article):
                unique_articles.append(article)
                self.deduplicator.add_to_seen(article)
        return unique_articles

    async def _get_or_create_source(self, source_name: str, source_type: SourceType) -> str:
        """Get or create a source and return its ID."""
        # Check cache first
        if source_name in self._source_cache:
            return self._source_cache[source_name]

        if not self.supabase_client:
            return ""

        # Try to find existing source
        slug = source_name.lower().replace(" ", "-")
        response = self.supabase_client.table("sources").select("id").eq("slug", slug).execute()

        if response.data and len(response.data) > 0:
            source_id = response.data[0]["id"]
            self._source_cache[source_name] = source_id
            return source_id

        # Create new source
        source_type_value = source_type.value if hasattr(source_type, 'value') else str(source_type)
        new_source = {
            "name": source_name,
            "slug": slug,
            "type": source_type_value,
            "url": f"https://{slug.replace('-', '')}.com",  # Placeholder URL
        }

        try:
            response = self.supabase_client.table("sources").insert(new_source).execute()
            if response.data and len(response.data) > 0:
                source_id = response.data[0]["id"]
                self._source_cache[source_name] = source_id
                logger.info(f"Created new source: {source_name}")
                return source_id
        except Exception as e:
            logger.error(f"Failed to create source {source_name}: {e}")

        return ""

    async def _store_articles(self, articles: list[Article], source_name: str, source_type: SourceType) -> None:
        """Store articles in Supabase."""
        if not self.supabase_client or not articles:
            return

        # Get or create the source
        source_id = await self._get_or_create_source(source_name, source_type)
        if not source_id:
            logger.error(f"Could not get or create source: {source_name}")
            return

        records = []
        for article in articles:
            record = article.to_dict()
            record["source_id"] = source_id
            # Generate external_id from URL hash for proper deduplication
            if not record.get("external_id"):
                record["external_id"] = hashlib.md5(article.url.encode()).hexdigest()[:16]
            # Remove fields that don't exist in the database
            record.pop("raw_data", None)
            records.append(record)

        try:
            self.supabase_client.table(config.supabase.table_name).upsert(records, on_conflict="source_id,external_id").execute()
            logger.info(f"Stored {len(records)} articles in Supabase")
        except Exception as e:
            logger.error(f"Failed to store articles: {e}")


# Import news crawlers (currently working)
from news.designboom import DesignboomCrawler
from news.dezeen import DezeenCrawler

# Import paper crawlers
from papers import ACMCrawler, CORECrawler

# Import competition crawlers
from competitions import ADesignAwardCrawler, RedDotCrawler, DezeenAwardsCrawler


async def main():
    """Main entry point - runs all crawlers."""
    logger.info("Pipeline initialized")
    pipeline = Pipeline()

    crawlers: list[BaseCrawler] = [
        # News crawlers
        DesignboomCrawler(),
        DezeenCrawler(),
        # Paper crawlers
        ACMCrawler(),
        CORECrawler(),
        # Competition crawlers
        ADesignAwardCrawler(),
        RedDotCrawler(),
        DezeenAwardsCrawler(),
    ]

    logger.info(f"Running {len(crawlers)} crawlers...")
    results = await pipeline.run_crawlers(crawlers)

    total_articles = sum(len(articles) for articles in results.values())
    logger.info(f"Crawling complete! Total articles: {total_articles}")

    for source, articles in results.items():
        logger.info(f"  {source}: {len(articles)} articles")


if __name__ == "__main__":
    asyncio.run(main())
