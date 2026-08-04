import type { Lang, Skill, SkillCategory } from './types';
import skillsData from '../data/skills.json';
import skillCategoriesData from '../data/skillCategories.json';
import skillDetailsData from '../data/skillDetails.json';

const allSkills = (skillsData as Skill[]).map((skill) => {
  const detail = skillDetailsData.find((d) => d.slug === skill.slug);
  if (!detail) return skill;
  return { ...skill, useCasesZh: detail.useCasesZh, useCasesEn: detail.useCasesEn };
});
const allSkillCategories = skillCategoriesData as SkillCategory[];

export function getSkillCategories(): SkillCategory[] {
  return allSkillCategories;
}

export function getAllSkills(): Skill[] {
  return allSkills;
}

export function getSkillsByCategory(id: string): Skill[] {
  return allSkills.filter((skill) => skill.category === id);
}

export function getSkillCategoryById(id: string): SkillCategory | undefined {
  return allSkillCategories.find((cat) => cat.id === id);
}

export function skillCategoryName(cat: SkillCategory, lang: Lang): string {
  return lang === 'zh' ? cat.nameZh : cat.nameEn;
}

export function skillCategoryDesc(cat: SkillCategory, lang: Lang): string | undefined {
  return lang === 'zh' ? cat.descZh : cat.descEn;
}

export function skillDesc(skill: Skill, lang: Lang): string {
  return lang === 'zh' ? skill.descZh : skill.descEn;
}

export function skillUseCases(skill: Skill, lang: Lang): string[] {
  return lang === 'zh' ? (skill.useCasesZh ?? []) : (skill.useCasesEn ?? []);
}

export function getSkillBySlug(slug: string): Skill | undefined {
  return allSkills.find((skill) => skill.slug === slug);
}

/** 技能分类区块（按 skills.json 顺序） */
export function getSkillSections(): { category: SkillCategory; skills: Skill[] }[] {
  return getSkillCategories().map((category) => ({
    category,
    skills: getSkillsByCategory(category.id),
  }));
}
