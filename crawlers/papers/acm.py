"""ACM Digital Library crawler."""

import asyncio
import re
from typing import Any

import httpx
from bs4 import BeautifulSoup

from base import Article, BaseCrawler, SourceType
from config import config


class ACMCrawler(BaseCrawler):
    """Crawler for ACM Digital Library (https://dl.acm.org)."""

    BASE_URL = "https://dl.acm.org"
    SEARCH_URL = "https://dl.acm.org/action/doSearch"

    def __init__(self):
        super().__init__("ACM Digital Library", SourceType.PAPER)
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
        """Fetch articles from ACM Digital Library.

        Args:
            query: Search query for papers
            max_results: Maximum number of results to fetch

        Returns:
            List of Article objects
        """
        articles = []
        client = await self._get_client()

        # ACM uses POST requests for search
        page = 0
        page_size = min(max_results, 20)

        while len(articles) < max_results:
            try:
                response = await client.post(
                    self.SEARCH_URL,
                    data={
                        "AllField": query,
                        "startPage": page,
                        "pageSize": page_size,
                    },
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                response.raise_for_status()

                soup = BeautifulSoup(response.text, "html.parser")
                new_articles = self._parse_search_results(soup)

                if not new_articles:
                    break

                articles.extend(new_articles[:max_results - len(articles)])

                # Rate limiting
                await asyncio.sleep(1)
                page += 1

            except httpx.HTTPError as e:
                print(f"HTTP error fetching from ACM: {e}")
                break
            except Exception as e:
                print(f"Error fetching from ACM: {e}")
                break

        return articles[:max_results]

    def _parse_search_results(self, soup: BeautifulSoup) -> list[Article]:
        """Parse ACM search results page.

        Args:
            soup: BeautifulSoup object of search results page

        Returns:
            List of Article objects
        """
        articles = []

        # ACM Digital Library uses specific class names for article entries
        article_entries = soup.find_all("div", class_="item__meta")

        for entry in article_entries:
            try:
                article = self._parse_article_entry(entry)
                if article:
                    articles.append(article)
            except Exception as e:
                print(f"Error parsing ACM article entry: {e}")
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
            title_elem = entry.find("a", class_="item__title")
            if not title_elem:
                return None

            title = title_elem.get_text(strip=True)
            url = title_elem.get("href", "")
            if url and not url.startswith("http"):
                url = self.BASE_URL + url

            # Find authors
            authors = []
            author_elem = entry.find("div", class_="item__authors")
            if author_elem:
                author_links = author_elem.find_all("a")
                authors = [a.get_text(strip=True) for a in author_links]

            # Find publication date
            date_str = ""
            date_elem = entry.find("span", class_="item__year")
            if date_elem:
                year = date_elem.get_text(strip=True)
                if re.match(r"\d{4}", year):
                    date_str = f"{year}-01-01"

            # Find description/abstract
            description = ""
            abstract_elem = entry.find("div", class_="item__abstract")
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
            print(f"Error parsing ACM article: {e}")
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
            print(f"Error parsing ACM article {url}: {e}")
            return None

    def _parse_article_page(self, soup: BeautifulSoup, url: str) -> Article | None:
        """Parse an ACM article page.

        Args:
            soup: BeautifulSoup object of article page
            url: Original URL

        Returns:
            Article object or None
        """
        try:
            # Find title
            title_elem = soup.find("h1", class_="citation__title")
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
            date_elem = soup.find("div", class_="pub__date")
            if date_elem:
                date_text = date_elem.get_text(strip=True)
                year_match = re.search(r"\d{4}", date_text)
                if year_match:
                    date_str = f"{year_match.group(0)}-01-01"

            # Find abstract
            description = ""
            abstract_elem = soup.find("div", class_="abstract-data")
            if abstract_elem:
                description = abstract_elem.get_text(strip=True)

            # Find cover image
            image_url = ""
            image_elem = soup.find("img", class_="article__image")
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
            print(f"Error parsing ACM page: {e}")
            return None
