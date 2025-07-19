<template>
  <el-button @click="themeStore.toggleTheme" circle class="header-btn theme-toggle-btn">
    <el-icon :size="20"><component :is="themeStore.isDark ? Sunny : Moon" /></el-icon>
  </el-button>
  <el-switch
    v-model="localShowLogo"
    active-text="刷榜"
    inactive-text="充电"
    inline-prompt
    class="premium-switch"
    active-color="#5cb85c"
    inactive-color="#3c85ee"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useThemeStore } from '../store/theme';
import { Moon, Sunny } from '@element-plus/icons-vue';

const props = defineProps<{ showLogo: boolean }>();
const emit = defineEmits(['update:showLogo']);

const localShowLogo = ref(props.showLogo);

// 更新标题的函数
const updateDocumentTitle = (isSedimentationMode: boolean) => {
  document.title = isSedimentationMode ? '榴莲热榜' : '学习网站';
};

// 初始化时设置标题
updateDocumentTitle(localShowLogo.value);

watch(() => props.showLogo, val => {
  localShowLogo.value = val;
  updateDocumentTitle(val);
});
watch(localShowLogo, val => {
  emit('update:showLogo', val);
  updateDocumentTitle(val);
});

const themeStore = useThemeStore();
</script>

<style scoped>
.header-btn {
  background: none;
  border: none;
  box-shadow: none;
  transition: all var(--transition-duration) ease;
  color: var(--text-regular);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.theme-toggle-btn {
  background-color: rgba(var(--bg-color-overlay), 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: var(--border-radius-circle);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.header-btn:hover {
  background: var(--hover-bg);
  transform: translateY(-1px);
  box-shadow: var(--box-shadow-light);
}

.header-btn:active {
  transform: translateY(0);
}

.premium-switch {
  margin-left: 14px;
  --el-switch-on-color: var(--success-color);
  --el-switch-off-color: var(--primary-color);
}

.premium-switch :deep(.el-switch__core) {
  border-radius: var(--border-radius-round);
}

.premium-switch :deep(.el-switch__label) {
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-small);
}

/* 深色模式下的样式调整 */
body[data-theme='dark'] .theme-toggle-btn {
  background-color: rgba(45, 51, 59, 0.6);
  color: var(--text-regular);
}

body[data-theme='dark'] .header-btn:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}
</style> 