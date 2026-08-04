// 通用卡片过滤：SOP / Skills 页
// 用法：<input data-search=".sop-card" data-search-section=".sop-group" data-count="search-count">
// 卡片需带 data-query（服务端拼好的搜索索引）
const input = document.querySelector<HTMLInputElement>('[data-search]');
if (input) {
  const cardSel = input.dataset.search ?? '.sop-card';
  const sectionSel = input.dataset.searchSection ?? '';
  const countId = input.dataset.count;
  const cards = Array.from(document.querySelectorAll<HTMLElement>(cardSel));
  const sections = sectionSel
    ? Array.from(document.querySelectorAll<HTMLElement>(sectionSel))
    : [];
  const countEl = countId ? document.getElementById(countId) : null;
  const countWrap = countEl?.parentElement;

  let timer: ReturnType<typeof setTimeout> | undefined;

  const apply = () => {
    const q = input.value.trim().toLowerCase();
    let visible = 0;
    for (const card of cards) {
      const match = q === '' || (card.dataset.query ?? '').includes(q);
      card.hidden = !match;
      if (match) visible += 1;
    }
    for (const section of sections) {
      const hasVisible = section.querySelector(`${cardSel}:not([hidden])`) !== null;
      section.hidden = !hasVisible;
    }
    if (countEl) countEl.textContent = String(visible);
    if (countWrap) countWrap.hidden = q === '';
  };

  input.addEventListener('input', () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(apply, 120);
  });
}
