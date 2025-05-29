<template>
  <HotListCard
    title="掘金热榜"
    :list="articles"
    :itemKey="(item) => item.url"
    :loading="loading"
    @refresh="handleRefresh"
  >
    <template #icon>
      <svg width="28" height="28" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
          <path d="M512 128L128 384l384 256 384-256L512 128z" fill="#296CFF"/>
          <path d="M512 576L256 416l-64 42.7L512 704l320-245.3-64-42.7-256 160z" fill="#296CFF"/>
          <path d="M512 768l-192-147.2-64 42.7L512 896l256-192.5-64-42.7L512 768z" fill="#296CFF"/>
        </g>
      </svg>
    </template>
    <template #item="{ item, index }">
      <div class="trending-item" :class="{ top: index < 3 }">
        <div class="item-rank" :class="{ top: index < 3 }">{{ index + 1 }}</div>
        <div class="item-main">
          <a :href="item.url" target="_blank" class="repo-name" :title="item.title">{{ item.title }}</a>
          <div class="repo-meta">
            <span class="repo-stars">
              <svg class="star-icon" viewBox="0 0 20 20" width="14" height="14"><path fill="#e3b341" d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/></svg>
              {{ item.hot }} 热度
            </span>
          </div>
        </div>
      </div>
    </template>
  </HotListCard>
</template>

<script setup lang="ts">
import HotListCard from './HotListCard.vue';

const props = defineProps<{
  articles: Array<{
    title: string;
    url: string;
    hot: string;
  }>;
  loading?: boolean;
}>();
const emit = defineEmits(['refresh']);

function handleRefresh() {
  emit('refresh');
}
</script>

<style scoped>
/* 不再需要导入外部CSS，使用全局主题CSS */
</style> 