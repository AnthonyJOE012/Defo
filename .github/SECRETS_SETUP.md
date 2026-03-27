# GitHub Secrets 配置

在 GitHub 仓库 Settings > Secrets and variables > Actions 中添加以下 Secrets：

## Required Secrets

| Secret Name | Value | Description |
|------------|-------|-------------|
| `VERCEL_TOKEN` | your-vercel-token | Vercel API Token |
| `VERCEL_ORG_ID` | team_random_id | Vercel Organization ID |
| `VERCEL_PROJECT_ID` | prj_random_id | Vercel Project ID |
| `VITE_SUPABASE_URL` | https://xxx.supabase.co | Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | eyJhbG... | Supabase Anon Key |

## 获取方法

### Vercel Token
1. 登录 https://vercel.com
2. Settings > Tokens
3. Create New Token
4. 复制 token 值

### Vercel Org ID 和 Project ID
```bash
npm i -g vercel
cd frontend
vercel link
cat .vercel/project.json
```

### Supabase URL 和 Anon Key
1. 登录 https://app.supabase.com
2. 进入 defo 项目
3. Settings > API
4. 复制 Project URL 和 anon public key
