import { ref } from 'vue';

// 主题类型定义
export type ThemeType = 'light' | 'dark';

// 存储当前主题的响应式引用
export const currentTheme = ref<ThemeType>('light');

// 初始化主题
export function initTheme(): void {
  // 尝试从本地存储获取主题
  const savedTheme = localStorage.getItem('theme') as ThemeType;

  // 如果本地存储中有主题设置，则使用该设置
  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
    setTheme(savedTheme);
  } else {
    // 否则根据系统偏好设置主题
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }

  // 监听系统主题变化
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      if (localStorage.getItem('theme') === null) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
}

// 设置主题
export function setTheme(theme: ThemeType): void {
  // 更新响应式引用
  currentTheme.value = theme;

  // 更新 body 元素的 data-theme 属性
  if (theme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
  } else {
    document.body.removeAttribute('data-theme');
  }

  // 保存到本地存储
  localStorage.setItem('theme', theme);
}

// 切换主题
export function toggleTheme(): void {
  const newTheme = currentTheme.value === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}
