import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Config {
  BASE_URL: string;
}

/**
 * 配置信息状态管理
 */
export const useConfigStore = defineStore('config', () => {
  // 基础URL配置
  const baseUrl = ref('');
  const isLoaded = ref(false);
  const loading = ref(false);

  // 加载配置文件
  const loadConfig = async () => {
    if (loading.value || isLoaded.value) return;

    loading.value = true;
    try {
      const response = await fetch('/config.json');
      if (!response.ok) {
        throw new Error(`加载配置失败: ${response.status}`);
      }
      const config: Config = await response.json();
      baseUrl.value = config.BASE_URL || '';
      isLoaded.value = true;
      console.log('配置已加载:', baseUrl.value);
    } catch (error) {
      console.error('加载配置文件失败:', error);
    } finally {
      loading.value = false;
    }
  };

  // 获取完整的API路径
  const getApiUrl = (endpoint: string) => {
    if (!isLoaded.value) {
      console.warn('配置尚未加载完成，API请求可能不正确');
    }
    return `${baseUrl.value}${endpoint}`;
  };

  return {
    baseUrl,
    isLoaded,
    loading,
    loadConfig,
    getApiUrl,
  };
});
