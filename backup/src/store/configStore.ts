import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useConfigStore = defineStore('config', () => {
  // 直接从环境变量读取
  const baseUrl = ref(import.meta.env.VITE_API_URL || 'http://localhost:8082');

  return {
    baseUrl,
  };
});
