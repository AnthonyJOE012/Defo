# Defo 部署检查清单

## 部署前检查

- [ ] 所有测试通过
- [ ] 构建成功 (npm run build)
- [ ] 环境变量已配置
- [ ] GitHub Secrets 已设置

## Vercel 部署

1. 登录 Vercel
2. Import GitHub 仓库 `your-username/defo`
3. 配置 Environment Variables
4. Deploy

## GitHub Actions 自动部署

Push 到 main 分支自动触发部署。

## 验证部署

- [ ] 首页加载正常
- [ ] 文章列表显示
- [ ] 搜索功能正常
- [ ] 收藏功能正常
- [ ] 分类筛选正常
