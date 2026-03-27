"""Data pipeline entry point for crawlers."""

import asyncio
import logging
from typing import Any

from base import Article, BaseCrawler
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
                await self._store_articles(filtered_articles, crawler.source_type)

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

    async def _store_articles(self, articles: list[Article], source_type: Any) -> None:
        """Store articles in Supabase."""
        if not self.supabase_client or not articles:
            return

        records = []
        for article in articles:
            record = article.to_dict()
            record["source_type"] = source_type.value if hasattr(source_type, 'value') else str(source_type)
            record["source_name"] = article.source
            records.append(record)

        try:
            self.supabase_client.table(config.supabase.table_name).insert(records).execute()
            logger.info(f"Stored {len(records)} articles in Supabase")
        except Exception as e:
            logger.error(f"Failed to store articles: {e}")


# Import news crawlers (currently working)
from news.designboom import DesignboomCrawler
from news.dezeen import DezeenCrawler


async def main():
    """Main entry point - runs all crawlers."""
    logger.info("Pipeline initialized")
    pipeline = Pipeline()

    crawlers: list[BaseCrawler] = [
        # News crawlers (working)
        DesignboomCrawler(),
        DezeenCrawler(),
    ]

    logger.info(f"Running {len(crawlers)} crawlers...")
    results = await pipeline.run_crawlers(crawlers)

    total_articles = sum(len(articles) for articles in results.values())
    logger.info(f"Crawling complete! Total articles: {total_articles}")

    for source, articles in results.items():
        logger.info(f"  {source}: {len(articles)} articles")


if __name__ == "__main__":
    asyncio.run(main())
