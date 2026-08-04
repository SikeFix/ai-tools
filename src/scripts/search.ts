// 搜索 + 分类 + 价格 联合过滤（渐进增强：无 JS 时也完整渲染全量列表）
const input = document.getElementById('search-input') as HTMLInputElement | null;
const categoryButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>('#category-nav [data-category]'),
);
const priceButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>('#price-filter [data-price]'),
);
const cards = Array.from(
  document.querySelectorAll<HTMLElement>('.tool-card'),
);
const sections = Array.from(
  document.querySelectorAll<HTMLElement>('.category-section'),
);
const resultBar = document.getElementById('result-bar');
const resultCount = document.getElementById('result-count');
const resultEmpty = document.getElementById('result-empty');
const clearButton = document.getElementById('filter-clear');

let q = '';
let category = '';
let price = '';
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

function applyFilter(): void {
  const needle = q.toLowerCase();
  let visible = 0;

  for (const card of cards) {
    const match =
      (category === '' || card.dataset.category === category) &&
      (price === '' || card.dataset.price === price) &&
      (needle === '' || (card.dataset.query ?? '').includes(needle));
    card.hidden = !match;
    if (match) visible += 1;
  }

  for (const section of sections) {
    const hasVisible = section.querySelector('.tool-card:not([hidden])') !== null;
    section.hidden = !hasVisible;
  }

  const isFiltering = q !== '' || category !== '' || price !== '';
  if (resultBar) resultBar.hidden = !isFiltering;
  if (resultEmpty) resultEmpty.hidden = !(isFiltering && visible === 0);
  if (clearButton) clearButton.hidden = !isFiltering;

  if (resultCount) {
    const template = resultCount.dataset.template ?? '{n}';
    resultCount.textContent = template.replace('{n}', String(visible));
  }

  for (const btn of categoryButtons) {
    btn.classList.toggle('chip-active', btn.dataset.category === category);
  }
  for (const btn of priceButtons) {
    btn.classList.toggle('chip-active', btn.dataset.price === price);
  }
}

if (input) {
  input.addEventListener('input', () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      q = input.value.trim();
      applyFilter();
    }, 150);
  });
}

for (const btn of categoryButtons) {
  btn.addEventListener('click', () => {
    category = category === btn.dataset.category ? '' : (btn.dataset.category ?? '');
    applyFilter();
  });
}

for (const btn of priceButtons) {
  btn.addEventListener('click', () => {
    price = price === btn.dataset.price ? '' : (btn.dataset.price ?? '');
    applyFilter();
  });
}

clearButton?.addEventListener('click', () => {
  q = '';
  category = '';
  price = '';
  if (input) input.value = '';
  applyFilter();
});

// 支持 ?q= 搜索深链（配合 WebSite SearchAction，可分享搜索结果）
const urlParams = new URLSearchParams(window.location.search);
const initialQuery = urlParams.get('q');
if (initialQuery && input) {
  input.value = initialQuery;
  q = initialQuery.trim();
  applyFilter();
}

// 键盘 '/' 快捷聚焦搜索框
window.addEventListener('keydown', (event) => {
  if (event.key === '/' && document.activeElement !== input) {
    event.preventDefault();
    input?.focus();
  }
});
