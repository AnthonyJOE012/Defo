"""Academic papers crawlers package."""

from base import Article, BaseCrawler, SourceType

__all__ = [
    "Article",
    "BaseCrawler",
    "SourceType",
    "ACMCrawler",
    "CORECrawler",
    "GoogleScholarCrawler",
]

from .acm import ACMCrawler
from .core import CORECrawler
from .google_scholar import GoogleScholarCrawler
