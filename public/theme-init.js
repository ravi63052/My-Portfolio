// Apply the saved preference before the first paint, including when storage is blocked.
(() => {
  let saved;
  try { saved = localStorage.getItem('portfolio-theme'); } catch { /* Private browsing. */ }
  const theme = saved === 'light' || saved === 'dark' ? saved : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b1110' : '#f5f8f5');
})();
