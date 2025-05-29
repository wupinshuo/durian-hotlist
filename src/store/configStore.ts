import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useConfigStore = defineStore('config', () => {
  // 直接从环境变量读取
  const baseUrl = ref(import.meta.env.VITE_API_BASE_URL || '');

  // 获取完整的API路径
  const getApiUrl = (endpoint: string) => {
    return `${baseUrl.value}${endpoint}`;
  };

  return {
    baseUrl,
    getApiUrl,
  };
});
