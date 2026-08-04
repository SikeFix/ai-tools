// 暗色模式切换：与 BaseLayout 内联脚本配合
const btn = document.getElementById('theme-toggle');
if (btn) {
  btn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  });
}
