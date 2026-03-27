# 部署命令

> Defo 项目部署相关命令

## 前端部署 (Vercel)

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 预览部署
vercel

# 生产部署
vercel --prod

# 环境变量
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

## GitHub Actions

```bash
# 手动触发爬虫 workflow
gh workflow run crawl.yml

# 查看 workflow 状态
gh run list --workflow=crawl.yml
```

## 数据库

```bash
# 迁移状态
npx supabase migration list

# 重置数据库（危险！）
npx supabase db reset
```

## 监控

```bash
# 检查 Vercel 日志
vercel logs your-project

# Cloudflare 状态
# 访问 https://dash.cloudflare.com
```

## 回滚

```bash
# Vercel 回滚
vercel rollback

# 数据库回滚需要手动执行 SQL
```
