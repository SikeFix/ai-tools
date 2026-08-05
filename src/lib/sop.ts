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

/** 某语言下全部 SOP，按 plan-a → plan-z → plan-aa 自然序排序 */
export function getSopArticles(lang: Lang): SopArticle[] {
  const articles = Object.entries(modules)
    .map(([key, value]) => {
      const parts = keyToParts(key);
      return parts && parts.lang === lang ? value : null;
    })
    .filter((article): article is SopArticle => article !== null);

  return articles.sort((a, b) => sopSlugIndex(a.slug) - sopSlugIndex(b.slug));
}

export function getSopBySlug(lang: Lang, slug: string): SopArticle | undefined {
  return getSopArticles(lang).find((article) => article.slug === slug);
}

const LETTER_NUM: Record<string, number> = {};
'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((ch, i) => {
  LETTER_NUM[ch] = i + 1;
});

/** 解析 plan- 后的字母段为序号：A→1, Z→26, AA→27, AW→49（bijective base-26） */
export function sopSlugIndex(slug: string): number {
  const m = slug.match(/^plan-([a-z]+)-/i);
  const letters = m ? m[1].toUpperCase() : '';
  let num = 0;
  for (const ch of letters) {
    num = num * 26 + (LETTER_NUM[ch] ?? 0);
  }
  return num;
}

/** 方案编号字母：plan-g-coding → G，plan-aa-animation-short → AA */
export function getSopLetter(slug: string): string {
  const m = slug.match(/^plan-([a-z]+)-/i);
  return m ? m[1].toUpperCase() : slug.toUpperCase();
}

// ── SOP 分组（视频制作 / 内容创作 / 效率提升 / AI 编程） ──
export const sopGroupIds = ['video', 'content', 'productivity', 'coding'] as const;
export type SopGroupId = (typeof sopGroupIds)[number];

const SOP_GROUPS: Record<string, SopGroupId> = {
  'plan-a-voiceover': 'video',
  'plan-b-storyboard': 'video',
  'plan-c-avatar': 'video',
  'plan-d-cinematic': 'video',
  'plan-o-avatar-live': 'video',
  'plan-r-video-edit': 'video',
  'plan-t-product-demo': 'video',
  'plan-u-short-video-matrix': 'video',
  'plan-v-ecommerce-video': 'video',
  'plan-w-doc-narration': 'video',
  'plan-x-music-mv': 'video',
  'plan-y-live-clip': 'video',
  'plan-z-tutorial-video': 'video',
  'plan-aa-animation-short': 'video',
  'plan-ab-ad-film': 'video',
  'plan-ac-vlog-ip': 'video',
  'plan-e-writing': 'content',
  'plan-f-image-design': 'content',
  'plan-h-translation': 'content',
  'plan-l-podcast': 'content',
  'plan-n-social-media': 'content',
  'plan-q-music': 'content',
  'plan-ad-children-book': 'content',
  'plan-ae-comic': 'content',
  'plan-af-audiobook': 'content',
  'plan-ag-resume': 'content',
  'plan-ah-marketing-copy': 'content',
  'plan-ai-novel': 'content',
  'plan-aj-newsletter': 'content',
  'plan-ak-wechat-weibo': 'content',
  'plan-al-social-calendar': 'content',
  'plan-am-product-copy': 'content',
  'plan-g-coding': 'coding',
  'plan-i-slides': 'productivity',
  'plan-j-data-analysis': 'productivity',
  'plan-k-meeting-notes': 'productivity',
  'plan-m-learning': 'productivity',
  'plan-p-customer-service': 'productivity',
  'plan-s-ecommerce': 'productivity',
  'plan-an-contract-review': 'productivity',
  'plan-ao-prd': 'productivity',
  'plan-ap-competitor-analysis': 'productivity',
  'plan-aq-course-design': 'productivity',
  'plan-ar-paper-writing': 'productivity',
  'plan-as-travel-planning': 'productivity',
  'plan-at-personal-finance': 'productivity',
  'plan-au-health-fitness': 'productivity',
  'plan-av-interview-prep': 'productivity',
  'plan-aw-team-sop': 'productivity',
  'plan-ax-context-engineering': 'coding',
  'plan-ay-vibe-to-viable': 'coding',
  'plan-az-coding-security-testing': 'coding',
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
