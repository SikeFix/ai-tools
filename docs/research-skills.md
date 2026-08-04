# 调研：建站 skills 与最佳实践（2026-08）

## 技术选型结论（本站采用）

- **Astro 5**（构建期生成、getStaticPaths 数据驱动），优于 Hugo（模板语法陡）与 Next.js（纯内容站过重）
- **Tailwind 4** 用 `@tailwindcss/vite` 插件（`@astrojs/tailwind` 已 deprecated）
- 不引 React：搜索/筛选/暗色切换用纯 TS 渐进增强，零运行时
- 数据全放 JSON，构建时按条目生成静态页（改 JSON 即更新）
- 搜索：条目 <200 时纯前端 DOM 过滤即可，不引 Pagefind
- i18n：Astro 内置 + `[...lang]` catch-all 路由（默认语言根路径、en 在 /en/）
- 暗色：CSS 变量 + `.dark` 类 + head 内联脚本防 FOUC；Tailwind 4 需 `@custom-variant dark`

## 值得装的建站 skills / 插件

- `anthropic/frontend-design` 插件：写码前定美学方向，规避 AI 默认套路（Inter 字体 + 紫色渐变）
- `anthropics/skills` 官方仓库：`web-artifacts-builder`、`theme-factory`、`webapp-testing`
- 社区：UI/UX Pro Max、ckw-design、Power Design、Design Tokens Skill（OKLCH 配色）
- MCP：Playwright（截图验证）、Figma MCP（设计稿转代码）、Chrome DevTools（调试）

## 可参考开源项目

- **AINav**（shellsec/AINav）：纯前端 + site-data.json 驱动，最贴近本站
- **Tap4-AI-WebUI**（Next.js + Supabase）：需账号/后台时升级用
- 数据种子：`awesome-ai-tools` 系列 / `LichAmnesia/awesome-ai-tools-dataset`

## SEO 要点

每工具独立详情页（干净 slug）；首页 + 分类页；JSON-LD（SoftwareApplication / ItemList）；sitemap + hreflang（zh-CN / en / x-default）；canonical + 面包屑。
