"""Designboom news crawler."""

import asyncio

import httpx
from bs4 import BeautifulSoup

from base import Article, BaseCrawler, SourceType
from config import config
from parser import ContentParser


class DesignboomCrawler(BaseCrawler):
    """Crawler for Designboom news articles."""

    BASE_URL = "https://www.designboom.com"

    def __init__(self):
        super().__init__(source_name="Designboom", source_type=SourceType.NEWS)
        self.client = httpx.AsyncClient(
            timeout=config.timeout_seconds,
            headers={"User-Agent": config.user_agent}
        )

    async def fetch_articles(self, **kwargs) -> list[Article]:
        """Fetch latest articles from Designboom."""
        articles = []
        url = kwargs.get("url", f"{self.BASE_URL}/")

        try:
            response = await self.client.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "lxml")

            article_links = soup.select("div.post_list_holder article a")

            for link in article_links[:10]:
                article_url = link.get("href")
                if article_url and not article_url.startswith("http"):
                    article_url = f"{self.BASE_URL}{article_url}"

                await asyncio.sleep(1.0)
                article = await self.parse_article(article_url)
                if article:
                    articles.append(article)

        except Exception as e:
            print(f"Error fetching Designboom articles: {e}")

        finally:
            await self.client.aclose()

        return articles

    async def parse_article(self, url: str, **kwargs) -> Article | None:
        """Parse a single Designboom article."""
        try:
            response = await self.client.get(url)
            response.raise_for_status()

            parsed = ContentParser.parse_article_page(response.text)

            return Article(
                title=parsed.title,
                url=url,
                source=self.source_name,
                source_type=self.source_type,
                description=parsed.summary,
                date=parsed.published_at[:10] if parsed.published_at else "",
                image_url="",
                content=parsed.content,
                authors=parsed.authors,
            )
        except Exception as e:
            print(f"Error parsing article {url}: {e}")
            return None
