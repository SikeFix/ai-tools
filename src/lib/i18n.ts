import type { Lang } from './types';
import { zh, type UiKey } from '../i18n/ui.zh';
import { en } from '../i18n/ui.en';

const dict: Record<Lang, Record<UiKey, string>> = { zh, en };

/** 取当前语言的 UI 字符串 */
export const t = (lang: Lang, key: UiKey): string => dict[lang][key] ?? key;

/** zh → 不加前缀；en → 加 /en 前缀。path 为不带语言前缀的路径（如 /tools/sora/） */
export const localePath = (lang: Lang, path: string): string =>
  lang === 'zh' ? path : `/en${path}`;

/** 当前路径的另一语言 URL（语言切换链接用） */
export const counterpartPath = (lang: Lang, pathname: string): string => {
  if (lang === 'zh') return `/en${pathname === '/' ? '' : pathname}`;
  const stripped = pathname.replace(/^\/en/, '');
  return stripped === '' ? '/' : stripped;
};

/** <html lang> 值 */
export const htmlLang = (lang: Lang): string => (lang === 'zh' ? 'zh-CN' : 'en');

/** og:locale 值 */
export const ogLocale = (lang: Lang): string => (lang === 'zh' ? 'zh_CN' : 'en_US');
