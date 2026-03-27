"""Google Scholar crawler using scholarly library."""

import asyncio
from datetime import datetime
from typing import Any

import scholarly
from scholarly import ProxyGenerator, SearchScholar

from base import Article, BaseCrawler, SourceType


class GoogleScholarCrawler(BaseCrawler):
    """Crawler for Google Scholar (https://scholar.google.com)."""

    def __init__(self):
        super().__init__("Google Scholar", SourceType.PAPER)
        self._setup_proxy()

    def _setup_proxy(self) -> None:
        """Setup proxy for Google Scholar requests."""
        try:
            pg = ProxyGenerator()
            pg.SinglePool(http=True, https=True)
            scholarly.use_libproxy(pg)
        except Exception:
            pass

    async def fetch_articles(
        self,
        query: str = "machine learning",
        max_results: int = 20,
        **kwargs
    ) -> list[Article]:
        """Fetch articles from Google Scholar.

        Args:
            query: Search query for papers
            max_results: Maximum number of results to fetch

        Returns:
            List of Article objects
        """
        articles = []
        try:
            search = SearchScholar(query)
            search.set_num_results(min(max_results, 100))

            for i, result in enumerate(search):
                if i >= max_results:
                    break

                article = self._parse_scholarly_result(result)
                if article:
                    articles.append(article)

                # Rate limiting - be respectful to Google
                if i > 0 and i % 5 == 0:
                    await asyncio.sleep(2)

        except Exception as e:
            print(f"Error fetching from Google Scholar: {e}")

        return articles

    def _parse_scholarly_result(self, result: dict[str, Any]) -> Article | None:
        """Parse a scholarly result into an Article.

        Args:
            result: Raw scholarly result dictionary

        Returns:
            Article object or None if parsing fails
        """
        try:
            title = result.get("bib", {}).get("title", "")
            if not title:
                return None

            # Extract authors
            authors = result.get("bib", {}).get("author", [])
            if isinstance(authors, str):
                authors = [a.strip() for a in authors.split(" and ")]
            elif isinstance(authors, list):
                authors = [str(a).strip() for a in authors]

            # Extract year
            year = result.get("bib", {}).get("pub_year", "")
            date_str = f"{year}-01-01" if year else ""

            # Extract description/abstract
            abstract = result.get("bib", {}).get("abstract", "")

            # Extract citation count
            num_citations = result.get("num_citations", 0)

            # Build description with citation info
            description = abstract
            if num_citations > 0:
                citation_info = f" (Cited by {num_citations})"
                description = description + citation_info if description else citation_info.strip()

            # Get PDF URL if available
            url = result.get("pub_link", "")
            if not url:
                url = f"https://scholar.google.com/scholar?q={title[:50]}"

            return Article(
                title=title,
                url=url,
                source=self.source_name,
                source_type=self.source_type,
                description=description,
                date=date_str,
                authors=authors,
                content="",
                raw_data={"scholarly_result": result}
            )

        except Exception as e:
            print(f"Error parsing scholarly result: {e}")
            return None

    async def parse_article(self, url: str, **kwargs) -> Article | None:
        """Parse a single article from URL.

        Note: Google Scholar doesn't provide direct article access.
        This method returns a placeholder article for the URL.

        Args:
            url: Article URL (Google Scholar URL)

        Returns:
            Article object or None
        """
        # Google Scholar URLs are search result pages, not direct article links
        return Article(
            title="Google Scholar Article",
            url=url,
            source=self.source_name,
            source_type=self.source_type,
            description="",
            date=""
        )
