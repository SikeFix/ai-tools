export type Lang = 'zh' | 'en';
export type PriceTier = 'Free' | 'Freemium' | 'Paid';

export interface Tool {
  /** 唯一 slug，用于 URL，如 "sora" */
  slug: string;
  /** 主名（工具英文原名） */
  name: string;
  /** 官网完整 URL */
  url: string;
  /** 对应 Category.id */
  category: string;
  price: PriceTier;
  /** 英文小写标签，如 ["text-to-video","cinematic"] */
  tags?: string[];
  /** 一句话中文描述 */
  descZh: string;
  /** 一句话英文描述 */
  descEn: string;
  /** 能力标签（对应 caps.json 的 id），由 toolCaps 合并注入 */
  caps?: string[];
  /** 能做的具体事（中文） */
  useCasesZh?: string[];
  /** 能做的具体事（英文） */
  useCasesEn?: string[];
}

export interface Cap {
  id: string;
  zh: string;
  en: string;
}

export type SkillSource = 'official' | 'community' | 'builtin';

export interface Skill {
  slug: string;
  name: string;
  /** 来源链接（GitHub / 文档） */
  url?: string;
  /** 对应 SkillCategory.id */
  category: string;
  source: SkillSource;
  /** 安装方式说明 */
  install?: string;
  tags?: string[];
  descZh: string;
  descEn: string;
  /** 能做的具体事（中文），由 skillDetails 合并注入 */
  useCasesZh?: string[];
  /** 能做的具体事（英文） */
  useCasesEn?: string[];
}

export interface SkillCategory {
  id: string;
  nameZh: string;
  nameEn: string;
  descZh?: string;
  descEn?: string;
}

export interface Category {
  id: string;
  /** 1-12，控制首页区块顺序 */
  order: number;
  nameZh: string;
  nameEn: string;
  descZh?: string;
  descEn?: string;
}

export interface SopStep {
  id: string;
  title: string;
  /** 本步使用的工具名 */
  tool?: string;
  toolUrl?: string;
  /** 耗时描述，如 "5-10分钟" */
  time?: string;
  /** 步骤正文 */
  detail: string;
  /** 高亮建议 */
  tips?: string;
}

export interface SopArticle {
  slug: string;
  title: string;
  /** 一句话链路速览 */
  summary: string;
  /** 适用场景 */
  scenario: string;
  meta: {
    duration: string;
    cost: string;
    difficulty: string;
  };
  toolsNeeded: { name: string; url?: string }[];
  steps: SopStep[];
  pitfalls: { title: string; detail: string }[];
}

export interface ViableStage {
  id: string;
  nameZh: string;
  nameEn: string;
  descZh: string;
  descEn: string;
}

export interface ViableCategory {
  id: string;
  nameZh: string;
  nameEn: string;
  descZh?: string;
  descEn?: string;
}

/** 精选 GitHub 学习资源 */
export interface ViableResource {
  slug: string;
  name: string;
  /** GitHub 仓库 URL */
  url: string;
  /** GitHub star 数 */
  stars: number;
  /** 对应 ViableCategory.id */
  category: string;
  tags?: string[];
  descZh: string;
  descEn: string;
}
