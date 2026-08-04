import type { Cap, Category, Lang, Tool } from './types';
import categoriesData from '../data/categories.json';
import toolsData from '../data/tools.json';
import capsTaxonomyData from '../data/caps.json';

// 工具图标：src/icons/{slug}.png（favicon.im 抓取，已统一转 PNG）
// 注意：Astro 对 .png 资产返回 { src, width, height, format } 元数据对象，URL 在 .src
const iconModules = import.meta.glob('/src/icons/*.png', { eager: true }) as Record<
  string,
  { default: { src: string } }
>;

const iconMap = new Map<string, string>();
for (const key of Object.keys(iconModules)) {
  const match = key.match(/\/([^/]+)\.png$/);
  const mod = iconModules[key]?.default;
  const url = typeof mod === 'string' ? mod : mod?.src;
  if (match && url) iconMap.set(match[1], url);
}

/** 工具图标 URL；无图标返回 undefined（组件回退首字母占位） */
export function getToolIcon(slug: string): string | undefined {
  return iconMap.get(slug);
}

// ── 能力标签 / 使用场景（toolCaps/{category}.json，按 slug 合并进工具） ──
interface CapEntry {
  slug: string;
  caps: string[];
  useCasesZh: string[];
  useCasesEn: string[];
}

const capModules = import.meta.glob('../data/toolCaps/*.json', { eager: true }) as Record<
  string,
  { default: CapEntry[] }
>;

const capsBySlug = new Map<string, CapEntry>();
for (const mod of Object.values(capModules)) {
  for (const entry of mod.default) capsBySlug.set(entry.slug, entry);
}

const capsTaxonomy = capsTaxonomyData as Cap[];
const capsById = new Map(capsTaxonomy.map((cap) => [cap.id, cap]));

/** 能力标签的双语文案 */
export function capLabel(id: string, lang: Lang): string {
  const cap = capsById.get(id);
  if (!cap) return id;
  return lang === 'zh' ? cap.zh : cap.en;
}

const allCategories = categoriesData as Category[];
const allTools = (toolsData as Tool[]).map((tool) => {
  const entry = capsBySlug.get(tool.slug);
  if (!entry) return tool;
  return {
    ...tool,
    caps: entry.caps,
    useCasesZh: entry.useCasesZh,
    useCasesEn: entry.useCasesEn,
  };
});

/** 按 order 排序的分类 */
export function getCategories(): Category[] {
  return [...allCategories].sort((a, b) => a.order - b.order);
}

export function getAllTools(): Tool[] {
  return allTools;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return allTools.find((tool) => tool.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return allCategories.find((cat) => cat.id === id);
}

export function getToolsByCategory(id: string): Tool[] {
  return allTools.filter((tool) => tool.category === id);
}

export function categoryName(cat: Category, lang: Lang): string {
  return lang === 'zh' ? cat.nameZh : cat.nameEn;
}

export function categoryDesc(cat: Category, lang: Lang): string | undefined {
  return lang === 'zh' ? cat.descZh : cat.descEn;
}

export function toolDesc(tool: Tool, lang: Lang): string {
  return lang === 'zh' ? tool.descZh : tool.descEn;
}

export function toolUseCases(tool: Tool, lang: Lang): string[] {
  return lang === 'zh' ? (tool.useCasesZh ?? []) : (tool.useCasesEn ?? []);
}

/** 按显示名匹配工具（SOP 工具清单 → 工具详情页链接用）；匹配不到返回 undefined */
export function findToolByName(name: string): Tool | undefined {
  const n = name.toLowerCase();
  return allTools.find((tool) => {
    const tn = tool.name.toLowerCase();
    return n === tn || (tn.length >= 3 && n.includes(tn));
  });
}

/** 首页分类区块展示顺序（按分类 order） */
export function getCategorySections(): { category: Category; tools: Tool[] }[] {
  return getCategories().map((category) => ({
    category,
    tools: getToolsByCategory(category.id),
  }));
}
