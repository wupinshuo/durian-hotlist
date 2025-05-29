<template>
  <div class="trending-card">
    <div class="trending-header">
      <span class="trending-icon"><slot name="icon" /></span>
      <span class="trending-title">{{ title }}</span>
      <span class="trending-update">（{{ updateTime }}）</span>
      <el-button circle size="small" class="refresh-btn" @click="handleRefresh">
        <el-icon><Refresh /></el-icon>
      </el-button>
    </div>
    <div class="trending-list-wrapper">
      <div class="trending-list-inner">
        <el-skeleton v-if="loading" :rows="8" animated />
        <template v-else>
          <div class="trending-list">
            <slot name="item" v-for="(item, index) in list" :item="item" :index="index" :key="itemKey(item, index)" />
            <div v-if="!list?.length" class="empty-tip">暂无数据</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue';
import { ref } from 'vue';

defineProps<{
  title: string;
  list: any[];
  itemKey?: (item: any, index: number) => string | number;
  loading?: boolean;
}>();

const emit = defineEmits(['refresh']);
const updateTime = ref('15分钟前');

const handleRefresh = () => {
  emit('refresh');
  updateTime.value = '刚刚更新';
  setTimeout(() => {
    updateTime.value = '1分钟前';
  }, 60000);
};
</script>

<style scoped>
.trending-card {
  width: 100%;
  max-width: 300px;
  margin: 0;
  padding: 0 0 8px 0;
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  /* 固定卡片高度 */
  height: 400px;
  box-sizing: border-box;
}
.trending-header {
  display: flex;
  align-items: center;
  padding: 15px 15px 8px 15px;
  border-radius: 18px 18px 0 0;
}
.trending-icon {
  margin-right: 8px;
  display: flex;
  align-items: center;
}
.trending-title {
  font-size: 16px;
  font-weight: 700;
  color: #1976d2;
}
.trending-update {
  color: #909399;
  font-size: 12px;
  margin-left: 8px;
}
.refresh-btn {
  margin-left: auto;
  opacity: 0.7;
  transition: all 0.3s;
}
.refresh-btn:hover {
  opacity: 1;
  transform: rotate(180deg);
  transition: transform 0.6s;
}
.trending-list-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px 0 0;
  /* 内容区高度填满剩余空间 */
  height: 300px;
  min-height: 300px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.trending-list-inner {
  height: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.trending-list {
  display: flex;
  flex-direction: column;
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
@media (max-width: 600px) {
  .trending-card {
    max-width: 100vw;
    border-radius: 0;
  }
  .trending-header {
    border-radius: 0;
    padding: 16px 10px 8px 10px;
  }
}
</style> 