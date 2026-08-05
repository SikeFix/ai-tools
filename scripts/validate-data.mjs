// 数据校验：npm run validate
// 校验 src/data/ 下 tools/categories/sop JSON 的形状，避免数据漂移导致页面报错。
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'src', 'data');

const errors = [];
const warn = [];

function readJson(relPath) {
  const abs = path.join(dataDir, relPath);
  if (!existsSync(abs)) {
    errors.push(`缺少文件: ${relPath}`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(abs, 'utf8'));
  } catch (e) {
    errors.push(`JSON 解析失败: ${relPath} (${e.message})`);
    return null;
  }
}

// ---- categories ----
const categories = readJson('categories.json');
if (categories) {
  const ids = new Set();
  categories.forEach((cat, i) => {
    if (typeof cat.id !== 'string' || !cat.id) errors.push(`categories[${i}].id 缺失`);
    else if (ids.has(cat.id)) errors.push(`categories 重复 id: ${cat.id}`);
    else ids.add(cat.id);
    if (typeof cat.order !== 'number') errors.push(`categories[${i}] (${cat.id}) order 缺失`);
    if (!cat.nameZh || !cat.nameEn) errors.push(`categories[${i}] (${cat.id}) 名称缺失`);
  });
}

// ---- tools ----
const tools = readJson('tools.json');
if (tools) {
  const PRICES = new Set(['Free', 'Freemium', 'Paid']);
  const slugs = new Set();
  const catIds = new Set((categories || []).map((c) => c.id));
  tools.forEach((tool, i) => {
    const where = `tools[${i}] (${tool?.slug || tool?.name || '?'})`;
    if (typeof tool.slug !== 'string' || !tool.slug) errors.push(`${where}: slug 缺失`);
    else if (slugs.has(tool.slug)) errors.push(`${where}: slug 重复`);
    else slugs.add(tool.slug);
    if (!tool.name) errors.push(`${where}: name 缺失`);
    if (!tool.url || !/^https?:\/\//.test(tool.url)) errors.push(`${where}: url 非法`);
    if (!catIds.has(tool.category)) errors.push(`${where}: category '${tool.category}' 不在分类表`);
    if (!PRICES.has(tool.price)) errors.push(`${where}: price '${tool.price}' 非法`);
    if (!tool.descZh) errors.push(`${where}: descZh 缺失`);
    if (!tool.descEn) errors.push(`${where}: descEn 缺失`);
  });
}

// ---- toolCaps（能力标签 + 使用场景） ----
const capsTaxonomy = readJson('caps.json');
const capIds = new Set((capsTaxonomy || []).map((c) => c.id));
const toolCapsDir = path.join(dataDir, 'toolCaps');
if (existsSync(toolCapsDir)) {
  const covered = new Set();
  for (const file of readdirSync(toolCapsDir).filter((f) => f.endsWith('.json'))) {
    const entries = readJson(path.join('toolCaps', file));
    for (const entry of entries || []) {
      const where = `toolCaps/${file}: ${entry?.slug || '?'}`;
      if (!entry.slug) {
        errors.push(`${where}: slug 缺失`);
        continue;
      }
      covered.add(entry.slug);
      if (!Array.isArray(entry.caps) || entry.caps.length === 0) {
        errors.push(`${where}: caps 为空`);
      } else {
        for (const c of entry.caps) {
          if (!capIds.has(c)) errors.push(`${where}: 未知能力标签 '${c}'`);
        }
      }
      if (!Array.isArray(entry.useCasesZh) || entry.useCasesZh.length === 0) errors.push(`${where}: useCasesZh 为空`);
      if (!Array.isArray(entry.useCasesEn) || entry.useCasesEn.length === 0) errors.push(`${where}: useCasesEn 为空`);
    }
  }
  for (const tool of tools || []) {
    if (!covered.has(tool.slug)) errors.push(`toolCaps 缺少能力数据: ${tool.slug}`);
  }
}

// ---- skills ----
const skillCategories = readJson('skillCategories.json');
const skills = readJson('skills.json');
if (skillCategories && skills) {
  const catIds = new Set(skillCategories.map((c) => c.id));
  const skillSlugs = new Set();
  const SOURCES = new Set(['official', 'community', 'builtin']);
  skills.forEach((skill, i) => {
    const where = `skills[${i}] (${skill?.slug || skill?.name || '?'})`;
    if (typeof skill.slug !== 'string' || !skill.slug) errors.push(`${where}: slug 缺失`);
    else if (skillSlugs.has(skill.slug)) errors.push(`${where}: slug 重复`);
    else skillSlugs.add(skill.slug);
    if (!skill.name) errors.push(`${where}: name 缺失`);
    if (!catIds.has(skill.category)) errors.push(`${where}: category '${skill.category}' 不在分类表`);
    if (!SOURCES.has(skill.source)) errors.push(`${where}: source '${skill.source}' 非法`);
    if (!skill.descZh) errors.push(`${where}: descZh 缺失`);
    if (!skill.descEn) errors.push(`${where}: descEn 缺失`);
  });

  // skillDetails：每个技能都有使用场景
  const skillDetails = readJson('skillDetails.json');
  if (skillDetails) {
    const covered = new Set();
    for (const d of skillDetails) {
      const where = `skillDetails: ${d?.slug || '?'}`;
      if (!d.slug) {
        errors.push(`${where}: slug 缺失`);
        continue;
      }
      covered.add(d.slug);
      if (!Array.isArray(d.useCasesZh) || d.useCasesZh.length === 0) errors.push(`${where}: useCasesZh 为空`);
      if (!Array.isArray(d.useCasesEn) || d.useCasesEn.length === 0) errors.push(`${where}: useCasesEn 为空`);
    }
    for (const skill of skills) {
      if (!covered.has(skill.slug)) errors.push(`skillDetails 缺少使用场景: ${skill.slug}`);
    }
  }
}

// ---- sop ----
const sopDir = path.join(dataDir, 'sop');
if (existsSync(sopDir)) {
  const langs = readdirSync(sopDir);
  const bySlug = new Map();
  for (const lang of langs) {
    const langDir = path.join(sopDir, lang);
    if (!['zh', 'en'].includes(lang)) {
      warn.push(`sop/ 下有未知目录: ${lang}`);
      continue;
    }
    if (!existsSync(langDir) || !readdirSync(langDir).length) {
      errors.push(`sop/${lang}/ 为空，需包含 3 份方案`);
      continue;
    }
    for (const file of readdirSync(langDir).filter((f) => f.endsWith('.json'))) {
      const article = readJson(path.join('sop', lang, file));
      if (!article) continue;
      const key = `${lang}:${article.slug}`;
      if (bySlug.has(key)) errors.push(`sop 重复: ${key}`);
      else bySlug.set(key, article.slug);
      if (!article.slug || !article.title || !article.summary) errors.push(`sop/${lang}/${file}: 缺少 slug/title/summary`);
      if (!article.scenario) errors.push(`sop/${lang}/${file}: 缺少 scenario`);
      if (!Array.isArray(article.steps) || article.steps.length === 0) errors.push(`sop/${lang}/${file}: steps 为空`);
      if (!Array.isArray(article.pitfalls)) errors.push(`sop/${lang}/${file}: pitfalls 非数组`);
    }
  }
  // zh/en 两侧一一对应
  const zhSlugs = [...bySlug.keys()].filter((k) => k.startsWith('zh:')).map((k) => k.slice(3)).sort();
  const enSlugs = [...bySlug.keys()].filter((k) => k.startsWith('en:')).map((k) => k.slice(3)).sort();
  if (zhSlugs.join() !== enSlugs.join()) {
    errors.push(`sop zh/en 不对应：zh=[${zhSlugs}] en=[${enSlugs}]`);
  }
}

// ---- viable-coding（AI 编程 / Viable Coding 教学资源） ----
const viable = readJson('viable-coding.json');
if (viable) {
  const stageIds = new Set();
  (viable.stages || []).forEach((s, i) => {
    const where = `viable-coding.stages[${i}] (${s?.id || '?'})`;
    if (typeof s?.id !== 'string' || !s.id) errors.push(`${where}: id 缺失`);
    else if (stageIds.has(s.id)) errors.push(`${where}: id 重复`);
    else stageIds.add(s.id);
    if (!s.nameZh || !s.nameEn || !s.descZh || !s.descEn) errors.push(`${where}: 名称/描述缺失`);
  });
  const catIds = new Set();
  (viable.categories || []).forEach((c, i) => {
    const where = `viable-coding.categories[${i}] (${c?.id || '?'})`;
    if (typeof c?.id !== 'string' || !c.id) errors.push(`${where}: id 缺失`);
    else if (catIds.has(c.id)) errors.push(`${where}: id 重复`);
    else catIds.add(c.id);
    if (!c.nameZh || !c.nameEn) errors.push(`${where}: 名称缺失`);
  });
  const slugs = new Set();
  (viable.resources || []).forEach((r, i) => {
    const where = `viable-coding.resources[${i}] (${r?.slug || r?.name || '?'})`;
    if (typeof r?.slug !== 'string' || !r.slug) errors.push(`${where}: slug 缺失`);
    else if (slugs.has(r.slug)) errors.push(`${where}: slug 重复`);
    else slugs.add(r.slug);
    if (!r.name) errors.push(`${where}: name 缺失`);
    if (!r.url || !/^https?:\/\//.test(r.url)) errors.push(`${where}: url 非法`);
    if (typeof r.stars !== 'number' || r.stars < 0) errors.push(`${where}: stars 非法`);
    if (!catIds.has(r.category)) errors.push(`${where}: category '${r.category}' 不在分类表`);
    if (!r.descZh) errors.push(`${where}: descZh 缺失`);
    if (!r.descEn) errors.push(`${where}: descEn 缺失`);
  });
}

if (warn.length) {
  console.log('⚠️  警告:');
  warn.forEach((w) => console.log(`  - ${w}`));
}
if (errors.length) {
  console.error('❌ 校验失败:');
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
console.log(`✅ 数据校验通过 (${(tools || []).length} 款工具, ${(categories || []).length} 个分类, ${(viable?.resources || []).length} 条 viable 资源)`);
