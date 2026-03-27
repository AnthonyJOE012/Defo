# 爬虫规范

> Defo 爬虫开发规范

## 技术栈

- **语言**: Python 3.10+
- **HTTP 客户端**: httpx (异步)
- **HTML 解析**: beautifulsoup4
- **学术论文**: scholarly
- **代码检查**: ruff

## 项目结构

```
crawlers/
├── base.py              # 基类和公共方法
├── config.py           # 配置
├── parser.py           # 内容解析器
├── deduplicator.py     # 去重逻辑
├── pipeline.py         # 数据管道
├── news/               # 行业新闻爬虫
│   ├── __init__.py
│   ├── designboom.py
│   ├── dezeen.py
│   └── ...
├── papers/             # 学术论文爬虫
│   ├── __init__.py
│   ├── google_scholar.py
│   ├── acm.py
│   └── ...
└── competitions/       # 设计比赛爬虫
    ├── __init__.py
    ├── a_design_award.py
    └── ...
```

## 爬虫基类

```python
# crawlers/base.py
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import AsyncIterator
import httpx


@dataclass
class Article:
    title: str
    url: str
    summary: str
    published_at: str | None
    source_name: str
    source_type: str  # 'news' | 'paper' | 'competition'


class BaseCrawler(ABC):
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
        self.source_name: str = ""
        self.source_type: str = ""

    @abstractmethod
    async def fetch(self) -> AsyncIterator[Article]:
        """抓取文章"""
        pass

    async def close(self):
        await self.client.aclose()

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        await self.close()
```

## 爬虫实现示例

```python
# crawlers/news/designboom.py
from crawlers.base import BaseCrawler, Article
from bs4 import BeautifulSoup


class DesignboomCrawler(BaseCrawler):
    def __init__(self):
        super().__init__()
        self.source_name = "Designboom"
        self.source_type = "news"
        self.base_url = "https://www.designboom.com"

    async def fetch(self) -> Article:
        response = await self.client.get(f"{self.base_url}/")
        soup = BeautifulSoup(response.text, "html.parser")

        for item in soup.select(".news-item"):
            yield Article(
                title=item.select_one("h2").text.strip(),
                url=item.select_one("a")["href"],
                summary=item.select_one("p").text.strip(),
                published_at=item.select_one(".date")["datetime"],
                source_name=self.source_name,
                source_type=self.source_type,
            )
```

## 速率限制

- 每个域名 **每秒 1 请求**
- 使用 `asyncio.sleep(1)` 控制
- 失败时指数退避重试

```python
import asyncio

async def fetch_with_retry(url: str, max_retries: int = 3) -> str:
    for i in range(max_retries):
        try:
            response = await client.get(url)
            response.raise_for_status()
            return response.text
        except httpx.HTTPError as e:
            wait = 2 ** i
            await asyncio.sleep(wait)
    raise Exception(f"Failed after {max_retries} retries")
```

## 数据验证

```python
# crawlers/validator.py
from dataclasses import dataclass


@dataclass
class ValidationResult:
    is_valid: bool
    errors: list[str]


def validate_article(article: Article) -> ValidationResult:
    errors = []
    if not article.title:
        errors.append("Missing title")
    if not article.url:
        errors.append("Missing url")
    return ValidationResult(is_valid=len(errors) == 0, errors=errors)
```

## 数据库写入

```python
# 通过 Supabase SDK 写入
from supabase import create_client

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

async def save_article(article: Article):
    supabase.table("articles").upsert(article.__dict__)
```

## GitHub Actions 配置

```yaml
# .github/workflows/crawl.yml
name: Crawl

on:
  schedule:
    - cron: '0 6,14,22 * * *'  # 每天 6, 14, 22 点
  workflow_dispatch:

jobs:
  crawl:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r crawlers/requirements.txt
      - run: python -m crawlers.pipeline
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_KEY: ${{ secrets.SUPABASE_KEY }}
```

## 反爬虫策略

- 使用 `User-Agent` 轮换
- 添加合理的 `Referer` 头
- 处理 Cloudflare 等反爬机制
- 失败时记录日志并跳过
