<template>
  <div class="theme-toggle">
    <el-tooltip :content="themeTooltip" placement="bottom">
      <el-icon class="theme-toggle-icon" @click="toggleTheme">
        <component :is="currentIcon" />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Sunny, Moon } from '@element-plus/icons-vue';
import { currentTheme, toggleTheme } from '../styles/theme-utils';

// 根据当前主题计算图标
const currentIcon = computed(() => {
  return currentTheme.value === 'light' ? Moon : Sunny;
});

// 提示文本
const themeTooltip = computed(() => {
  return currentTheme.value === 'light' ? '切换到深色模式' : '切换到浅色模式';
});
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.theme-toggle-icon {
  font-size: 20px;
  color: var(--text-regular);
  transition: color 0.3s;
}

.theme-toggle-icon:hover {
  color: var(--primary-color);
}
</style> 