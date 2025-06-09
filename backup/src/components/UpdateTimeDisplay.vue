<template>
  <div class="refresh-wrapper">
    <div class="update-time">
      <span class="update-dot"></span>
      {{ formattedUpdateTime }}
    </div>
    
    <button class="refresh-btn" @click="handleRefresh" :disabled="loading">
      <svg class="refresh-icon" viewBox="0 0 24 24" :class="{ 'rotating': loading }">
        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';

// 接收父组件传递的参数
const props = defineProps<{
  // 更新时间戳
  updateTime?: number;
  // 主题色
  themeColor?: string;
  // 是否正在加载
  loading?: boolean;
}>();

// 定义事件
const emit = defineEmits(['refresh']);

// 当前时间戳引用，用于自动更新
const currentTime = ref(Date.now());

// 定时器ID
let timer: number | null = null;

// 创建定时器，每60秒更新一次时间显示
onMounted(() => {
  timer = window.setInterval(() => {
    currentTime.value = Date.now();
  }, 60 * 1000); // 每分钟更新一次
});

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
});

// 格式化更新时间
const formattedUpdateTime = computed(() => {
  if (!props.updateTime) {
    return '暂无更新';
  }
  
  const now = currentTime.value; // 使用响应式的当前时间
  const diff = now - props.updateTime;
  
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
  const date = new Date(props.updateTime);
  return `${date.getMonth() + 1}月${date.getDate()}日更新`;
});

// 获取点和文字的颜色
const dotColor = computed(() => {
  return props.themeColor || '#40b583';
});

// 处理刷新事件
function handleRefresh() {
  emit('refresh');
}
</script>

<style scoped>
.refresh-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.update-time {
  font-size: 12px;
  color: v-bind(dotColor);
  display: flex;
  align-items: center;
  gap: 4px;
}

.update-dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  background-color: v-bind(dotColor);
  border-radius: 50%;
}

.refresh-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.refresh-btn:hover {
  background: rgba(88, 166, 255, 0.1);
}

.refresh-icon {
  width: 16px;
  height: 16px;
  fill: #8c959f;
  transition: transform 0.6s ease;
}

.refresh-icon.rotating {
  animation: rotate 1s infinite linear;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style> 