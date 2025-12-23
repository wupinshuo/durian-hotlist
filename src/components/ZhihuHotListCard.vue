<template>
  <div class="zhihu-card">
    <div class="card-header">
      <div class="header-left">
        <div class="logo clickable-logo" @click="handleLogoClick" title="访问知乎">
          <img src="/images/zhihu.svg" alt="知乎" class="logo-icon" />
        </div>
        <div>
          <div class="title">知乎热榜</div>
          <div class="subtitle">知识问答</div>
        </div>
      </div>
      
      <UpdateTimeDisplay 
        :update-time="updateTime" 
        :loading="loading" 
        theme-color="#056de8"
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
                  class="question-title" 
                  :class="{'read-link': isRead(item.url)}"
                  :title="item.title"
                  @click="handleClick(item)"
                >{{ item.title }}</a>
                <div v-if="item.desc" class="question-desc" :title="item.desc">{{ item.desc }}</div>
                <div class="repo-meta">
                  <span class="repo-stars">
                    <svg class="hot-icon" viewBox="0 0 1024 1024" width="14" height="14">
                      <path fill="#056de8" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/>
                      <path fill="#056de8" d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.4-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 65.1v36.2c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-36.2c0-26.7 22.9-49.9 52-49.9s52 23.2 52 49.9v36.2c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-36.2c0-23.3-6.8-46.1-19.9-65.1-12.9-18.6-30.9-32.8-52.1-40.9C645.6 479.6 623.6 451.1 623.6 420c0-39.3-17.2-76-48.0-103.3z"/>
                      <path fill="#056de8" d="M512 732a40 40 0 1 0 0 80 40 40 0 0 0 0-80z"/>
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
  trackClick(item, '知乎')
  
  // 增加更新触发器来强制视图更新
  updateTrigger.value++
}

/**
 * 处理 logo 点击事件
 */
function handleLogoClick() {
  window.open('https://www.zhihu.com', '_blank')
}

/**
 * 格式化知乎热榜数据中的热度数量
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
.zhihu-card {
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
  background: linear-gradient(135deg, #056de8, #1890ff);
  box-shadow: 0 0 8px rgba(5, 109, 232, 0.25);
}

.logo-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

/* 深色模式下增加发光效果 */
:root.dark .logo {
  box-shadow: 0 0 12px rgba(5, 109, 232, 0.6);
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #056de8;
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
  color: #056de8;
}

.item-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.question-title {
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

.question-title:hover {
  color: #056de8;
  text-decoration: underline;
}

.question-desc {
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
  color: #056de8;
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
  box-shadow: 0 0 16px rgba(5, 109, 232, 0.4);
}

:root.dark .clickable-logo:hover {
  box-shadow: 0 0 20px rgba(5, 109, 232, 0.6);
}

@media (max-width: 768px) {
  .zhihu-card {
    max-width: 100%;
  }
}
</style>