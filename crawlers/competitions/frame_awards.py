"""Frame Awards crawler."""

import asyncio
from datetime import datetime

import httpx
from bs4 import BeautifulSoup

from base import Article, BaseCrawler, SourceType


class FrameAwardsCrawler(BaseCrawler):
    """Crawler for Frame Awards (https://frameawards.com)."""

    BASE_URL = "https://frameawards.com"

    def __init__(self):
        super().__init__("Frame Awards", SourceType.COMPETITION)

    async def fetch_articles(self, **kwargs) -> list[Article]:
        """Fetch competition listings from Frame Awards."""
        articles = []
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        }

        async with httpx.AsyncClient(timeout=30.0, headers=headers) as client:
            try:
                response = await client.get(self.BASE_URL)
                response.raise_for_status()
                soup = BeautifulSoup(response.text, "html.parser")

                entries = soup.select("div.project-item, article, div.award-entry")
                for entry in entries:
                    try:
                        title_elem = entry.select_one("h3, h2, h4")
                        url_elem = entry.select_one("a", href=True)
                        desc_elem = entry.select_one("p, div.description")
                        date_elem = entry.select_one("span.year, p.date")
                        image_elem = entry.select_one("img")
                        author_elem = entry.select_one("span.designer, div.studio")

                        if title_elem and url_elem:
                            href = url_elem.get("href", "")
                            article = Article(
                                title=title_elem.get_text(strip=True),
                                url=href if href.startswith("http") else f"{self.BASE_URL}{href}",
                                source=self.source_name,
                                source_type=self.source_type,
                                description=desc_elem.get_text(strip=True) if desc_elem else "",
                                date=self._parse_date(date_elem.get_text(strip=True) if date_elem else ""),
                                image_url=image_elem.get("src", "") if image_elem else "",
                                authors=[author_elem.get_text(strip=True)] if author_elem else [],
                            )
                            articles.append(article)

                        await asyncio.sleep(0.5)
                    except Exception:
                        continue

            except httpx.HTTPError:
                pass

        return articles

    async def parse_article(self, url: str, **kwargs) -> Article | None:
        """Parse a single article from its URL."""
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        }

        async with httpx.AsyncClient(timeout=30.0, headers=headers) as client:
            try:
                response = await client.get(url)
                response.raise_for_status()
                soup = BeautifulSoup(response.text, "html.parser")

                title_elem = soup.select_one("h1")
                desc_elem = soup.select_one("meta[name='description']")
                content_elem = soup.select_one("div.content, article")
                date_elem = soup.select_one("span.date, p.date")
                image_elem = soup.select_one("meta[property='og:image']")

                return Article(
                    title=title_elem.get_text(strip=True) if title_elem else "",
                    url=url,
                    source=self.source_name,
                    source_type=self.source_type,
                    description=desc_elem.get("content", "") if desc_elem else "",
                    date=self._parse_date(date_elem.get_text(strip=True) if date_elem else ""),
                    image_url=image_elem.get("content", "") if image_elem else "",
                    content=content_elem.get_text(strip=True) if content_elem else "",
                )
            except Exception:
                return None

    def _parse_date(self, date_str: str) -> str:
        """Parse date string to YYYY-MM-DD format."""
        if not date_str:
            return ""

        date_formats = ["%Y", "%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y"]
        for fmt in date_formats:
            try:
                dt = datetime.strptime(date_str.strip(), fmt)
                return dt.strftime("%Y-%m-%d")
            except ValueError:
                continue
        return date_str
