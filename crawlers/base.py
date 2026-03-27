"""Base crawler classes and data structures."""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any


class SourceType(Enum):
    """Article source type."""
    NEWS = "news"
    PAPER = "paper"
    COMPETITION = "competition"


# Category mapping: database type -> frontend category
CATEGORY_MAP = {
    "news": "Design News",
    "paper": "Paper",
    "competition": "Design Award",
}


@dataclass
class Article:
    """Article data model (matches frontend Article interface).

    Field naming follows frontend conventions:
    - id: string (UUID, set when stored)
    - title: str
    - description: str (maps to database summary)
    - category: str (maps to database type, e.g., "Design News")
    - date: str (YYYY-MM-DD format, maps to database published_at)
    - imageUrl: str (maps to database image_url)
    """
    title: str
    url: str
    source: str
    source_type: SourceType
    # Frontend fields (camelCase)
    description: str = ""  # Maps to database summary
    category: str = ""  # Maps to database type via CATEGORY_MAP
    date: str = ""  # YYYY-MM-DD format, maps to database published_at
    image_url: str = ""  # Maps to database image_url
    # Additional fields
    content: str = ""
    authors: list[str] = field(default_factory=list)
    published_at: datetime | None = None  # Original datetime for DB storage
    tags: list[str] = field(default_factory=list)
    raw_data: dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.utcnow)
    # Internal fields
    slug: str = ""
    external_id: str = ""

    def __post_init__(self):
        """Set computed fields after initialization."""
        # Auto-set category from source_type if not provided
        if not self.category and self.source_type:
            self.category = CATEGORY_MAP.get(self.source_type.value, self.source_type.value)
        # Auto-set imageUrl from image_url if not provided
        if not self.image_url and hasattr(self, 'imageUrl'):
            self.image_url = self.imageUrl

    def to_dict(self) -> dict[str, Any]:
        """Convert article to dictionary for database storage."""
        return {
            "title": self.title,
            "slug": self.slug,
            "summary": self.description,  # DB uses summary
            "url": self.url,
            "image_url": self.image_url,
            "content": self.content,
            "author": ", ".join(self.authors) if self.authors else None,
            "published_at": self.published_at.isoformat() if self.published_at else None,
            "external_id": self.external_id,
            "raw_data": self.raw_data,
            "created_at": self.created_at.isoformat(),
        }

    def to_frontend_dict(self) -> dict[str, Any]:
        """Convert article to dictionary for frontend (camelCase)."""
        return {
            "id": "",  # Set by database
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "date": self.date or (self.published_at.strftime("%Y-%m-%d") if self.published_at else ""),
            "imageUrl": self.image_url,
            "url": self.url,
            "slug": self.slug,
            "authors": self.authors,
            "tags": self.tags,
            "source": self.source,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "Article":
        """Create Article from dictionary (e.g., from database).

        Handles both snake_case (database) and camelCase (frontend) input.
        """
        # Determine source_type
        source_type_value = data.get("source_type") or data.get("type", "news")
        if isinstance(source_type_value, str):
            source_type = SourceType(source_type_value)
        else:
            source_type = source_type_value

        # Get category (frontend field) or derive from type
        category = data.get("category", "")
        if not category and source_type:
            category = CATEGORY_MAP.get(source_type.value, source_type.value)

        # Handle date field
        date = data.get("date", "")
        published_at = data.get("published_at")
        if published_at and isinstance(published_at, str):
            # Parse ISO format date
            try:
                published_at = datetime.fromisoformat(published_at.replace("Z", "+00:00"))
            except ValueError:
                published_at = None
        elif not published_at and date:
            # Parse YYYY-MM-DD format
            try:
                published_at = datetime.strptime(date, "%Y-%m-%d")
            except ValueError:
                published_at = None

        return cls(
            title=data.get("title", ""),
            url=data.get("url", ""),
            source=data.get("source", ""),
            source_type=source_type,
            description=data.get("description") or data.get("summary", ""),
            category=category,
            date=date or (published_at.strftime("%Y-%m-%d") if published_at else ""),
            image_url=data.get("image_url") or data.get("imageUrl", ""),
            content=data.get("content", ""),
            authors=data.get("authors", []) or (data.get("author", "").split(", ") if data.get("author") else []),
            published_at=published_at,
            tags=data.get("tags", []),
            raw_data=data.get("raw_data", {}),
            slug=data.get("slug", ""),
            external_id=data.get("external_id", ""),
        )


class BaseCrawler(ABC):
    """Abstract base class for all crawlers."""

    def __init__(self, source_name: str, source_type: SourceType):
        self.source_name = source_name
        self.source_type = source_type

    @abstractmethod
    async def fetch_articles(self, **kwargs) -> list[Article]:
        """Fetch articles from the source."""
        pass

    @abstractmethod
    async def parse_article(self, url: str, **kwargs) -> Article | None:
        """Parse a single article from URL."""
        pass

    async def run(self, **kwargs) -> list[Article]:
        """Run the crawler and return all articles."""
        return await self.fetch_articles(**kwargs)
