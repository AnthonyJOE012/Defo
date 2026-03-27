/**
 * Frontend Adapter Layer
 *
 * Transforms database (snake_case) responses to frontend (camelCase) format.
 *
 * Category Mapping:
 * - news -> "Design News"
 * - paper -> "Paper"
 * - competition -> "Design Award"
 */

// Category mapping: database type -> frontend category
export const CATEGORY_MAP: Record<string, string> = {
  news: "Design News",
  paper: "Paper",
  competition: "Design Award",
} as const;

// Reverse category mapping: frontend category -> database type
export const REVERSE_CATEGORY_MAP: Record<string, string> = {
  "Design News": "news",
  "Paper": "paper",
  "Design Award": "competition",
} as const;

/**
 * Frontend Article interface (matches frontend Article.tsx)
 */
export interface Article {
  id: string;
  title: string;
  description: string;
  content?: string; // Full article body text
  category: "Design News" | "Paper" | "Design Award";
  date: string; // YYYY-MM-DD
  imageUrl: string;
  url?: string;
  authors?: string[];
  tags?: string[];
  source?: string;
}

/**
 * Source interface
 */
export interface Source {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  type: string;
  url?: string;
}

/**
 * Database article response (snake_case)
 */
interface DbArticle {
  id: string;
  title: string;
  summary?: string;
  description?: string;
  type?: string;
  category?: string;
  published_at?: string;
  date?: string;
  image_url?: string;
  imageUrl?: string;
  url: string;
  slug?: string;
  author?: string;
  authors?: string[];
  source?: Source | string;
  source_id?: string;
  content?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  is_archived?: boolean;
  external_id?: string;
  raw_data?: Record<string, unknown>;
}

/**
 * Database source response (snake_case)
 */
interface DbSource {
  id: string;
  name: string;
  slug: string;
  type: string;
  url: string;
  logo_url?: string;
  logoUrl?: string;
  is_active?: boolean;
  isActive?: boolean;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

/**
 * Database favorite response (snake_case)
 */
interface DbFavorite {
  id: string;
  article_id?: string;
  articleId?: string;
  device_id?: string;
  deviceId?: string;
  created_at?: string;
  createdAt?: string;
  article?: DbArticle;
}

/**
 * API Response meta
 */
export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: ApiMeta;
}

/**
 * Transform database article to frontend Article
 */
export function transformArticle(dbArticle: DbArticle): Article {
  // Determine category from type or category field
  let category: Article["category"] = "Design News";

  if (dbArticle.category) {
    // Already frontend format
    category = dbArticle.category as Article["category"];
  } else if (dbArticle.type) {
    // Map database type to frontend category
    category = (CATEGORY_MAP[dbArticle.type] as Article["category"]) || "Design News";
  }

  // Determine date (prefer YYYY-MM-DD format)
  let date = dbArticle.date || "";
  if (!date && dbArticle.published_at) {
    date = formatDate(dbArticle.published_at);
  }

  // Determine imageUrl
  let imageUrl = dbArticle.imageUrl || dbArticle.image_url || "";

  // Determine description
  let description = dbArticle.description || dbArticle.summary || "";

  // Handle authors
  let authors = dbArticle.authors;
  if (!authors && dbArticle.author) {
    authors = dbArticle.author.split(",").map((a) => a.trim());
  }

  return {
    id: dbArticle.id,
    title: dbArticle.title,
    description,
    content: dbArticle.content,
    category,
    date,
    imageUrl,
    url: dbArticle.url,
    authors,
    tags: dbArticle.tags,
    source: typeof dbArticle.source === 'object' ? (dbArticle.source as Source)?.name : dbArticle.source,
  };
}

/**
 * Transform database source to frontend Source
 */
export function transformSource(dbSource: DbSource): Source {
  return {
    id: dbSource.id,
    name: dbSource.name,
    slug: dbSource.slug,
    type: dbSource.type,
    url: dbSource.url,
    logoUrl: dbSource.logoUrl || dbSource.logo_url,
  };
}

/**
 * Transform database favorite to include transformed article
 */
export function transformFavorite(dbFavorite: DbFavorite): {
  id: string;
  articleId: string;
  createdAt: string;
  article: Article;
} {
  const article = dbFavorite.article ? transformArticle(dbFavorite.article) : {
    id: dbFavorite.articleId || dbFavorite.article_id || "",
    title: "",
    description: "",
    category: "Design News" as const,
    date: "",
    imageUrl: "",
  };

  return {
    id: dbFavorite.id,
    articleId: dbFavorite.articleId || dbFavorite.article_id || "",
    createdAt: dbFavorite.createdAt || dbFavorite.created_at || "",
    article,
  };
}

/**
 * Transform paginated response
 */
export function transformPaginatedResponse<T extends DbArticle>(
  response: PaginatedResponse<T>
): PaginatedResponse<Article> {
  return {
    data: response.data.map(transformArticle),
    meta: response.meta,
  };
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch {
    return dateStr;
  }
}

/**
 * Convert frontend category to database type for API requests
 */
export function categoryToType(category: Article["category"]): string {
  return REVERSE_CATEGORY_MAP[category] || "news";
}

/**
 * Convert database type to frontend category
 */
export function typeToCategory(type: string): Article["category"] {
  return (CATEGORY_MAP[type] as Article["category"]) || "Design News";
}

/**
 * Create API query parameters for articles
 */
export function buildArticlesQuery(params: {
  page?: number;
  limit?: number;
  type?: string;
  category?: Article["category"];
  days?: number;
  sourceId?: string;
}): Record<string, string | number> {
  const query: Record<string, string | number> = {};

  if (params.page) query.p_page = params.page;
  if (params.limit) query.p_limit = params.limit;
  if (params.type) query.p_type = params.type;
  if (params.category) query.p_type = categoryToType(params.category);
  if (params.days) query.p_days = params.days;
  if (params.sourceId) query.p_source_id = params.sourceId;

  return query;
}
