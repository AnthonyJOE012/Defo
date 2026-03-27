"""Configuration for crawlers."""

import os
from dataclasses import dataclass, field


@dataclass
class SupabaseConfig:
    """Supabase database configuration."""
    url: str = os.getenv("SUPABASE_URL", "")
    key: str = os.getenv("SUPABASE_KEY", "")
    table_name: str = os.getenv("SUPABASE_TABLE", "articles")


@dataclass
class RateLimitConfig:
    """Rate limiting configuration."""
    requests_per_second: float = 1.0
    requests_per_minute: int = 60
    requests_per_hour: int = 1000
    burst_size: int = 5


@dataclass
class CrawlerConfig:
    """Main crawler configuration."""
    supabase: SupabaseConfig = field(default_factory=SupabaseConfig)
    rate_limit: RateLimitConfig = field(default_factory=RateLimitConfig)
    timeout_seconds: int = 30
    max_retries: int = 3
    user_agent: str = "DefoCrawler/1.0"


# Global config instance
config = CrawlerConfig()
