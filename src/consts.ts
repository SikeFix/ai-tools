import type { Lang } from './lib/types';

/** 站点正式域名：canonical / og:url / sitemap 依赖它 */
export const SITE_URL = 'https://ai-tools.keorigin.com';

export const SITE_NAME: Record<Lang, string> = {
  zh: 'AI 工具导航',
  en: 'AI Tools Hub',
};

export const SITE_TAGLINE: Record<Lang, string> = {
  zh: '精选 AI 工具 · 工作流',
  en: 'Curated AI tools · Workflows',
};

export const SITE_DESCRIPTION: Record<Lang, string> = {
  zh: '汇总 12 大类主流 AI 工具，并附 AI 视频制作的标准工作流，助你从入门到产出。',
  en: 'A curated directory of AI tools across 12 categories, plus standard workflows for AI video production.',
};
