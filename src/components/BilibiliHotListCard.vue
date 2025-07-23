<template>
  <div class="bilibili-card">
    <div class="card-header">
      <div class="header-left">
        <div class="logo clickable-logo" @click="handleLogoClick" title="访问哔哩哔哩">
          <AppIcon name="bilibili" />
        </div>
        <div>
          <div class="title">B站热榜</div>
          <div class="subtitle">学习平台</div>
        </div>
      </div>
      
      <UpdateTimeDisplay 
        :update-time="updateTime" 
        :loading="loading" 
        theme-color="#FB7299"
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
                  class="video-title" 
                  :class="{'read-link': isRead(item.url)}"
                  :title="item.title"
                  @click="handleClick(item)"
                >{{ item.title }}</a>
                <div class="repo-meta">
                  <span class="tag" v-if="item.tag">
                    <el-tag size="small" type="danger" effect="plain" class="bilibili-tag">{{ item.tag }}</el-tag>
                  </span>
                  <span class="author" v-if="item.author">
                    <AppIcon name="bilibili-up" class="up-icon" />
                    {{ item.author }}
                  </span>
                  <span class="repo-stars">
                    <AppIcon name="bilibili-play" class="hot-icon" />
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
import { ElSkeleton, ElTag } from 'element-plus';
import { UpdateTimeDisplay } from './index';
import { HotItem } from '@/types/hot';
import AppIcon from './AppIcon.vue';
import { useUserBehavior } from '../composables/useUserBehavior';
import { ref } from 'vue';

const { isRead, trackClick } = useUserBehavior();

// 用于强制组件重新渲染
const updateTrigger = ref(0);

const props = defineProps<{
  hotTopics: HotItem[];
  loading?: boolean;
  updateTime?: number;
}>();
const emit = defineEmits(['refresh']);

function handleRefresh() {
  emit('refresh');
}

function handleClick(item: any) {
  trackClick(item, 'B站');
  
  // 增加更新触发器来强制视图更新
  updateTrigger.value++;
}

// 处理 logo 点击事件
function handleLogoClick() {
  window.open('https://www.bilibili.com', '_blank');
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
.bilibili-card {
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
  background: #FB7299;
  box-shadow: 0 0 8px rgba(251, 114, 153, 0.25);
}

:deep(.svg-icon svg) {
  width: 22px;
  height: 22px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

:deep(.svg-icon svg path) {
  fill: #ffffff;
}

:deep(.up-icon svg path),
:deep(.hot-icon svg path) {
  fill: #FB7299;
}

/* 深色模式下增加发光效果 */
:root.dark .logo {
  box-shadow: 0 0 12px rgba(251, 114, 153, 0.6);
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #FB7299;
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
  padding: 8px 12px;
  margin-bottom: 4px;
  border-radius: var(--radius, 6px);
  transition: all 0.2s ease;
  position: relative;
  align-items: flex-start;
}

.trending-item:hover {
  background-color: var(--hover-bg, rgba(200, 200, 200, 0.1));
}

.item-rank {
  width: 20px;
  height: 20px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: center;
  margin-right: 8px;
  flex-shrink: 0;
}

.item-rank.top {
  color: #FB7299;
  font-weight: 700;
}

.trending-item.top {
  font-weight: 700;
}

.item-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.video-title {
  font-size: 13px;
  line-height: 1.4;
  color: var(--text-primary);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  margin-bottom: 2px;
}

.read-link {
  color: var(--text-muted);
}

.repo-meta {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 1px;
  line-height: 1.2;
  gap: 8px;
}

.up-icon, .hot-icon {
  margin-right: 4px;
}

.repo-stars, .author {
  display: flex;
  align-items: center;
}

.author {
  color: #FB7299;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bilibili-tag {
  font-size: 10px;
  padding: 0 5px;
  height: 18px;
  line-height: 16px;
  border-color: #FB7299;
  color: #FB7299;
}

.tag {
  display: flex;
  align-items: center;
}

.empty-tip {
  text-align: center;
  color: var(--text-muted);
  padding: 32px 0;
}

/* 滚动条美化 */
.trending-list-wrapper::-webkit-scrollbar {
  width: 6px;
}

.trending-list-wrapper::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 6px;
}

/* 可点击的 logo 样式 */
.clickable-logo {
  cursor: pointer;
  transition: all 0.2s ease;
}

.clickable-logo:hover {
  transform: scale(1.05);
  box-shadow: 0 0 16px rgba(251, 114, 153, 0.4);
}

:root.dark .clickable-logo:hover {
  box-shadow: 0 0 20px rgba(251, 114, 153, 0.6);
}

@media (max-width: 600px) {
  .bilibili-card {
    max-width: 100%;
    border-radius: 0;
  }
}
</style> 