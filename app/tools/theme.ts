/**
 * 初始化主题
 * 根据系统偏好或本地存储的主题设置来应用主题
 */
export function initTheme(): void {
  if (typeof window === 'undefined') return;

  // 获取本地存储的主题设置
  const savedTheme = localStorage.getItem('theme');

  // 如果有保存的主题设置，应用它
  if (savedTheme) {
    setTheme(savedTheme as 'light' | 'dark');
    return;
  }

  // 否则，根据系统偏好设置主题
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark ? 'dark' : 'light');

  // 监听系统主题变化
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
}

/**
 * 设置主题
 * @param theme 主题类型
 */
export function setTheme(theme: 'light' | 'dark'): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // 保存主题设置到本地存储
  localStorage.setItem('theme', theme);

  // 应用主题类到文档
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

/**
 * 切换主题
 */
export function toggleTheme(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const isDark = document.documentElement.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
}

/**
 * 获取当前主题
 * @returns 当前主题类型
 */
export function getCurrentTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return 'light';
  }

  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}
