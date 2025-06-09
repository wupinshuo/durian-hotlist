'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './button';
import { getCurrentTheme, toggleTheme } from '../../tools/theme';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // 在客户端渲染时获取当前主题
    setTheme(getCurrentTheme());

    // 监听主题变化
    const handleThemeChange = () => {
      setTheme(getCurrentTheme());
    };

    // 添加自定义事件监听器
    window.addEventListener('themeChange', handleThemeChange);

    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  const handleToggleTheme = () => {
    toggleTheme();
    setTheme(getCurrentTheme());
    // 触发自定义事件，通知其他组件主题已变更
    window.dispatchEvent(new Event('themeChange'));
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleTheme}
      className="rounded-full hover:bg-muted"
      aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
    >
      {theme === 'dark' ? (
        <Moon className="h-5 w-5 text-primary" />
      ) : (
        <Sun className="h-5 w-5 text-primary" />
      )}
    </Button>
  );
}
