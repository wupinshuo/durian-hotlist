<template>
  <span class="app-icon" :class="[
    size ? `size-${size}` : '',
    color ? `color-${color}` : ''
  ]">
    <component :is="iconComponent" v-if="iconComponent" />
    <slot v-else></slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  BilibiliIcon, BilibiliUpIcon, BilibiliPlayIcon,
  WeiboIcon, WeiboHotIcon, 
  JuejinIcon, JuejinHotIcon, 
  SspaiIcon, 
  GuessLikesIcon,
  IconType 
} from '@/assets/icons';

// 图标映射表
const iconMap = {
  'bilibili': BilibiliIcon,
  'bilibili-up': BilibiliUpIcon,
  'bilibili-play': BilibiliPlayIcon,
  'weibo': WeiboIcon,
  'weibo-hot': WeiboHotIcon,
  'juejin': JuejinIcon,
  'juejin-hot': JuejinHotIcon,
  'sspai': SspaiIcon,
  'guess-likes': GuessLikesIcon,
};

// 定义组件属性
const props = defineProps<{
  // 图标名称
  name?: IconType;
  // 图标大小：xs(12px), sm(16px), md(20px), lg(24px), xl(32px)
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  // 图标颜色：primary, info, success, warning, danger, 也可以是具体的颜色值
  color?: string;
}>();

// 获取图标组件
const iconComponent = computed(() => {
  if (!props.name) return null;
  return iconMap[props.name] || null;
});
</script>

<style scoped>
.app-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* 图标大小 */
.size-xs {
  font-size: 12px;
}
.size-sm {
  font-size: 16px;
}
.size-md {
  font-size: 20px;
}
.size-lg {
  font-size: 24px;
}
.size-xl {
  font-size: 32px;
}

/* 图标颜色 */
.color-primary :deep(svg path) {
  fill: var(--el-color-primary);
}
.color-success :deep(svg path) {
  fill: var(--el-color-success);
}
.color-warning :deep(svg path) {
  fill: var(--el-color-warning);
}
.color-danger :deep(svg path) {
  fill: var(--el-color-danger);
}
.color-info :deep(svg path) {
  fill: var(--el-color-info);
}
.color-bilibili :deep(svg path) {
  fill: #FB7299;
}
.color-weibo :deep(svg path) {
  fill: #E6162D;
}
.color-juejin :deep(svg path) {
  fill: #1E80FF;
}
</style> 