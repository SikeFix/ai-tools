// 滚动显现（Apple 克制动效）：
// IntersectionObserver 一次性触发，元素进入视口后加 .is-visible 淡入上移。
// 渐进增强：无 JS / 无 IO 时，元素保持完整可见（.reveal 只在 .js 下隐藏）。
document.documentElement.classList.add('js');

const revealEls = document.querySelectorAll<HTMLElement>('.reveal');

if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}
