# 抢路头·财神封神殿 部署指南

> 本指南适用于将本项目部署到 **GitHub Pages** 或 **Cloudflare Pages**。
> 项目已内置完整的 CI/CD 工作流，推送代码即可自动部署。

---

## 前置条件

1. 已将本项目连接到 GitHub 仓库（Lovable → Settings → GitHub → Connect）
2. 如项目使用了 Lovable Cloud（Supabase），准备好以下两个值：

   | 变量名 | 说明 |
   |--------|------|
   | `VITE_SUPABASE_URL` | Supabase 项目 URL |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key（公开密钥） |

---

## 方案一：GitHub Pages

### 步骤 1 — 确认仓库类型

| 仓库类型 | 访问地址 | `VITE_BASE_URL` | `404.html` 的 `base` |
|----------|----------|-----------------|----------------------|
| **用户级**（`username.github.io`） | `https://username.github.io/` | `/` | `''` |
| **项目级**（如 `fortune-forge-fest`） | `https://username.github.io/fortune-forge-fest/` | `/fortune-forge-fest/` | `'/fortune-forge-fest'` |

> ⚠️ 当前配置为**项目级**（`/fortune-forge-fest/`）。如果你的仓库名不同，需同步修改：
> 1. `.github/workflows/deploy-pages.yml` → `VITE_BASE_URL`
> 2. `public/404.html` → `var base = '/你的仓库名'`

### 步骤 2 — 添加 GitHub Secrets

```
仓库 → Settings → Secrets and variables → Actions → New repository secret
```

添加 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_PUBLISHABLE_KEY`（如需要）。

### 步骤 3 — 开启 GitHub Pages

```
仓库 → Settings → Pages → Source → 选择 "GitHub Actions"
```

### 步骤 4 — 触发部署

推送代码到 `main`/`master`，或手动触发 Actions。

---

## 方案二：Cloudflare Pages

### 步骤 1 — 获取 Cloudflare API Token

Cloudflare Dashboard → My Profile → API Tokens → Create Custom Token：
- 权限：`Account > Cloudflare Pages > Edit`

### 步骤 2 — 获取 Account ID

Workers & Pages 页面右侧边栏。

### 步骤 3 — 创建 Pages 项目

在 Cloudflare Dashboard 创建项目，**名称必须为 `fortune-forge-fest`**（与 workflow 一致）。

### 步骤 4 — 添加 GitHub Secrets

| Secret 名称 | 来源 |
|-------------|------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare |
| `VITE_SUPABASE_URL` | Lovable Cloud |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Lovable Cloud |

### 步骤 5 — 触发部署

推送代码到 `main`/`master`，或手动触发 Actions。

---

## 常见问题

### npm ci 失败？
本项目使用 bun 作为主包管理器，workflow 已配置为 `npm install`（非 `npm ci`）。

### GitHub Pages 刷新 404？
检查 `VITE_BASE_URL` 和 `404.html` 中的 `base` 是否与仓库名一致。

### Cloudflare wrangler exit code 1？
99% 是 API Token 权限不足，确认有 `Cloudflare Pages: Edit` 权限。

### Cloudflare 提示 project not found？
在 Dashboard 手动创建 Pages 项目，名称必须与 `--project-name=` 完全一致。
