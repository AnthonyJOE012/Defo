# Defo - Design Industry Information Aggregator

> Design 行业信息聚合阅读器：行业新闻、学术论文、设计比赛

## 项目状态

🚧 **开发中** - Phase 1 基础架构搭建进行中

---

## 功能特性

- [x] 行业信息聚合 (19 个来源)
- [x] 学术论文搜索 (5 个来源)
- [x] 设计比赛信息 (40+ 个来源)
- [ ] 全文搜索
- [ ] 分类筛选
- [ ] 本地收藏
- [ ] 离线浏览
- [ ] 每日自动更新

---

## 技术架构

### 数据流

```
GitHub Actions (定时爬虫)
        │
        ▼
Supabase PostgreSQL (云端存储)
        │
        ├──────────────────┐
        ▼                  ▼
Vercel (前端)         IndexedDB (本地缓存)
```

### 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | React 18 + Vite | TypeScript |
| 状态管理 | Zustand | 全局状态 |
| 数据获取 | TanStack Query + Dexie.js | 服务端 + 本地 |
| 本地存储 | IndexedDB | 离线浏览 |
| 数据库 | Supabase PostgreSQL | 云端存储 |
| 爬虫 | Python | httpx + beautifulsoup4 + scholarly |
| 定时任务 | GitHub Actions | 每日 3 次 |
| 部署 | Vercel | 前端托管 |

---

## 快速开始

### 第一步：创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com) 并登录
2. 点击 **New Project**
3. 填写项目信息：
   - Organization: 选择或创建
   - Name: `defo`
   - Database Password: 生成强密码并保存
   - Region: 选择靠近你的区域
4. 等待项目创建完成（约 2 分钟）

### 第二步：获取 API Keys

1. 进入 **Settings > API**
2. 复制以下信息：
   - `Project URL` → `SUPABASE_URL`
   - `anon public` → `SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### 第三步：配置环境变量

```bash
# 在项目根目录
cd /Users/anthony/Desktop/Defo
cp .env.example .env.local

# 编辑 .env.local，填入你的 Supabase credentials
```

### 第四步：运行数据库迁移

```bash
# 安装 Supabase CLI（如果还没安装）
npm install -g supabase

# 链接你的项目
npx supabase link --project-ref your-project-ref

# 推送数据库迁移
npx supabase db push

# 验证迁移成功
npx supabase migration list
```

### 第五步：安装前端依赖

```bash
cd frontend
npm install
npm run dev
```

### 第六步：配置 GitHub Secrets（后续部署用）

在 GitHub 仓库 **Settings > Secrets and variables > Actions** 添加：

| Secret Name | Value |
|-------------|-------|
| `SUPABASE_URL` | 你的 Supabase Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | 你的 Service Role Key |

---

## 项目结构

```
Defo/
├── frontend/                 # React + Vite 前端
│   ├── src/
│   │   ├── app/            # 页面和组件
│   │   ├── services/       # API 服务
│   │   └── lib/            # 工具库
├── crawlers/               # Python 爬虫
│   ├── news/               # 行业新闻爬虫
│   ├── papers/             # 学术论文爬虫
│   └── competitions/       # 设计比赛爬虫
├── supabase/
│   └── migrations/         # 数据库迁移
├── docs/
│   └── api.md             # 接口文档
├── .github/
│   └── workflows/         # GitHub Actions
└── .claude/               # Claude Code 配置
```

---

## 实施阶段

| 阶段 | 内容 | 状态 |
|------|------|------|
| Phase 0 | 项目规划 & 文档 | ✅ 完成 |
| Phase 1 | 基础架构搭建 | ✅ 完成 |
| Phase 2 | 爬虫开发 | ✅ 完成 |
| Phase 3 | 前端核心开发 | ✅ 完成 |
| Phase 4 | 本地化与同步 | ✅ 完成 |
| Phase 5 | 搜索与筛选 | ✅ 完成 |
| Phase 6 | 收藏功能 | ✅ 完成 |
| Phase 7 | 部署与优化 | ✅ 完成 |

---

## 前端运行

```bash
cd frontend
npm install
npm run dev
# 访问 http://localhost:5173
```

## 爬虫运行

```bash
cd crawlers
pip install -r requirements.txt
python -m crawlers.pipeline
```

---

## 需要帮助？

- [Supabase 文档](https://supabase.com/docs)
- [Vercel 部署](https://vercel.com/docs)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## License

MIT
