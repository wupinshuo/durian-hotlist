<template>
  <div class="sspai-card">
    <div class="card-header">
      <div class="header-left">
        <div class="logo">
          <svg width="22" height="22" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18,0C8.1,0,0,8.1,0,18s8.1,18,18,18s18-8.1,18-18S27.9,0,18,0z M26.9,11.6c0,0.2-0.1,0.3-0.2,0.5
                c-0.1,0.1-0.3,0.2-0.4,0.2l-3.3,0.6v8.3c0,0.5,0.1,1,0.3,1.4l2.1,4c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3
                c-0.1,0.1-0.1,0.2-0.3,0.2c-0.1,0.1-0.2,0.1-0.3,0.1H23c-0.1,0-0.3,0-0.4-0.1c-0.1-0.1-0.2-0.2-0.3-0.3l-2.1-3.9
                c-0.2-0.5-0.4-1-0.4-1.5v-8.4l-4.6,0.8v11.4c0,0.2,0,0.4-0.1,0.5c-0.1,0.2-0.2,0.3-0.4,0.4l-1.3,0.8c-0.1,0.1-0.3,0.1-0.4,0.1
                s-0.3,0-0.4-0.1c-0.1-0.1-0.2-0.2-0.3-0.3c-0.1-0.1-0.1-0.3-0.1-0.4v-12l-3.4,0.6c-0.1,0-0.2,0-0.4,0c-0.1,0-0.2-0.1-0.3-0.2
                C8.1,14.9,8,14.8,8,14.6c0-0.1-0.1-0.2,0-0.4l0.2-1.4c0-0.2,0.1-0.3,0.2-0.5c0.1-0.1,0.3-0.2,0.5-0.2l17.4-2.9c0.1,0,0.3,0,0.4,0
                c0.1,0,0.2,0.1,0.3,0.2C26.9,9.5,27,9.6,27,9.7c0,0.1,0.1,0.2,0,0.4L26.9,11.6z" fill="white" class="logo"></path>
          </svg>
        </div>
        <div>
          <div class="title">少数派热榜</div>
          <div class="subtitle">科技生活</div>
        </div>
      </div>
      
      <UpdateTimeDisplay 
        :update-time="updateTime" 
        :loading="loading" 
        theme-color="#D71718"
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
                  class="repo-name" 
                  :class="{'read-link': isRead(item.url)}"
                  :title="item.title"
                  @click="handleClick(item)"
                >{{ item.title }}</a>
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
import { HotItem } from '@/types/hot';
import { useUserBehavior } from '../composables/useUserBehavior';
import { ref } from 'vue';

// 使用用户行为收集
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

// 处理点击事件
function handleClick(item: any) {
  // 使用整合的行为跟踪，会同时标记为已读
  trackClick(item, '少数派');
  
  // 增加更新触发器来强制视图更新
  updateTrigger.value++;
}
</script>

<style scoped>
.sspai-card {
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
  background: #D71718;
  box-shadow: 0 0 8px rgba(215, 23, 24, 0.25);
}

/* 深色模式下增加发光效果 */
:root.dark .logo {
  box-shadow: 0 0 12px rgba(215, 23, 24, 0.6);
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #D71718;
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
  color: #D71718;
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
  color: #D71718;
  text-decoration: underline;
}

.empty-tip {
  text-align: center;
  color: var(--muted-foreground);
  padding: 32px 0;
}

/* 滚动条美化 */
.trending-list-wrapper::-webkit-scrollbar {
  width: 6px;
}

.trending-list-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(128, 128, 128, 0.3);
  border-radius: 3px;
}

.trending-list-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: rgba(128, 128, 128, 0.5);
}
</style> 