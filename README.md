# 冷丶布丁的个人空间 (ColdPudding Space) - 完整项目文档

这是一个基于 **React 19** + **TypeScript** + **Bootstrap 5.3** 构建的高性能个人门户网站。本项目集成了**深度思考博文系统**、**极客实验室工具站**以及**全功能的后台管理系统**。

---

## 1. 项目目录结构预览

```text
.
├── index.html              # 项目入口 HTML 文件（配置了全局样式和字体）
├── index.tsx               # React 渲染入口，挂载 App 组件
├── App.tsx                 # 核心逻辑组件：包含全局状态管理、路由配置、导航栏实现
├── types.ts                # TypeScript 类型定义文件，规范数据结构
├── metadata.json           # 应用元数据及权限请求配置
├── README.md               # 项目使用与部署指南（本文件）
├── DEPLOY_GUIDE.md         # 简易部署指南
├── pages/                  # 页面组件目录
│   ├── HomePage.tsx        # 首页：展示品牌视觉、最新文章预览及工具预览
│   ├── ArticleList.tsx     # 文章列表页：带搜索和分类筛选的博客列表
│   ├── ArticleDetail.tsx   # 文章详情页：Markdown 渲染及登录用户评论功能
│   ├── ToolsGrid.tsx       # 工具广场：展示所有工具，包含付费解锁(PRO)逻辑
│   ├── ToolDetail.tsx      # 工具详情页：具体工具逻辑实现（AI、Markdown、JSON等）
│   ├── AuthPage.tsx        # 认证页面：登录/注册逻辑，包含 Mock 身份验证
│   ├── AdminDashboard.tsx  # 后台管理系统：文章发布(CMS)、工具配置、数据概览
│   └── ProfilePage.tsx     # 个人中心：用户身份标识、权限展示、足迹记录
└── [其他辅助文件]
```

---

## 2. 文件功能详细说明

### 核心配置文件
- **`index.html`**: 采用了响应式设计，引入了 Bootstrap 5.3。特别定义了 `.navbar-refined` 和 `.input-group-refined` 等高级 CSS 类，确保视觉上的“精致感”。
- **`App.tsx`**: 应用的“大脑”。负责监听滚动状态以改变导航栏样式，处理全局的 `user` 状态，并定义了所有受保护路由的访问控制。

### 页面组件 (pages/)
- **`AdminDashboard.tsx`**: **管理员专属**。实现了完整的文章 CRUD（增删改查）。它使用了 `localStorage` 作为演示数据库，但预留了连接 Supabase 的接口。
- **`ToolsGrid.tsx`**: 实现了 **模拟支付逻辑**。当普通用户点击 PRO 工具时，会触发一个精致的支付弹窗。
- **`ToolDetail.tsx`**: 集成了 **Gemini API**。在 `gemini-ai` 路由下，通过 `GoogleGenAI` SDK 直接调用大模型，实现了智能文案生成。
- **`ArticleDetail.tsx`**: 使用 `marked` 库将 Markdown 字符串渲染为 HTML，并包含了一个仅限登录用户使用的评论区。

---

## 3. 后端调用方法 (连接数据库/API)

目前项目中使用 `localStorage` 进行数据持久化演示。要切换到真正的后端（如 Node.js/Python 或 Supabase），请参考以下方法：

### A. 使用 Axios 进行 API 调用
建议在根目录创建 `api/client.ts`:
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-api-domain.com/api',
  headers: { 'Content-Type': 'application/json' }
});

// 示例：获取文章
export const getArticles = () => api.get('/articles');
// 示例：发布文章（需要 Admin Token）
export const postArticle = (data) => api.post('/articles', data, {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});
```

### B. 连接 Supabase
在 `AdminDashboard.tsx` 或 `ArticleList.tsx` 中替换逻辑：
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

// 获取数据
const { data: articles } = await supabase.from('articles').select('*');
```

---

## 4. 生产环境部署配置

在发布到服务器（如 Nginx, Vercel, 或云服务器）之前，请务必完成以下配置：

### 第一步：Gemini API Key 配置
项目中 `ToolDetail.tsx` 需要 API Key 才能运行 AI 功能。
- **不要将 Key 硬编码在代码中发布！**
- 在生产环境中，应通过 CI/CD 工具（如 GitHub Actions）或服务器环境变量注入 `process.env.API_KEY`。

### 第二步：Nginx 静态托管配置
如果你使用 Nginx 部署，请确保配置了 **单页应用(SPA) 路由回退**，否则刷新页面会出现 404：
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/coldpudding_site;
    index index.html;

    location / {
        # 核心配置：所有请求都指向 index.html，由前端路由接管
        try_files $uri $uri/ /index.html;
    }

    # 开启 Gzip 压缩以提高加载速度
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
```

### 第三步：HTTPS 安全配置
- **必须配置 SSL 证书**：由于本项目包含登录和模拟支付功能，Chrome 浏览器会要求必须在 HTTPS 环境下运行，否则 `localStorage` 和部分 Web API 可能会受到限制。
- 推荐使用 **Let's Encrypt (Certbot)** 免费获取证书。

### 第四步：环境变量检查
确保 `metadata.json` 中的信息已根据你的实际网站域名更新，这会影响 SEO 和社交媒体分享时的预览效果。

---

## 5. 权限账号测试
- **管理员 (Admin)**: `admin@geek.com` / `admin`
- **VIP 用户 (PRO)**: `vip@geek.com` / `vip`
- **普通用户**: 注册任意账号即可

---
© 2026 冷丶布丁的个人空间. Built with Passion and Code.