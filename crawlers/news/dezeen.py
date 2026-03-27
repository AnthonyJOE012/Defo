"""Dezeen news crawler."""

import asyncio
import re

import httpx
from bs4 import BeautifulSoup

from base import Article, BaseCrawler, SourceType
from config import config


class DezeenCrawler(BaseCrawler):
    """Crawler for Dezeen news articles."""

    BASE_URL = "https://www.dezeen.com"

    def __init__(self):
        super().__init__(source_name="Dezeen", source_type=SourceType.NEWS)
        self.client = httpx.AsyncClient(
            timeout=config.timeout_seconds,
            headers={"User-Agent": config.user_agent},
            follow_redirects=True
        )

    async def fetch_articles(self, **kwargs) -> list[Article]:
        """Fetch latest articles from Dezeen."""
        articles = []

        try:
            response = await self.client.get(self.BASE_URL)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "lxml")

            # Find article links - look for h3 tags within articles
            h3_tags = soup.select("article h3 a")

            seen_urls = set()
            for h3 in h3_tags[:15]:  # Limit to 15 articles
                url = h3.get("href", "")
                title = h3.get_text(strip=True)

                # Skip category/tag/section links - only keep article URLs with date pattern
                if not url or "/tag/" in url or "/category/" in url:
                    continue

                # Dezeen article URLs contain date pattern like /2026/03/27/
                if not re.search(r'/\d{4}/\d{2}/\d{2}/', url):
                    continue

                # Skip if already processed
                if url in seen_urls:
                    continue
                seen_urls.add(url)

                # Ensure full URL with https
                if url.startswith("//"):
                    url = "https:" + url
                elif url.startswith("/"):
                    url = f"{self.BASE_URL}{url}"
                elif not url.startswith("http"):
                    url = f"{self.BASE_URL}/{url}"

                # Ensure trailing slash for consistency
                if not url.endswith("/"):
                    url = url + "/"

                # Parse individual article for description and date
                article = await self.parse_article(url, title)
                if article:
                    articles.append(article)

                await asyncio.sleep(0.5)

        except Exception as e:
            print(f"Error fetching Dezeen articles: {e}")

        finally:
            await self.client.aclose()

        return articles

    async def parse_article(self, url: str, fallback_title: str = "", **kwargs) -> Article | None:
        """Parse a single Dezeen article."""
        try:
            response = await self.client.get(url)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "lxml")

            # Extract title
            title = fallback_title
            if not title:
                title_tag = soup.find("h1") or soup.find("title")
                title = title_tag.get_text(strip=True) if title_tag else ""

            desc_tag = soup.find("meta", property="og:description")
            description = desc_tag.get("content", "") if desc_tag else ""

            image_tag = soup.find("meta", property="og:image")
            image_url = image_tag.get("content", "") if image_tag else ""

            date_tag = soup.find("time")
            date = ""
            if date_tag:
                date = date_tag.get("datetime", "")[:10]

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
