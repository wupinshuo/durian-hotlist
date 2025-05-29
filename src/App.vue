<template>
  <div class="app-container">
    <HeaderBar />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import HeaderBar from './components/HeaderBar.vue';
</script>

<style>
:root {
  --now-time-bg: #f3f6fa;
  --now-time-color: #333;
}
body[data-theme='dark'] {
  --now-time-bg: #222428;
  --now-time-color: #eee;
}
body {
  margin: 0;
  font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  transition: background-color 0.3s, color 0.3s;
}
body {
  background: #f7f8fa;
  color: #333;
}
body[data-theme='dark'] {
  background: #1a1a1a;
  color: #e5e5e5;
}
.app-container {
  position: relative;
  min-height: 100vh;
}
/* 深色模式下的卡片样式 */
body[data-theme='dark'] .el-card {
  background-color: #2c2c2c;
  color: #e5e5e5;
  border-color: #3a3a3a;
}
body[data-theme='dark'] a {
  color: #409eff;
}
body[data-theme='dark'] .el-card__header {
  border-bottom-color: #3a3a3a;
}
body[data-theme='dark'] .el-switch__label--left {
  color: #b0b3b8 !important;
  font-weight: bold;
  font-size: 18px !important;
  letter-spacing: 1px;
}
</style> 