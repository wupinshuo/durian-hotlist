import { ref, onMounted } from 'vue';

interface ReadItem {
  link: string;
  timestamp: number;
}

/**
 * 已读状态
 * @param expireDays 过期时间，默认2天
 * @returns
 */
export function useReadStatus(expireDays = 2) {
  const readLinks = ref<Set<string>>(new Set());

  // 从localStorage加载已读状态
  const loadReadLinks = () => {
    try {
      const stored = localStorage.getItem('durian_read_links');
      if (stored) {
        const items: ReadItem[] = JSON.parse(stored);
        const now = Date.now();
        // 过滤掉过期的链接
        const validItems = items.filter((item) => {
          return now - item.timestamp < expireDays * 24 * 60 * 60 * 1000;
        });

        // 更新存储
        localStorage.setItem('durian_read_links', JSON.stringify(validItems));

        // 更新已读集合
        readLinks.value = new Set(validItems.map((item) => item.link));
      }
    } catch (e) {
      console.error('读取已读状态失败', e);
      localStorage.removeItem('durian_read_links');
    }
  };

  // 标记链接为已读
  const markAsRead = (link: string) => {
    try {
      // 获取现有数据
      const stored = localStorage.getItem('durian_read_links');
      const items: ReadItem[] = stored ? JSON.parse(stored) : [];

      // 添加新链接，避免重复
      if (!readLinks.value.has(link)) {
        // 创建一个新的 Set 对象来触发响应式更新
        const newReadLinks = new Set(readLinks.value);
        newReadLinks.add(link);
        readLinks.value = newReadLinks; // 替换整个 Set 对象以触发响应式

        items.push({
          link,
          timestamp: Date.now(),
        });

        localStorage.setItem('durian_read_links', JSON.stringify(items));
      }
    } catch (e) {
      console.error('保存已读状态失败', e);
    }
  };

  // 检查链接是否已读
  const isRead = (link: string): boolean => {
    return readLinks.value.has(link);
  };

  // 组件挂载时加载已读状态
  onMounted(() => {
    loadReadLinks();
  });

  return {
    isRead,
    markAsRead,
  };
}
