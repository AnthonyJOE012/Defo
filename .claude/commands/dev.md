# 开发命令

> Defo 项目常用开发命令

## 前端

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 类型检查
npm run typecheck

# ESLint
npm run lint

# 测试
npm run test

# 测试覆盖率
npm run test:coverage

# E2E 测试
npm run test:e2e
```

## 爬虫

```bash
# 进入爬虫目录
cd crawlers

# 安装依赖
pip install -r requirements.txt

# 运行爬虫（本地测试）
python -m crawlers.pipeline

# 代码检查
ruff check .

# 格式化
ruff format .

# 测试
pytest
```

## Supabase

```bash
# 登录
npx supabase login

# 链接本地项目
npx supabase link --project-ref <ref>

# 推送迁移
npx supabase db push

# 启动本地 Supabase
supabase start

# 查看 API 文档
npx supabase docs
```

## Git

```bash
# 创建功能分支
git checkout -b feat/your-feature

# 提交
git add .
git commit -m "feat(scope): description"

# Push
git push -u origin HEAD

# 创建 PR
gh pr create
```
