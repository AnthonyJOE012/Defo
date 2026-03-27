"""ScienceDirect crawler."""

import asyncio
import re
from typing import Any

import httpx
from bs4 import BeautifulSoup

from base import Article, BaseCrawler, SourceType
from config import config


class ScienceDirectCrawler(BaseCrawler):
    """Crawler for ScienceDirect (https://www.sciencedirect.com)."""

    BASE_URL = "https://www.sciencedirect.com"
    SEARCH_URL = "https://www.sciencedirect.com/search"

    def __init__(self):
        super().__init__("ScienceDirect", SourceType.PAPER)
        self.client: httpx.AsyncClient | None = None

    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client."""
        if self.client is None:
            self.client = httpx.AsyncClient(
                timeout=config.timeout_seconds,
                headers={
                    "User-Agent": config.user_agent,
                    "Accept": "text/html,application/xhtml+xml",
                }
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
        """Fetch articles from ScienceDirect.

        Args:
            query: Search query for papers
            max_results: Maximum number of results to fetch

        Returns:
            List of Article objects
        """
        articles = []
        client = await self._get_client()

        offset = 0
        page_size = min(max_results, 25)

        while len(articles) < max_results:
            try:
                response = await client.get(
                    self.SEARCH_URL,
                    params={
                        "q": query,
                        "offset": offset,
                        "per_page": page_size,
                    }
                )
                response.raise_for_status()

                soup = BeautifulSoup(response.text, "html.parser")
                new_articles = self._parse_search_results(soup)

                if not new_articles:
                    break

                articles.extend(new_articles[:max_results - len(articles)])

                # Rate limiting
                await asyncio.sleep(1.5)
                offset += page_size

            except httpx.HTTPError as e:
                print(f"HTTP error fetching from ScienceDirect: {e}")
                break
            except Exception as e:
                print(f"Error fetching from ScienceDirect: {e}")
                break

        return articles[:max_results]

    def _parse_search_results(self, soup: BeautifulSoup) -> list[Article]:
        """Parse ScienceDirect search results page.

        Args:
            soup: BeautifulSoup object of search results page

        Returns:
            List of Article objects
        """
        articles = []

        # ScienceDirect article entries
        article_entries = soup.find_all("article", class_="search-result")

        for entry in article_entries:
            try:
                article = self._parse_article_entry(entry)
                if article:
                    articles.append(article)
            except Exception as e:
                print(f"Error parsing ScienceDirect article entry: {e}")
                continue

        return articles

    def _parse_article_entry(self, entry: BeautifulSoup) -> Article | None:
        """Parse a single article entry from search results.

        Args:
            entry: BeautifulSoup element of article entry

        Returns:
            Article object or None
        """
        try:
            # Find title and link
            title_elem = entry.find("h2", class_="result-item-title")
            if not title_elem:
                title_elem = entry.find("a", class_="title-link")

            if not title_elem:
                return None

            title = title_elem.get_text(strip=True)
            url = title_elem.get("href") if title_elem.name == "a" else title_elem.find("a").get("href", "")
            if url and not url.startswith("http"):
                url = self.BASE_URL + url

            # Find authors
            authors = []
            author_elem = entry.find("ul", class_="authors")
            if author_elem:
                author_names = author_elem.find_all("span", class_="author-name")
                authors = [a.get_text(strip=True) for a in author_names]

            # Find publication date
            date_str = ""
            date_elem = entry.find("div", class_="result-item-published")
            if date_elem:
                date_text = date_elem.get_text(strip=True)
                year_match = re.search(r"\d{4}", date_text)
                if year_match:
                    date_str = f"{year_match.group(0)}-01-01"

            # Find description
            description = ""
            abstract_elem = entry.find("p", class_="abstract")
            if not abstract_elem:
                abstract_elem = entry.find("div", class_="description")
            if abstract_elem:
                description = abstract_elem.get_text(strip=True)

            return Article(
                title=title,
                url=url,
                source=self.source_name,
                source_type=self.source_type,
                description=description,
                date=date_str,
                authors=authors,
                content=""
            )

        except Exception as e:
            print(f"Error parsing ScienceDirect article: {e}")
            return None

    async def parse_article(self, url: str, **kwargs) -> Article | None:
        """Parse a single article from its URL.

        Args:
            url: Article URL

        Returns:
            Article object or None
        """
        client = await self._get_client()

        try:
            response = await client.get(url)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")
            return self._parse_article_page(soup, url)

        except Exception as e:
            print(f"Error parsing ScienceDirect article {url}: {e}")
            return None

    def _parse_article_page(self, soup: BeautifulSoup, url: str) -> Article | None:
        """Parse a ScienceDirect article page.

        Args:
            soup: BeautifulSoup object of article page
            url: Original URL

        Returns:
            Article object or None
        """
        try:
            # Find title
            title_elem = soup.find("h1", class_="title-text")
            title = title_elem.get_text(strip=True) if title_elem else ""

            if not title:
                return None

            # Find authors
            authors = []
            author_elems = soup.find_all("a", class_="author-name")
            for author in author_elems:
                name = author.get_text(strip=True)
                if name:
                    authors.append(name)

            # Find publication date
            date_str = ""
            date_elem = soup.find("div", class_="page-volume")
            if date_elem:
                date_text = date_elem.get_text(strip=True)
                year_match = re.search(r"\d{4}", date_text)
                if year_match:
                    date_str = f"{year_match.group(0)}-01-01"

            # Find abstract
            description = ""
            abstract_elem = soup.find("div", class_="abstract")
            if abstract_elem:
                description = abstract_elem.get_text(strip=True)

            # Find cover image
            image_url = ""
            image_elem = soup.find("img", class_="cover-image")
            if image_elem:
                image_url = image_elem.get("src", "")

            return Article(
                title=title,
                url=url,
                source=self.source_name,
                source_type=self.source_type,
                description=description,
                date=date_str,
                image_url=image_url,
                authors=authors,
                content=""
            )

        except Exception as e:
            print(f"Error parsing ScienceDirect page: {e}")
            return None
