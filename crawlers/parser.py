"""Content parser for extracting article data from HTML."""

from dataclasses import dataclass
from typing import Any

from bs4 import BeautifulSoup


@dataclass
class ParsedContent:
    """Structured content from HTML parsing."""
    title: str
    content: str
    summary: str
    authors: list[str]
    published_at: str | None
    tags: list[str]


class ContentParser:
    """Parser for extracting content from web pages."""

    @staticmethod
    def parse_html(html: str) -> BeautifulSoup:
        """Parse HTML string into BeautifulSoup."""
        return BeautifulSoup(html, "lxml")

    @staticmethod
    def extract_text(element: Any) -> str:
        """Extract clean text from BeautifulSoup element."""
        if element is None:
            return ""
        return element.get_text(strip=True)

    @staticmethod
    def extract_meta(soup: BeautifulSoup, property_name: str) -> str | None:
        """Extract meta tag content."""
        meta = soup.find("meta", property=property_name) or soup.find("meta", attrs={"name": property_name})
        return meta.get("content") if meta else None

    @staticmethod
    def extract_jsonld(soup: BeautifulSoup) -> dict[str, Any] | None:
        """Extract JSON-LD structured data."""
        script = soup.find("script", type="application/ld+json")
        import json
        return json.loads(script.string) if script else None

    @classmethod
    def parse_article_page(cls, html: str) -> ParsedContent:
        """Parse a typical article page and extract structured content."""
        soup = cls.parse_html(html)

        # Extract title
        title = (
            cls.extract_meta(soup, "og:title")
            or soup.find("h1").get_text(strip=True) if soup.find("h1") else ""
        )

        # Extract main content
        article_body = soup.find("article") or soup.find("main") or soup.find("div", class_="content")
        content = cls.extract_text(article_body)

        # Extract summary
        summary = (
            cls.extract_meta(soup, "og:description")
            or cls.extract_meta(soup, "description")
            or content[:200] if content else ""
        )

        # Extract authors
        authors = []
        author_meta = cls.extract_meta(soup, "author")
        if author_meta:
            authors = [author_meta]

        # Extract published date
        published_at = (
            cls.extract_meta(soup, "article:published_time")
            or cls.extract_meta(soup, "datePublished")
        )

        # Extract tags
        tags = []
        keywords = cls.extract_meta(soup, "keywords")
        if keywords:
            tags = [t.strip() for t in keywords.split(",")]

        return ParsedContent(
            title=title,
            content=content,
            summary=summary,
            authors=authors,
            published_at=published_at,
            tags=tags,
        )
