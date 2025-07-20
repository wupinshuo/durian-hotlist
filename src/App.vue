<template>
  <div class="app-container">
    <HeaderBar v-if="!hideHeader" />
    <router-view />
    <FooterBar />
  </div>
</template>

<script setup lang="ts">
import HeaderBar from './components/HeaderBar.vue';
import FooterBar from './components/FooterBar.vue';
import { RouterView, useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const hideHeader = computed(() => route.meta.hideHeader);
</script>

<style>
:root {
  --now-time-bg: rgba(243, 246, 250, 0.6);
  --now-time-color: var(--text-regular);
}
body[data-theme='dark'] {
  --now-time-bg: rgba(34, 36, 40, 0.7);
  --now-time-color: var(--text-regular);
}
body {
  margin: 0;
  font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  transition: all var(--transition-duration) ease;
}
body {
  background-color: var(--bg-color-page);
  color: var(--text-regular);
}
body[data-theme='dark'] {
  background-color: var(--bg-color-page);
  color: var(--text-regular);
}
.app-container {
  position: relative;
  min-height: 100vh;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 卡片样式优化 */
.el-card {
  border-radius: var(--border-radius-base);
  border: 1px solid var(--card-border);
  box-shadow: var(--card-shadow) !important;
  transition: all var(--transition-duration) ease;
  overflow: hidden;
}

.el-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--box-shadow-hover) !important;
}

.el-card__header {
  background-color: var(--card-header-bg);
  border-bottom: 1px solid var(--border-color-lighter);
  padding: 16px 20px;
}

.el-card__body {
  padding: 20px;
}

/* 深色模式下的卡片样式 */
body[data-theme='dark'] .el-card {
  background-color: var(--card-bg);
  color: var(--text-regular);
  border-color: var(--card-border);
}

body[data-theme='dark'] a {
  color: var(--link-color);
}

body[data-theme='dark'] .el-card__header {
  border-bottom-color: var(--border-color);
  background-color: var(--card-header-bg);
}

/* 按钮样式优化 */
.el-button {
  border-radius: var(--border-radius-base);
  transition: all var(--transition-duration) ease;
}

.el-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--box-shadow-light);
}

.el-button:active {
  transform: translateY(0);
}

/* 开关样式优化 */
.el-switch__label {
  color: var(--text-regular) !important;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-small) !important;
  letter-spacing: 0.5px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .app-container {
    padding: 0 12px;
  }
  
  .el-card__header {
    padding: 12px 16px;
  }
  
  .el-card__body {
    padding: 16px;
  }
}
</style>