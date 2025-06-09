<template>
  <div class="trending-card">
    <div class="trending-header">
      <span class="trending-icon"><slot name="icon" /></span>
      <span class="trending-title">{{ title }}</span>
      <span class="trending-update">（{{ formattedUpdateTime }}）</span>
      <slot name="header-addon"></slot>
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  title: string;
  list: any[];
  itemKey?: (item: any, index: number) => string | number;
  loading?: boolean;
  updateTime?: number;
}>();

const emit = defineEmits(['refresh']);
const refreshTimer = ref<number | null>(null);
const forceUpdate = ref(0); // 用于强制更新计算属性
const lastUpdateTime = ref(props.updateTime || 0); // 存储上一次的更新时间

// 监听updateTime的变化
watch(() => props.updateTime, (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    // 当接口返回新的updateTime时，记录下来
    lastUpdateTime.value = newVal;
  }
});

// 格式化时间显示
const formattedUpdateTime = computed(() => {
  // forceUpdate.value 参与计算，但不影响结果，用于强制刷新
  forceUpdate.value;
  
  // 使用实际的updateTime
  const currentTime = props.updateTime || 0;
  
  if (!currentTime) {
    return '暂无更新时间';
  }
  
  const now = Date.now();
  const diff = now - currentTime;
  
  // 小于1分钟
  if (diff < 60 * 1000) {
    return '刚刚更新';
  }
  
  // 小于1小时，显示分钟
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes}分钟前`;
  }
  
  // 小于24小时，显示小时
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours}小时前`;
  }
  
  // 大于24小时，显示日期
  const date = new Date(currentTime);
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
});

// 每分钟更新一次时间显示
const startTimeRefreshTimer = () => {
  // 清除之前的定时器
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value);
  }
  
  // 设置每分钟执行一次的定时器
  refreshTimer.value = setInterval(() => {
    forceUpdate.value++; // 强制更新计算属性
  }, 60000) as unknown as number;
};

// 组件挂载时启动定时器
onMounted(() => {
  startTimeRefreshTimer();
});

// 组件卸载时清除定时器
onUnmounted(() => {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value);
    refreshTimer.value = null;
  }
});

const handleRefresh = () => {
  emit('refresh');
  // 不再手动设置"刚刚更新"，而是由父组件更新updateTime
  // 接口完成后会自动更新updateTime并显示正确的时间
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