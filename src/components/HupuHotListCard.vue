<template>
  <div class="hupu-card">
    <div class="card-header">
      <div class="header-left">
        <div class="logo clickable-logo" @click="handleLogoClick" title="访问虎扑">
          <img src="/images/虎扑.svg" alt="虎扑" class="logo-icon" />
        </div>
        <div>
          <div class="title">虎扑热榜</div>
          <div class="subtitle">体育社区</div>
        </div>
      </div>
      
      <UpdateTimeDisplay 
        :update-time="updateTime" 
        :loading="loading" 
        theme-color="#FF6900"
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
                  class="topic-title" 
                  :class="{'read-link': isRead(item.url)}"
                  :title="item.title"
                  @click="handleClick(item)"
                >{{ item.title }}</a>
                <div v-if="item.desc" class="topic-desc" :title="item.desc">{{ item.desc }}</div>
                <div class="repo-meta">
                  <span class="repo-stars">
                    <svg class="hot-icon" viewBox="0 0 1024 1024" width="14" height="14">
                      <path fill="#FF6900" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/>
                      <path fill="#FF6900" d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165 120.7c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.5 1.8-8.5-1.5-11.3z"/>
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
  trackClick(item, '虎扑')
  
  // 增加更新触发器来强制视图更新
  updateTrigger.value++
}

/**
 * 处理 logo 点击事件
 */
function handleLogoClick() {
  window.open('https://www.hupu.com', '_blank')
}

/**
 * 格式化虎扑热榜数据中的热度数量
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
.hupu-card {
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
  box-shadow: 0 0 8px rgba(255, 105, 0, 0.25);
  border: 1px solid rgba(216, 30, 6, 0.2);
}

.logo-icon {
  width: 22px;
  height: 22px;
  /* 保持原始颜色，虎扑图标本身就是红色 */
}

/* 深色模式下增加发光效果 */
:root.dark .logo {
  box-shadow: 0 0 12px rgba(255, 105, 0, 0.6);
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #FF6900;
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
  color: #FF6900;
}

.item-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.topic-title {
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

.topic-title:hover {
  color: #FF6900;
  text-decoration: underline;
}

.topic-desc {
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
  color: #FF6900;
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
  box-shadow: 0 0 16px rgba(255, 105, 0, 0.4);
}

:root.dark .clickable-logo:hover {
  box-shadow: 0 0 20px rgba(255, 105, 0, 0.6);
}

@media (max-width: 768px) {
  .hupu-card {
    max-width: 100%;
  }
}
</style>