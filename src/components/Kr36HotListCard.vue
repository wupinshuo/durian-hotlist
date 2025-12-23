<template>
  <div class="kr36-card">
    <div class="card-header">
      <div class="header-left">
        <div class="logo clickable-logo" @click="handleLogoClick" title="访问36氪">
          <img src="/images/36kr.svg" alt="36氪" class="logo-icon" />
        </div>
        <div>
          <div class="title">36氪热榜</div>
          <div class="subtitle">创投资讯</div>
        </div>
      </div>
      
      <UpdateTimeDisplay 
        :update-time="updateTime" 
        :loading="loading" 
        theme-color="#1890FF"
        @refresh="handleRefresh" 
      />
    </div>

    <div class="trending-list-wrapper">
      <div class="trending-list-inner">
        <el-skeleton v-if="loading" :rows="8" animated />
        <template v-else>
          <div class="trending-list">
            <div v-for="(item, index) in hotTopics" :key="item.url" class="trending-item" :class="{ top: index < 3 }">
              <div class="item-rank" :class="{ top: index < 3 }">{{ index + 1 }}</div>
              <div class="item-main">
                <a 
                  :href="item.url" 
                  target="_blank" 
                  class="article-title" 
                  :class="{'read-link': isRead(item.url)}"
                  :title="item.title"
                  @click="handleClick(item)"
                >{{ item.title }}</a>
                <div v-if="item.desc" class="article-desc" :title="item.desc">{{ item.desc }}</div>
                <div class="repo-meta">
                  <span class="repo-stars">
                    <svg class="hot-icon" viewBox="0 0 1024 1024" width="14" height="14">
                      <path fill="#1890FF" d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z"/>
                    </svg>
                    {{ formatHotCount(item.hot) }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="!hotTopics.length" class="empty-tip">暂无数据</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElSkeleton } from 'element-plus'
import { UpdateTimeDisplay } from './index'
import { HotItem } from '@/types/hot'
import { useUserBehavior } from '../composables/useUserBehavior'
import { ref } from 'vue'

const { isRead, trackClick } = useUserBehavior()

// 用于强制组件重新渲染
const updateTrigger = ref(0)

const props = defineProps<{
  hotTopics: HotItem[]
  loading?: boolean
  updateTime?: number
}>()

const emit = defineEmits(['refresh'])

/**
 * 处理刷新事件
 */
function handleRefresh() {
  emit('refresh')
}

/**
 * 处理点击事件，记录用户行为
 * @param item 点击的热榜项
 */
function handleClick(item: HotItem) {
  trackClick(item, '36氪')
  
  // 增加更新触发器来强制视图更新
  updateTrigger.value++
}

/**
 * 处理 logo 点击事件
 */
function handleLogoClick() {
  window.open('https://36kr.com', '_blank')
}

/**
 * 格式化36氪热榜数据中的热度数量
 * @param hot 原始热度数量字符串
 * @returns 格式化后的数量字符串（万单位）
 */
function formatHotCount(hot: string): string {
  const num = Number(hot)
  if (isNaN(num)) {
    return hot
  }
  
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  
  return num.toString()
}
</script>

<style scoped>
.kr36-card {
  background: var(--card-bg, rgba(22, 27, 34, 0.8));
  backdrop-filter: blur(20px);
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--border-color, rgba(48, 54, 61, 0.4));
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  width: 100%;
  max-width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px;
  border-bottom: 1px solid var(--border-color, rgba(48, 54, 61, 0.3));
  position: relative;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius, 6px);
  background: #ffffff;
  box-shadow: 0 0 8px rgba(24, 144, 255, 0.25);
  border: 1px solid rgba(24, 144, 255, 0.2);
}

.logo-icon {
  width: 22px;
  height: 22px;
  /* 保持原始颜色，36氪图标本身就是蓝色背景白色文字 */
}

/* 深色模式下增加发光效果 */
:root.dark .logo {
  box-shadow: 0 0 12px rgba(24, 144, 255, 0.6);
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #1890FF;
}

.subtitle {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* 列表样式 */
.trending-list-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 0 5px 0 0;
  height: 290px;
  min-height: 290px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.trending-list-inner {
  height: 100%;
  min-height: 290px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.trending-list {
  display: flex;
  flex-direction: column;
}

.trending-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 6px 5px;
  border-radius: 5px;
  transition: all 0.2s;
}

.trending-item:hover {
  background-color: var(--hover-bg, rgba(48, 54, 61, 0.2));
  transform: translateY(-2px);
}

.item-rank {
  font-size: 14px;
  font-weight: 600;
  color: var(--muted-foreground);
  min-width: 20px;
  text-align: center;
}

.item-rank.top {
  color: #1890FF;
}

.item-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.article-title {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.3;
  color: var(--foreground);
  text-decoration: none;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-title:hover {
  color: #1890FF;
  text-decoration: underline;
}

.article-desc {
  font-size: 12px;
  line-height: 1.3;
  color: var(--muted-foreground, #8b949e);
  margin-top: 1px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  opacity: 0.9;
}

.repo-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  line-height: 1.2;
}

.repo-stars {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #1890FF;
}

.hot-icon {
  width: 14px;
  height: 14px;
}

.empty-tip {
  text-align: center;
  color: var(--muted-foreground);
  padding: 32px 0;
}

/* 滚动条美化 */
.trending-list-wrapper::-webkit-scrollbar {
  width: 5px;
}

.trending-list-wrapper::-webkit-scrollbar-thumb {
  background: var(--scroll-thumb, rgba(120, 130, 140, 0.5));
  border-radius: var(--radius, 4px);
}

.trending-list-wrapper::-webkit-scrollbar-thumb:hover {
  background: var(--scroll-thumb-hover, rgba(130, 160, 190, 0.8));
}

.trending-list-wrapper::-webkit-scrollbar-track {
  background: var(--scroll-track, rgba(30, 34, 39, 0.2));
  border-radius: var(--radius, 4px);
}

/* 深色模式特定滚动条样式 */
:root.dark .trending-list-wrapper::-webkit-scrollbar-thumb {
  background: rgba(140, 160, 190, 0.4);
}

:root.dark .trending-list-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(160, 200, 255, 0.65);
}

/* 浅色模式特定滚动条样式 */
:root:not(.dark) .trending-list-wrapper::-webkit-scrollbar-thumb {
  background: rgba(180, 190, 200, 0.5);
}

:root:not(.dark) .trending-list-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(140, 150, 165, 0.7);
}

:root:not(.dark) .trending-list-wrapper::-webkit-scrollbar-track {
  background: rgba(230, 235, 240, 0.6);
}

/* 可点击的 logo 样式 */
.clickable-logo {
  cursor: pointer;
  transition: all 0.2s ease;
}

.clickable-logo:hover {
  transform: scale(1.05);
  box-shadow: 0 0 16px rgba(24, 144, 255, 0.4);
}

:root.dark .clickable-logo:hover {
  box-shadow: 0 0 20px rgba(24, 144, 255, 0.6);
}

@media (max-width: 768px) {
  .kr36-card {
    max-width: 100%;
  }
}
</style>