<template>
  <HotListCard
    title="GitHub热榜（周）"
    :list="repos"
    :itemKey="(item) => item.url"
    :loading="loading"
    @refresh="handleRefresh"
  >
    <template #icon>
      <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
        <path :fill="isDarkMode ? '#ffffff' : '#24292f'" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    </template>
    <template #item="{ item, index }">
      <div class="trending-item" :class="{ top: index < 3 }">
        <div class="item-rank" :class="{ top: index < 3 }">{{ index + 1 }}</div>
        <div class="item-main">
          <a :href="item.url" target="_blank" class="repo-name" :title="item.name">{{ item.name }}</a>
          <div class="repo-desc" v-if="item.description">{{ item.description }}</div>
          <div class="repo-meta">
            <span class="repo-lang" v-if="item.language">
              <span class="language-dot" :style="{ backgroundColor: getLanguageColor(item.language) }"></span>
              {{ item.language }}
            </span>
            <span class="repo-stars">
              <svg class="star-icon" viewBox="0 0 20 20" width="14" height="14"><path fill="#e3b341" d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/></svg>
              {{ item.stars }}
            </span>
            <span class="repo-forks" v-if="item.forks">
              <svg class="fork-icon" viewBox="0 0 20 20" width="14" height="14"><path :fill="isDarkMode ? '#999' : '#bbb'" d="M5 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM3 5v2.5A2.5 2.5 0 0 0 5.5 10H9v2.5a2.5 2.5 0 0 0 2 2.45V10h3.5A2.5 2.5 0 0 0 17 7.5V5h-2v2.5a.5.5 0 0 1-.5.5H11V5h-2v3H5.5a.5.5 0 0 1-.5-.5V5H3z"/></svg>
              {{ item.forks }}
            </span>
            <span class="repo-stars-week" v-if="item.starsThisWeek">
              <svg class="trend-icon" viewBox="0 0 20 20" width="14" height="14"><path fill="#1a73e8" d="M2 14l4-4 4 4 6-6 2 2v4H2z"/></svg>
              {{ item.starsThisWeek }}
            </span>
          </div>
        </div>
        <div class="item-author" v-if="item.authorAvatar">
          <img :src="item.authorAvatar" :alt="item.author" class="author-avatar" />
        </div>
      </div>
    </template>
  </HotListCard>
</template>

<script setup lang="ts">
import HotListCard from './HotListCard.vue';
import { useThemeStore } from '../store/theme';
import { computed } from 'vue';

const themeStore = useThemeStore();
const isDarkMode = computed(() => themeStore.isDark);

const props = defineProps<{
  repos: Array<{
    name: string;
    url: string;
    description: string;
    stars: string;
    language: string;
    forks: string;
    starsThisWeek: string;
    starsToday: string;
    author?: string;
    authorAvatar?: string;
  }>;
  loading?: boolean;
}>();
const emit = defineEmits(['refresh']);

function getLanguageColor(language: string): string {
  const colorMap: Record<string, string> = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
  };
  return colorMap[language] || '#8e8e8e';
}

function handleRefresh() {
  emit('refresh');
}
</script>

<style scoped>
/* 不再需要导入外部CSS，使用全局主题CSS */
</style> 