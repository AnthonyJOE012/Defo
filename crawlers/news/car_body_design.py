"""Car Body Design news crawler."""

import asyncio

import httpx
from bs4 import BeautifulSoup

from base import Article, BaseCrawler, SourceType
from config import config


class CarBodyDesignCrawler(BaseCrawler):
    """Crawler for Car Body Design news articles."""

    BASE_URL = "https://www.carbodydesign.com"

    def __init__(self):
        super().__init__(source_name="Car Body Design", source_type=SourceType.NEWS)
        self.client = httpx.AsyncClient(
            timeout=config.timeout_seconds,
            headers={"User-Agent": config.user_agent}
        )

    async def fetch_articles(self, **kwargs) -> list[Article]:
        """Fetch latest articles from Car Body Design."""
        articles = []
        url = kwargs.get("url", f"{self.BASE_URL}/")

        try:
            response = await self.client.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "lxml")

            article_links = soup.select("article a, .post a")

            for link in article_links[:10]:
                article_url = link.get("href")
                if article_url and not article_url.startswith("http"):
                    article_url = f"{self.BASE_URL}{article_url}"

                await asyncio.sleep(1.0)
                article = await self.parse_article(article_url)
                if article:
                    articles.append(article)

        except Exception as e:
            print(f"Error fetching Car Body Design articles: {e}")

        finally:
            await self.client.aclose()

        return articles

    async def parse_article(self, url: str, **kwargs) -> Article | None:
        """Parse a single Car Body Design article."""
        try:
            response = await self.client.get(url)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "lxml")

            title_tag = soup.find("h1") or soup.find("title")
            title = title_tag.get_text(strip=True) if title_tag else ""

            desc_tag = soup.find("meta", property="og:description")
            description = desc_tag.get("content", "") if desc_tag else ""

            image_tag = soup.find("meta", property="og:image")
            image_url = image_tag.get("content", "") if image_tag else ""

            date_tag = soup.find("time") or soup.find("span", class_="date")
            date = ""
            if date_tag:
                date = date_tag.get("datetime", "")[:10] or date_tag.get_text(strip=True)[:10]

            author_tag = soup.find("meta", property="author")
            authors = [author_tag.get("content", "")] if author_tag else []

            content_tag = soup.find("article") or soup.find("main")
            content = ""
            if content_tag:
                content = content_tag.get_text(strip=True)

            return Article(
                title=title,
                url=url,
                source=self.source_name,
                source_type=self.source_type,
                description=description,
                date=date,
                image_url=image_url,
                content=content,
                authors=authors,
            )
        except Exception as e:
            print(f"Error parsing article {url}: {e}")
            return None
