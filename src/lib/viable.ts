import type {
  Lang,
  ViableCategory,
  ViableResource,
  ViableStage,
  ViableTeaching,
  ViableTeachingSection,
} from './types';
import viableData from '../data/viable-coding.json';

interface ViableData {
  stages: ViableStage[];
  categories: ViableCategory[];
  resources: ViableResource[];
}

const data = viableData as ViableData;

// 站内教学页数据（按 slug 合并到资源上）
const teachingModules = import.meta.glob('../data/viable-teaching/*.json', {
  eager: true,
}) as Record<string, { default: ViableTeaching }>;
const teachingMap = new Map<string, ViableTeaching>();
for (const mod of Object.values(teachingModules)) {
  const teaching = mod.default;
  if (teaching?.slug) teachingMap.set(teaching.slug, teaching);
}

export function getViableStages(): ViableStage[] {
  return data.stages;
}

export function getViableResources(): ViableResource[] {
  return data.resources;
}

export function getViableCategories(): ViableCategory[] {
  return data.categories;
}

export function getViableResourcesByCategory(id: string): ViableResource[] {
  return data.resources.filter((r) => r.category === id);
}

export function getViableResourceBySlug(slug: string): ViableResource | undefined {
  return data.resources.find((r) => r.slug === slug);
}

export function viableCategoryName(cat: ViableCategory, lang: Lang): string {
  return lang === 'zh' ? cat.nameZh : cat.nameEn;
}

export function viableCategoryDesc(cat: ViableCategory, lang: Lang): string | undefined {
  return lang === 'zh' ? cat.descZh : cat.descEn;
}

export function viableResourceDesc(res: ViableResource, lang: Lang): string {
  return lang === 'zh' ? res.descZh : res.descEn;
}

/** 资源分类区块（按 categories 数组顺序） */
export function getViableSections(): { category: ViableCategory; resources: ViableResource[] }[] {
  return getViableCategories().map((category) => ({
    category,
    resources: getViableResourcesByCategory(category.id),
  }));
}

/** 22654 → "22.7k"，5862 → "5.9k"，954 → "954" */
export function formatStars(n: number): string {
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
}

// ── 站内教学页 ──
export function getViableTeaching(slug: string): ViableTeaching | undefined {
  return teachingMap.get(slug);
}

export function viableTeachingIntro(t: ViableTeaching, lang: Lang): string {
  return lang === 'zh' ? t.introZh : t.introEn;
}

export function viableTeachingAudience(t: ViableTeaching, lang: Lang): string {
  return lang === 'zh' ? t.audienceZh : t.audienceEn;
}

export function viableTeachingSections(t: ViableTeaching, lang: Lang): ViableTeachingSection[] {
  return lang === 'zh' ? t.sectionsZh : t.sectionsEn;
}

export function viableTeachingPractice(t: ViableTeaching, lang: Lang): string[] {
  return lang === 'zh' ? t.practiceZh : t.practiceEn;
}
