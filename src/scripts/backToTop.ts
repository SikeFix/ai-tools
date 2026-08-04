// 回到顶部按钮：滚动超过 400px 显示
const btn = document.getElementById('back-to-top');
if (btn) {
  const onScroll = () => {
    btn.hidden = window.scrollY < 400;
  };
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
