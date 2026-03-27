"""CORE crawler using CORE API."""

import asyncio
from datetime import datetime
from typing import Any

import httpx

from base import Article, BaseCrawler, SourceType
from config import config


class CORECrawler(BaseCrawler):
    """Crawler for CORE (https://core.ac.uk)."""

    BASE_URL = "https://api.core.ac.uk"
    # CORE API v3 endpoints
    SEARCH_URL = f"{BASE_URL}/v3/search/works"

    def __init__(self, api_key: str = ""):
        """Initialize CORE crawler.

        Args:
            api_key: CORE API key (optional, has rate limits without)
        """
        super().__init__("CORE", SourceType.PAPER)
        self.api_key = api_key
        self.client: httpx.AsyncClient | None = None

    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client."""
        if self.client is None:
            headers = {
                "User-Agent": config.user_agent,
                "Accept": "application/json",
            }
            if self.api_key:
                headers["Authorization"] = f"Bearer {self.api_key}"

            self.client = httpx.AsyncClient(
                timeout=config.timeout_seconds,
                headers=headers
            )
        return self.client

    async def close(self) -> None:
        """Close the HTTP client."""
        if self.client:
            await self.client.aclose()
            self.client = None

    async def fetch_articles(
        self,
        query: str = "machine learning",
        max_results: int = 20,
        **kwargs
    ) -> list[Article]:
        """Fetch articles from CORE API.

        Args:
            query: Search query for papers
            max_results: Maximum number of results to fetch

        Returns:
            List of Article objects
        """
        articles = []
        client = await self._get_client()

        offset = 0
        page_size = min(max_results, 50)

        while len(articles) < max_results:
            try:
                # CORE API v3 search
                response = await client.post(
                    self.SEARCH_URL,
                    json={
                        "query": query,
                        "offset": offset,
                        "limit": page_size,
                        "include": ["abstract", "authors", "publishedDate"],
                    }
                )
                response.raise_for_status()

                data = response.json()
                results = data.get("results", [])

                if not results:
                    break

                for result in results:
                    article = self._parse_core_result(result)
                    if article:
                        articles.append(article)

                    if len(articles) >= max_results:
                        break

                # Rate limiting - CORE allows ~100 requests/minute without API key
                await asyncio.sleep(0.6)
                offset += page_size

            except httpx.HTTPError as e:
                print(f"HTTP error fetching from CORE: {e}")
                break
            except Exception as e:
                print(f"Error fetching from CORE: {e}")
                break

        return articles[:max_results]

    def _parse_core_result(self, result: dict[str, Any]) -> Article | None:
        """Parse a CORE API result into an Article.

        Args:
            result: Raw CORE API result dictionary

        Returns:
            Article object or None
        """
        try:
            title = result.get("title", "")
            if not title:
                return None

            # Get main URL
            url = result.get("downloadUrl", "") or result.get("id", "")
            if url and not url.startswith("http"):
                url = f"https://core.ac.uk/works/{url}"

            # Extract authors
            authors = []
            authors_data = result.get("authors", [])
            if isinstance(authors_data, list):
                authors = [a.get("name", "") for a in authors_data if a.get("name")]

            # Extract published date
            date_str = ""
            published_date = result.get("publishedDate") or result.get("date")
            if published_date:
                try:
                    if isinstance(published_date, str):
                        # Try parsing different date formats
                        for fmt in ["%Y-%m-%d", "%Y-%m", "%Y", "%B %d, %Y"]:
                            try:
                                dt = datetime.strptime(published_date, fmt)
                                date_str = dt.strftime("%Y-%m-%d")
                                break
                            except ValueError:
                                continue
                        if not date_str and len(published_date) >= 4:
                            # Just a year
                            date_str = f"{published_date[:4]}-01-01"
                except Exception:
                    pass

            # Extract description/abstract
            description = result.get("abstract", "")

            # Get topics/tags
            tags = []
            topics = result.get("topics", [])
            if isinstance(topics, list):
                tags = [t.get("displayName", "") for t in topics if t.get("displayName")]

            return Article(
                title=title,
                url=url,
                source=self.source_name,
                source_type=self.source_type,
                description=description,
                date=date_str,
                authors=authors,
                content="",
                tags=tags,
                raw_data={"core_result": result}
            )

        except Exception as e:
            print(f"Error parsing CORE result: {e}")
            return None

    async def parse_article(self, url: str, **kwargs) -> Article | None:
        """Parse a single article from its URL.

        Note: For CORE, URL is typically a direct link to the work.

        Args:
            url: Article URL

        Returns:
            Article object or None
        """
        client = await self._get_client()

        try:
            # Try to extract work ID from URL
            work_id = ""
            if "/works/" in url:
                work_id = url.split("/works/")[-1].split("?")[0]

            if work_id:
                # Fetch specific work from API
                response = await client.get(f"{self.BASE_URL}/v3/works/{work_id}")
                response.raise_for_status()
                result = response.json()
                return self._parse_core_result(result)

            return None

        except Exception as e:
            print(f"Error parsing CORE article {url}: {e}")
            return None
