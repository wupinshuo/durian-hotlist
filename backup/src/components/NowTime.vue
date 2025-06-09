<template>
  <div class="now-time">{{ nowTime }}</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Lunar } from 'lunar-javascript';

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
  const lunar = Lunar.fromDate(now);
  const lunarStr = `农历${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
  nowTime.value = `${y}-${m}-${d} ${h}:${min}:${s}  ${week[now.getDay()]}  ${lunarStr}`;
}

onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);
});
</script>

<style scoped>
.now-time {
  background: rgba(255, 255, 255, 0.2);
  color: var(--text-regular);
  border-radius: var(--border-radius-round);
  padding: 5px 18px;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-duration) ease;
  font-size: 15px;
  font-family: 'JetBrains Mono', 'Consolas', 'Menlo', monospace;
  letter-spacing: 0.3px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  text-align: center;
  user-select: none;
  white-space: nowrap;
}

body[data-theme='dark'] .now-time {
  background: rgba(40, 40, 45, 0.5);
  border-color: rgba(60, 60, 70, 0.3);
  color: #e0e0e0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 添加微妙的闪烁动画效果 */
@keyframes second-pulse {
  0% {
    text-shadow: none;
  }
  50% {
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.4);
  }
  100% {
    text-shadow: none;
  }
}

.now-time:hover {
  animation: second-pulse 2s infinite;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.25);
}

body[data-theme='dark'] .now-time:hover {
  animation: second-pulse 2s infinite;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  background: rgba(45, 45, 55, 0.6);
}
</style> 