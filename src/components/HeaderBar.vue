<template>
  <div class="header-bar" :class="{ 'compact': isCompact }">
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
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import NowTime from './NowTime.vue';
import ThemeSwitch from './ThemeSwitch.vue';

const showLogo = ref(true);
const isCompact = ref(false);
let lastScrollTop = 0;

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // 如果滚动超过50px，启用压缩模式
  if (scrollTop > 50) {
    isCompact.value = true;
  } else {
    isCompact.value = false;
  }
  
  lastScrollTop = scrollTop;
};

onMounted(() => {
  const saved = localStorage.getItem('showLogo');
  if (saved !== null) {
    showLogo.value = saved === 'true';
  }
  
  // 添加滚动监听
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  // 组件卸载时移除滚动监听
  window.removeEventListener('scroll', handleScroll);
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
  padding: 28px 36px 12px 36px;
  background: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background-color: rgba(249, 250, 252, 0.75);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: all var(--transition-duration) ease;
  height: auto;
  border-bottom: 1px solid rgba(230, 235, 243, 0.6);
}

/* 压缩模式下的样式 */
.header-bar.compact {
  padding: 10px 36px 6px 36px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.header-bar.compact .site-title {
  font-size: 22px;
}

.header-bar.compact .site-desc {
  font-size: 12px;
}

.header-bar.compact .logo {
  width: 36px;
  height: 36px;
}

body[data-theme='dark'] .header-bar {
  background-color: rgba(34, 39, 46, 0.8);
  border-bottom: 1px solid rgba(48, 54, 61, 0.8);
}

.header-left-placeholder {
  min-width: 220px;
  height: 60px;
  display: flex;
  align-items: center;
  transition: all var(--transition-duration) ease;
}

.header-bar.compact .header-left-placeholder {
  height: 40px;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  width: 48px;
  height: 48px;
  margin-right: 16px;
  transition: all var(--transition-duration) ease;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.1));
}

.site-info {
  display: flex;
  flex-direction: column;
}

.site-title {
  font-size: 28px;
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
  letter-spacing: 2px;
  font-family: 'ZCOOL KuaiLe', 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  transition: all var(--transition-duration) ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.site-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 2px;
  transition: all var(--transition-duration) ease;
  letter-spacing: 0.5px;
}

.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 1;
  transition: all var(--transition-duration) ease;
  padding: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

@media (max-width: 900px) {
  .header-bar {
    flex-direction: column;
    align-items: flex-start;
    padding: 18px 16px 8px 16px;
  }
  
  .header-bar.compact {
    padding: 8px 16px 4px 16px;
  }
  
  .header-center {
    position: static;
    left: auto;
    transform: none;
    margin: 12px 0;
    width: 100%;
    text-align: left;
  }
  
  .header-bar.compact .header-center {
    margin: 8px 0;
  }
}
</style> 