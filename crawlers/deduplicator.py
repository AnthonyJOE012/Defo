"""Deduplication logic for articles."""

import hashlib
from typing import Set

from supabase import Client

from base import Article


class Deduplicator:
    """Handles article deduplication."""

    def __init__(self, supabase_client: Client | None = None):
        self.supabase_client = supabase_client
        self._seen_hashes: Set[str] = set()

    def _compute_hash(self, article: Article) -> str:
        """Compute a unique hash for an article based on URL and title."""
        content = f"{article.url}:{article.title}".encode("utf-8")
        return hashlib.sha256(content).hexdigest()

    def is_duplicate(self, article: Article) -> bool:
        """Check if article is a duplicate."""
        article_hash = self._compute_hash(article)

        if article_hash in self._seen_hashes:
            return True

        if self.supabase_client:
            response = (
                self.supabase_client.table("articles")
                .select("id")
                .eq("url", article.url)
                .execute()
            )
            if response.data:
                return True

        self._seen_hashes.add(article_hash)
        return False

    def add_to_seen(self, article: Article) -> None:
        """Add article hash to seen set."""
        self._seen_hashes.add(self._compute_hash(article))

    def clear(self) -> None:
        """Clear the seen hashes set."""
        self._seen_hashes.clear()
