# AI 工具导航 · AI Tools Hub

> 🚀 **线上地址：https://ai-tools.keorigin.com** ｜ 中英双语 ｜ Apple Liquid Glass 视觉风格

一个「AI 工具汇总 + AI 视频 SOP + 常用 Skills」多板块静态网站，中英双语，Apple Liquid Glass 视觉风格。

- **工具板块**：12 大类、106 款主流 AI 工具（含 2026 GitHub 热榜项目 OpenClaw / browser-use / RAGFlow 等），含**真实图标**、**能力标签**与**使用场景**；支持搜索 / 分类 / 价格筛选、暗色模式、每款工具独立详情页。
- **SOP 板块**：49 套可复用的 AI 工作流，按「视频制作 / 内容创作 / 效率提升」分组（视频 16 套：口播/分镜/数字人/电影级/直播/剪辑/宣传片/短视频矩阵/电商/科普旁白/MV/直播切片/教程/动画/广告/品牌 vlog；内容 17 套：写作/出图/翻译/播客/社媒/音乐/绘本/漫画/有声书/简历/营销文案/小说/简报/公众号/内容日历/电商文案；效率 16 套：编程/PPT/数据分析/会议/学习/客服/电商/合同/PRD/竞品/课程/论文/旅行/理财/健身/面试/团队 SOP），含分步骤、工具、耗时与避坑清单；工作流内工具可直达站内工具详情页，详情页含「同类工作流」内链。
- **Skills 板块**：118 个常用 Claude Code / AI 技能与 MCP 目录（含 superpowers / ECC / karpathy-skills 热榜与 filesystem / fetch / firecrawl / docker 等真实 MCP），每个技能有独立详情页（能做什么 / 安装方式 / 来源 / 相关技能），标注官方/社区/内置来源。
- **全局体验**：工具 / SOP / Skills 三页均有搜索过滤（首页支持 `?q=` 搜索深链）；工具详情「推荐工作流」直达相关 SOP，SOP 内工具直达工具详情（双向互链）；回到顶部按钮；增强页脚导航；键盘 focus 可访问性。
- **SEO**：中英 hreflang + canonical + sitemap；首页 WebSite/SearchAction、详情页 BreadcrumbList + SoftwareApplication/HowTo、列表页 ItemList 结构化数据；og 完整标签（locale:alternate / image 尺寸 / article:section / article:tag）；theme-color。

技术栈：**Astro 5+ · Tailwind CSS 4 · 纯前端渐进增强 JS**（无 React，零运行时框架）。视觉遵循 `.claude/skills/apple-design/`（Apple 液态玻璃规范：冷灰白地 + 统一面板 + 发丝分割线 + 单一蓝色强调）。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 本地开发 http://localhost:4321 |
| `npm run build` | 产出静态站点到 `dist/`（中文在根路径 `/`，英文在 `/en/`） |
| `npm run preview` | 本地预览构建产物 |
| `npm run validate` | 校验 `src/data/` 数据形状 |
| `npm run check` | `astro check` 类型检查 |

## 如何新增工具

1. 编辑 `src/data/tools.json`，按现有结构加一条：`slug / name / url / category / price / tags / descZh / descEn`。
2. 在 `src/data/toolCaps/<分类>.json` 加对应的能力标签（caps 需在 `src/data/caps.json` 词表内）与使用场景。
3. 运行 `node scripts/fetch-icons.mjs` 抓取图标（写入 `src/icons/`）。
4. `npm run validate` 确认通过，`npm run build` 后即可看到（无需改代码）。

## 如何新增 SOP

在 `src/data/sop/zh/` 与 `src/data/sop/en/` 各加一份同名 JSON（结构见现有 `plan-g-coding.json`），`validate` 会检查 zh/en 一一对应。SOP 卡片按编号自然序排序（plan-a → plan-z → plan-aa），新方案对应组映射需在 `src/lib/sop.ts` 的 `SOP_GROUPS` 里登记。

## 如何新增 Skill

编辑 `src/data/skills.json` 加一条（category 需在 `src/data/skillCategories.json` 内），`npm run validate` 通过即可。

## 目录速览

```
src/
├── data/           # 内容数据源（工具 / 分类 / toolCaps 能力 / SOP / skills / caps 词表）
├── icons/          # 工具真实图标（favicon.im 抓取，fetch-icons.mjs 管理）
├── lib/            # 类型 + loader + i18n 辅助
├── i18n/           # UI 字符串表（zh/en）
├── components/     # 页面组件
├── layouts/        # BaseLayout（SEO head / 暗色脚本 / Header / Footer）
├── scripts/        # 客户端 JS（搜索筛选、主题切换）
└── pages/          # [...lang] catch-all 路由 → 中文根路径、英文 /en/
.claude/skills/apple-design/   # 本项目视觉遵循的 Apple 设计 skill
```

## 部署

纯静态站点，构建产物在 `dist/`，可部署到任意静态托管（CDN / Nginx / Netlify / Vercel / GitHub Pages 均可）。

本项目生产环境使用 **腾讯云边缘（EdgeOne CDN）→ 回源服务器** 模式：

```sh
npm run build
rsync -av --delete dist/ 用户@服务器:/目标路径/
```

`astro.config.mjs` 里 `site: 'https://ai-tools.keorigin.com'`，决定 canonical / og:url / sitemap 的域名，迁移部署时记得同步修改。

## 调研来源

`docs/` 目录存有三份网上调研笔记：AI 工具汇总站结构、AI 视频制作 SOP、建站 skills 最佳实践。
