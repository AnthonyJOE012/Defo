"""Designboom news crawler."""

import asyncio
import re

import httpx
from bs4 import BeautifulSoup

from base import Article, BaseCrawler, SourceType
from config import config


class DesignboomCrawler(BaseCrawler):
    """Crawler for Designboom news articles."""

    BASE_URL = "https://www.designboom.com"

    def __init__(self):
        super().__init__(source_name="Designboom", source_type=SourceType.NEWS)
        self.client = httpx.AsyncClient(
            timeout=config.timeout_seconds,
            headers={"User-Agent": config.user_agent},
            follow_redirects=True  # Follow redirects
        )

    async def fetch_articles(self, **kwargs) -> list[Article]:
        """Fetch latest articles from Designboom."""
        articles = []

        try:
            response = await self.client.get(self.BASE_URL)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "lxml")

            # Find article links - look for h3 tags with article titles
            h3_tags = soup.select("article h3 a")

            seen_urls = set()
            for h3 in h3_tags[:15]:  # Limit to 15 articles
                url = h3.get("href", "")
                title = h3.get_text(strip=True)

                # Skip category/tag links (but allow article URLs ending with /)
                if not url or "/tag/" in url or "/category/" in url:
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
            print(f"Error fetching Designboom articles: {e}")

        finally:
            await self.client.aclose()

        return articles

    async def parse_article(self, url: str, fallback_title: str = "", **kwargs) -> Article | None:
        """Parse a single Designboom article."""
        try:
            response = await self.client.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "lxml")

            # Extract title
            title = fallback_title
            if not title:
                title_elem = soup.select_one("h1")
                if title_elem:
                    title = title_elem.get_text(strip=True)

            # Extract date
            date_str = ""
            date_elem = soup.select_one("div.date, span.date, time")
            if date_elem:
                date_text = date_elem.get_text(strip=True)
                # Try to parse date
                date_match = re.search(r"(\w+ \d{1,2},?\s*\d{4})", date_text)
                if date_match:
                    date_str = date_match.group(1)
                    # Convert to YYYY-MM-DD
                    try:
                        from datetime import datetime
                        parsed = datetime.strptime(date_str.replace(",", ""), "%B %d %Y")
                        date_str = parsed.strftime("%Y-%m-%d")
                    except:
                        date_str = ""

            # Extract description (lead/summary paragraph)
            description = ""
            desc_elem = soup.select_one("div.lead, div.summary")
            if desc_elem:
                description = desc_elem.get_text(strip=True)
            else:
                # Try meta description
                meta_desc = soup.select_one("meta[name='description']")
                if meta_desc:
                    description = meta_desc.get("content", "")

            # Extract full article content
            content = ""
            content_elem = soup.select_one("article.post-content, .post-content, div.article-body")
            if content_elem:
                # Remove script, style, nav, footer, sidebar elements
                for elem in content_elem.find_all(["script", "style", "nav", "footer", "aside", "div.share", "div.promotion"]):
                    elem.decompose()
                # Get text content with paragraph separation
                content = content_elem.get_text(separator="\n", strip=True)

            # Extract image
            image_url = ""
            img_elem = soup.select_one("div.featured img, article img")
            if img_elem:
                image_url = img_elem.get("src", "")

            # Extract authors
            authors = []
            author_elem = soup.select_one("span.author, div.author, a.author")
            if author_elem:
                author_text = author_elem.get_text(strip=True)
                if author_text:
                    authors = [a.strip() for a in author_text.replace("by", "").split(",")]

            if not title:
                return None

            return Article(
                title=title,
                url=url,
                source=self.source_name,
                source_type=self.source_type,
                description=description[:500] if description else "",
                date=date_str,
                image_url=image_url,
                content=content,
                authors=authors
            )

        except Exception as e:
            print(f"Error parsing article {url}: {e}")
            return None
