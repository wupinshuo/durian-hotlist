<template>
  <div class="juejin-card">
    <div class="card-header">
      <div class="header-left">
        <div class="logo">
          <svg width="22" height="22" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path d="M512 128L128 384l384 256 384-256L512 128z" fill="#1e80ff"/>
              <path d="M512 576L256 416l-64 42.7L512 704l320-245.3-64-42.7-256 160z" fill="#1e80ff"/>
              <path d="M512 768l-192-147.2-64 42.7L512 896l256-192.5-64-42.7L512 768z" fill="#1e80ff"/>
            </g>
          </svg>
        </div>
        <div>
          <div class="title">掘金热榜</div>
          <div class="subtitle">技术头条</div>
        </div>
      </div>
      
      <UpdateTimeDisplay 
        :update-time="updateTime" 
        :loading="loading" 
        theme-color="#1e80ff"
        @refresh="handleRefresh" 
      />
    </div>

    <div class="trending-list-wrapper">
      <div class="trending-list-inner">
        <el-skeleton v-if="loading" :rows="8" animated />
        <template v-else>
          <div class="trending-list">
            <div v-for="(item, index) in articles" :key="item.url" class="trending-item" :class="{ top: index < 3 }">
              <div class="item-rank" :class="{ top: index < 3 }">{{ index + 1 }}</div>
              <div class="item-main">
                <a 
                  :href="item.url" 
                  target="_blank" 
                  class="article-title" 
                  :class="{'read-link': isRead(item.url)}"
                  :title="item.title"
                  @click="markAsRead(item.url)"
                >{{ item.title }}</a>
                <div class="article-meta">
                  <span class="article-hot">
                    <AppIcon name="juejin-hot" class="hot-icon" />
                    {{ item.hot }} 热度
                  </span>
                </div>
              </div>
            </div>
            <div v-if="!articles.length" class="empty-tip">暂无数据</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElSkeleton } from 'element-plus';
import { UpdateTimeDisplay, AppIcon } from './index';
import { useReadStatus } from '../composables/useReadStatus';

const props = defineProps<{
  articles: Array<{
    title: string;
    url: string;
    hot: string;
  }>;
  loading?: boolean;
  updateTime?: number;
}>();
const emit = defineEmits(['refresh']);

// 使用已读状态管理
const { isRead, markAsRead } = useReadStatus();

function handleRefresh() {
  emit('refresh');
}
</script>

<style scoped>
.juejin-card {
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
  background: linear-gradient(135deg, #1e80ff, #3694ff);
  box-shadow: 0 0 8px rgba(30, 128, 255, 0.25);
}

.logo svg {
  width: 22px;
  height: 22px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.logo svg path {
  fill: #ffffff !important;
}

/* 深色模式下增加发光效果 */
:root.dark .logo {
  box-shadow: 0 0 12px rgba(30, 128, 255, 0.5);
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #1e80ff;
}

.subtitle {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* 原有列表样式 */
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
  padding: 5px 5px;
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
  color: #f67c0b;
}

.item-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
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
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-title:hover {
  color: #1e80ff;
  text-decoration: underline;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  line-height: 1.2;
}

.article-hot {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #f67c0b;
}

.hot-icon {
  width: 14px;
  height: 14px;
  color: #f67c0b;
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

/* 深色模式特定样式 */
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

@media (max-width: 768px) {
  .juejin-card {
    max-width: 100%;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style> 