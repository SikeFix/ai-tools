import type { Lang, ViableCategory, ViableResource, ViableStage } from './types';
import viableData from '../data/viable-coding.json';

interface ViableData {
  stages: ViableStage[];
  categories: ViableCategory[];
  resources: ViableResource[];
}

const data = viableData as ViableData;

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
