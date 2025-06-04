<template>
  <div class="header-bar">
    <div class="header-left-placeholder">
      <div class="header-left" v-if="showLogo">
        <img src="/durian_logo.svg" alt="榴莲LOGO" class="logo" />
        <div class="site-info">
          <span class="site-title">榴莲热榜</span>
          <span class="site-desc">技术与资讯热榜聚合平台</span>
        </div>
      </div>
    </div>
    <div class="header-center">
      <NowTime />
    </div>
    <div class="header-right">
      <ThemeSwitch v-model:show-logo="showLogo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import NowTime from './NowTime.vue';
import ThemeSwitch from './ThemeSwitch.vue';

const showLogo = ref(true);

onMounted(() => {
  const saved = localStorage.getItem('showLogo');
  if (saved !== null) {
    showLogo.value = saved === 'true';
  }
});

watch(showLogo, (val) => {
  localStorage.setItem('showLogo', String(val));
});
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px 12px 32px;
  background: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background-color: rgba(247, 248, 250, 0.85);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s;
}

body[data-theme='dark'] .header-bar {
  background-color: rgba(26, 26, 26, 0.85);
}

.header-left-placeholder {
  min-width: 220px;
  height: 60px;
  display: flex;
  align-items: center;
}
.header-left {
  display: flex;
  align-items: center;
}
.logo {
  width: 48px;
  height: 48px;
  margin-right: 14px;
}
.site-info {
  display: flex;
  flex-direction: column;
}
.site-title {
  font-size: 28px;
  font-weight: bold;
  color: #1976d2;
  letter-spacing: 2px;
  font-family: 'ZCOOL KuaiLe', 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
}
.site-desc {
  font-size: 14px;
  color: #888;
  margin-top: 2px;
}
.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  font-size: 16px;
  color: #666;
  font-family: 'JetBrains Mono', 'Consolas', 'Menlo', monospace;
  z-index: 1;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
@media (max-width: 900px) {
  .header-bar {
    flex-direction: column;
    align-items: flex-start;
    padding: 18px 10px 8px 10px;
  }
  .header-center {
    position: static;
    left: auto;
    transform: none;
    margin: 8px 0;
    width: 100%;
  }
}
</style> 