<template>
  <span class="now-time">{{ nowTime }}</span>
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
  background: var(--now-time-bg);
  color: var(--now-time-color);
  border-radius: 8px;
  padding: 4px 18px;
  font-weight: 500;
  transition: background 0.3s, color 0.3s;
  font-size: 16px;
  font-family: 'JetBrains Mono', 'Consolas', 'Menlo', monospace;
}
</style> 