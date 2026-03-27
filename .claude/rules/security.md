# 安全规范

> Defo 项目安全要求

## 密钥管理

### 禁止行为

- ❌ 禁止将密钥提交到 Git
- ❌ 禁止在代码中硬编码密钥
- ❌ 禁止在日志中打印密钥

### 正确做法

- ✅ 使用环境变量
- ✅ 使用 GitHub Secrets
- ✅ 使用 `.env.example` 模板

```bash
# .env.example (提交到 Git)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key

# .env.local (不提交)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
```

## GitHub Secrets

| Secret | 说明 |
|--------|------|
| `SUPABASE_URL` | Supabase 项目 URL |
| `SUPABASE_KEY` | Supabase 服务密钥 |
| `CLOUDFLARE_R2_*` | R2 存储凭证 |

## 前端安全

### 认证

- 使用 Supabase Anon Key（公开）
- 设备 ID 通过 `X-Device-ID` Header 传递
- RLS (Row Level Security) 保护用户数据

### XSS 防护

- React 自动转义
- 不要使用 `dangerouslySetInnerHTML`
- 用户输入必须验证

### CORS

- Vercel 配置允许的域名
- API 响应头设置正确

## 爬虫安全

### 请求限制

- 遵守 `robots.txt`
- 设置合理的请求频率
- 不抓取需要登录的内容

### 隐私

- 不存储敏感信息
- 爬取的数据仅用于聚合展示

## 依赖安全

```bash
# 前端
npm audit
npm audit fix

# Python
pip audit
```

## 数据库安全

### RLS 策略

```sql
-- favorites 表：只能访问自己的收藏
CREATE POLICY favorites_own ON favorites
    FOR ALL USING (device_id = current_setting('request.headers', true)::json->>'x-device-id');
```

### 避免 SQL 注入

- 使用 Supabase SDK（参数化查询）
- 不要拼接 SQL 字符串
