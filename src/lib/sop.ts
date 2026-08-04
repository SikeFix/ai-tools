import type { Lang, SopArticle } from './types';
import { findToolByName } from './tools';

// key 形如：'../data/sop/zh/plan-a-voiceover.json'
const modules = import.meta.glob('../data/sop/**/*.json', { eager: true }) as Record<
  string,
  SopArticle
>;

function keyToParts(key: string): { lang: Lang; slug: string } | null {
  const match = key.match(/\.\.\/data\/sop\/(zh|en)\/([^/]+)\.json$/);
  if (!match) return null;
  return { lang: match[1] as Lang, slug: match[2] };
}

/** 某语言下全部 SOP，按 slug（plan-a/plan-b/plan-c）排序 */
export function getSopArticles(lang: Lang): SopArticle[] {
  const articles = Object.entries(modules)
    .map(([key, value]) => {
      const parts = keyToParts(key);
      return parts && parts.lang === lang ? value : null;
    })
    .filter((article): article is SopArticle => article !== null);

  return articles.sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getSopBySlug(lang: Lang, slug: string): SopArticle | undefined {
  return getSopArticles(lang).find((article) => article.slug === slug);
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** 方案编号字母（按 plan-a → plan-z 顺序） */
export function getSopLetter(slug: string): string {
  const all = getSopArticles('zh');
  const idx = all.findIndex((article) => article.slug === slug);
  return idx >= 0 && idx < LETTERS.length ? LETTERS[idx] : String(idx + 1);
}

// ── SOP 分组（视频制作 / 内容创作 / 效率提升） ──
export const sopGroupIds = ['video', 'content', 'productivity'] as const;
export type SopGroupId = (typeof sopGroupIds)[number];

const SOP_GROUPS: Record<string, SopGroupId> = {
  'plan-a-voiceover': 'video',
  'plan-b-storyboard': 'video',
  'plan-c-avatar': 'video',
  'plan-d-cinematic': 'video',
  'plan-o-avatar-live': 'video',
  'plan-r-video-edit': 'video',
  'plan-e-writing': 'content',
  'plan-f-image-design': 'content',
  'plan-h-translation': 'content',
  'plan-l-podcast': 'content',
  'plan-n-social-media': 'content',
  'plan-q-music': 'content',
  'plan-g-coding': 'productivity',
  'plan-i-slides': 'productivity',
  'plan-j-data-analysis': 'productivity',
  'plan-k-meeting-notes': 'productivity',
  'plan-m-learning': 'productivity',
  'plan-p-customer-service': 'productivity',
  'plan-s-ecommerce': 'productivity',
};

export function getSopGroup(slug: string): SopGroupId {
  return SOP_GROUPS[slug] ?? 'productivity';
}

/** 按分组顺序返回 SOP（组内按 slug 排序） */
export function getSopsByGroup(lang: Lang): { group: SopGroupId; articles: SopArticle[] }[] {
  return sopGroupIds.map((group) => ({
    group,
    articles: getSopArticles(lang).filter((article) => getSopGroup(article.slug) === group),
  }));
}

/** 找到在「用到的工具」中引用了指定工具的 SOP（工具详情 → 推荐工作流） */
export function getSopsUsingTool(toolSlug: string): SopArticle[] {
  return getSopArticles('zh').filter((article) =>
    article.toolsNeeded.some((tool) => findToolByName(tool.name)?.slug === toolSlug),
  );
}
