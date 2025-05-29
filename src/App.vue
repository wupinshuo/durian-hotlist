<template>
  <div class="app-container">
    <div class="header-bar">
      <div class="header-left">
        <img src="/durian_logo.svg" alt="榴莲LOGO" class="logo" />
        <div class="site-info">
          <span class="site-title">榴莲热榜</span>
          <span class="site-desc">技术与资讯热榜聚合平台</span>
        </div>
      </div>
      <div class="header-center">
        <span class="now-time">{{ nowTime }}</span>
      </div>
      <div class="header-right">
        <el-button @click="themeStore.toggleTheme" circle class="header-btn">
          <el-icon :size="20"><component :is="themeStore.isDark ? Sunny : Moon" /></el-icon>
        </el-button>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useThemeStore } from './store/theme';
import { Moon, Sunny } from '@element-plus/icons-vue';
import { Lunar } from 'lunar-javascript';

const themeStore = useThemeStore();
const nowTime = ref('');

function updateTime() {
  const now = new Date();
  const week = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  // 农历
  const lunar = Lunar.fromDate(now);
  const lunarStr = `农历${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
  nowTime.value = `${y}-${m}-${d} ${h}:${min}:${s}  ${week[now.getDay()]}  ${lunarStr}`;
}

onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);
});
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

.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px 12px 32px;
  background: none;
  position: relative;
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
.now-time {
  background: var(--now-time-bg);
  color: var(--now-time-color);
  border-radius: 8px;
  padding: 4px 18px;
  font-weight: 500;
  transition: background 0.3s, color 0.3s;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.header-btn {
  background: none;
  border: none;
  box-shadow: none;
}
.header-btn:hover {
  background: #f0f7ff;
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
</style> 