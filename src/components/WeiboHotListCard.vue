<template>
  <div class="weibo-card">
    <div class="card-header">
      <div class="header-left">
        <div class="logo">
          <svg width="24" height="24" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M851.4 590.193c-22.196-66.233-90.385-90.422-105.912-91.863-15.523-1.442-29.593-9.94-19.295-27.505 10.302-17.566 29.304-68.684-7.248-104.681-36.564-36.14-116.512-22.462-173.094 0.866-56.434 23.327-53.39 7.055-51.65-8.925 1.89-16.848 32.355-111.02-60.791-122.395C311.395 220.86 154.85 370.754 99.572 457.15 16 587.607 29.208 675.873 29.208 675.873h0.58c10.009 121.819 190.787 218.869 412.328 218.869 190.5 0 350.961-71.853 398.402-169.478 0 0 0.143-0.433 0.575-1.156 4.938-10.506 8.71-21.168 11.035-32.254 6.668-26.205 11.755-64.215-0.728-101.66z m-436.7 251.27c-157.71 0-285.674-84.095-285.674-187.768 0-103.671 127.82-187.76 285.674-187.76 157.705 0 285.673 84.089 285.673 187.76 0 103.815-127.968 187.768-285.673 187.768z" fill="#E6162D"/>
            <path d="M803.096 425.327c2.896 1.298 5.945 1.869 8.994 1.869 8.993 0 17.7-5.328 21.323-14.112 5.95-13.964 8.993-28.793 8.993-44.205 0-62.488-51.208-113.321-114.181-113.321-15.379 0-30.32 3.022-44.396 8.926-11.755 4.896-17.263 18.432-12.335 30.24 4.933 11.662 18.572 17.134 30.465 12.238 8.419-3.46 17.268-5.33 26.41-5.33 37.431 0 67.752 30.241 67.752 67.247 0 9.068-1.735 17.857-5.369 26.202a22.832 22.832 0 0 0 12.335 30.236l0.01 0.01z m-162.421-1.869a22.764 22.764 0 0 0 21.067-14.112c3.477-8.141 5.224-16.8 5.224-25.972 0-37.006-30.32-67.247-67.756-67.247-9.145 0-18.003 1.87-26.276 5.325-11.755 4.897-17.259 18.432-12.33 30.073 4.934 11.662 18.427 17.139 30.17 12.243 3.018-1.442 6.309-2.022 9.65-2.022 14.77 0 26.883 12.095 26.883 26.896 0 3.456-0.706 6.765-2.017 9.79-4.928 11.809 0.444 25.343 12.334 30.236 2.896 1.298 5.805 1.869 8.994 1.869l0.057 0.01z m-141.958 85.364c-13.81 0-26.276 3.16-37.735 8.633-83.159 41.425-75.09 130.417-75.09 130.417s-0.015 0.149 0.147 0.433c2.16 61.914 63.832 111.455 139.486 111.455 75.782 0 137.592-49.684 139.477-111.455h0.295l0.144-0.433c0-0.146 8.064-89.009-75.09-130.277-11.313-5.341-23.92-8.493-37.307-8.633h-3.992l-0.287-0.14h-0.048z m26.136 203.076c-9.147 6.328-20.39 9.792-31.702 9.792-11.463 0-22.566-3.318-31.702-9.792-9.147-6.473-14.218-15.107-14.218-24.033 0-9.07 5.071-17.71 14.218-24.037 9.136-6.328 20.19-9.792 31.702-9.792 11.322 0 22.425 3.318 31.702 9.792 9.147 6.328 14.366 14.967 14.366 24.037 0 8.926-5.36 17.56-14.366 24.033z" fill="#E6162D"/>
          </svg>
        </div>
        <div>
          <div class="title">微博热榜</div>
          <div class="subtitle">热点话题</div>
        </div>
      </div>
      
      <UpdateTimeDisplay 
        :update-time="updateTime" 
        :loading="loading" 
        theme-color="#e6162d"
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
                <a :href="item.url" target="_blank" class="repo-name" :title="item.title">{{ item.title }}</a>
                <div class="repo-meta">
                  <span class="repo-stars">
                    <svg class="hot-icon" viewBox="0 0 1024 1024" width="14" height="14"><path fill="#ff8200" d="M512 204.8c23.808-51.2 38.912-73.984 68.608-116.736C621.44 32.256 687.872 0 743.424 0c59.904 0 111.104 32.768 160.256 88.064 51.2 59.904 68.608 125.44 68.608 200.192 0 81.92-51.712 240.64-167.424 445.44-115.712 204.8-212.48 288.768-293.376 288.768-51.2 0-95.744-47.616-131.584-137.728L368.64 848.384c-20.48-55.296-44.544-83.968-72.704-83.968-9.216 0-40.96 19.456-95.232 57.344L160 791.04 398.336 512l-45.568-353.28c39.936-28.16 79.872-41.984 119.808-41.984 38.4 0.512 63.488 20.992 75.776 87.552l38.912 241.152 38.4-241.152z" /></svg>
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
import { ElSkeleton } from 'element-plus';
import { UpdateTimeDisplay } from './index';

const props = defineProps<{
  hotTopics: Array<{
    title: string;
    desc: string;
    url: string;
    hot: string;
  }>;
  loading?: boolean;
  updateTime?: number;
}>();
const emit = defineEmits(['refresh']);

function handleRefresh() {
  emit('refresh');
}

function formatHotCount(hot: string): string {
  const num = parseInt(hot, 10);
  if (isNaN(num)) {
    return hot;
  }
  
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  
  return num.toString();
}
</script>

<style scoped>
.weibo-card {
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
  background: linear-gradient(135deg, #e6162d, #ff4d4f);
  box-shadow: 0 0 8px rgba(230, 22, 45, 0.25);
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
  box-shadow: 0 0 12px rgba(230, 22, 45, 0.6);
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #e6162d;
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
  color: #ff8200;
}

.item-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.repo-name {
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

.repo-name:hover {
  color: #ff8200;
  text-decoration: underline;
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
  color: #ff8200;
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
  .weibo-card {
    max-width: 100%;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style> 