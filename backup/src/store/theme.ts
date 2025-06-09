import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * 主题状态管理
 */
export const useThemeStore = defineStore('theme', () => {
  // 判断系统默认是否为深色模式
  const systemDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;

  // 从本地存储获取用户设置，如果没有则使用系统默认
  const isDark = ref(
    localStorage.getItem('theme') === 'dark' ||
      (localStorage.getItem('theme') === null && systemDarkMode),
  );

  // 切换主题模式
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    applyTheme();
  };

  // 手动设置主题模式
  const setTheme = (dark: boolean) => {
    isDark.value = dark;
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    applyTheme();
  };

  // 应用主题到HTML元素
  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.setAttribute('data-theme', 'light');
    }
  };

  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    // 仅当用户没有手动设置主题时，跟随系统变化
    if (localStorage.getItem('theme') === null) {
      isDark.value = e.matches;
      applyTheme();
    }
  });

  // 初始应用主题
  applyTheme();

  return {
    isDark,
    toggleTheme,
    setTheme,
  };
});
