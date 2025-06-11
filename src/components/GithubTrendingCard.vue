<template>
  <div class="github-card">
    <div class="card-header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo">
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
              <path :fill="isDarkMode ? '#ffffff' : '#24292f'" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </div>
          <div class="header-title">
            <div class="title-row">
              <div class="title">GitHub</div>
              <div class="period-selector">
                <button 
                  v-for="period in availablePeriods" 
                  :key="period.value"
                  :class="['period-btn', { active: currentPeriod === period.value }]"
                  @click="handlePeriodChange(period.value)"
                >
                  {{ period.label }}
                </button>
              </div>
            </div>
            <div class="subtitle">开源热点</div>
          </div>
        </div>

        <UpdateTimeDisplay 
          :update-time="updateTime" 
          :loading="loading" 
          theme-color="#40b583"
          @refresh="handleRefresh" 
        />
      </div>
    </div>

    <div class="trending-list-wrapper">
      <div class="trending-list-inner">
        <el-skeleton v-if="loading" :rows="8" animated />
        <template v-else>
          <div class="trending-list">
            <div v-for="(item, index) in repos" :key="item.url" class="trending-item" :class="{ top: index < 3 }">
              <div class="item-rank" :class="{ top: index < 3 }">{{ index + 1 }}</div>
              <div class="item-main">
                <a 
                  :href="item.url" 
                  target="_blank" 
                  class="repo-name" 
                  :class="{'read-link': isRead(item.url)}"
                  :title="item.name"
                  @click="markAsRead(item.url)"
                >{{ item.name }}</a>
                <div v-if="item.desc" class="repo-desc" :title="item.desc">{{ item.desc }}</div>
                <div class="repo-meta">
                  <span class="repo-lang" v-if="item.language">
                    <span class="language-dot" :style="{ backgroundColor: getLanguageColor(item.language) }"></span>
                    {{ item.language }}
                  </span>
                  <span class="repo-stars">
                    <svg class="star-icon" viewBox="0 0 20 20" width="14" height="14"><path fill="#e3b341" d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/></svg>
                    {{ item.stars }}
                  </span>
                  <span class="repo-stars-period">
                    <svg class="trend-icon" viewBox="0 0 20 20" width="14" height="14"><path fill="#1a73e8" d="M2 14l4-4 4 4 6-6 2 2v4H2z"/></svg>
                    {{ getStarsByPeriod(item) }} {{ periodSuffix }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="!repos.length" class="empty-tip">暂无数据</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '../store/theme';
import { computed, ref } from 'vue';
import { GithubPeriod, GITHUB_PERIOD, GITHUB_PERIOD_TEXT } from '@/constants/hotlist';
import { ElSkeleton } from 'element-plus';
import { UpdateTimeDisplay } from './index';
import { useReadStatus } from '../composables/useReadStatus';

const themeStore = useThemeStore();
const isDarkMode = computed(() => themeStore.isDark);

// 使用已读状态管理
const { isRead, markAsRead } = useReadStatus();

const props = defineProps<{
  repos: Array<{
    name: string;
    url: string;
    desc: string;
    language: string;
    stars: string;
    forks: string;
    starsToday: string;
    starsThisWeek: string;
    starsThisMonth: string;
    author?: string;
    authorAvatar?: string;
  }>;
  loading?: boolean;
  updateTime?: number;
}>();

const emit = defineEmits(['refresh', 'periodChange']);

// 当前时间范围
const currentPeriod = ref<GithubPeriod>(GITHUB_PERIOD.WEEKLY);

// 可用的时间范围
const availablePeriods = [
  { value: GITHUB_PERIOD.DAILY, label: '日' },
  { value: GITHUB_PERIOD.WEEKLY, label: '周' },
  { value: GITHUB_PERIOD.MONTHLY, label: '月' }
];

// 简短周期文本 (用于显示在标题旁)
const periodShortText = computed(() => {
  switch (currentPeriod.value) {
    case GITHUB_PERIOD.DAILY: return '(日)';
    case GITHUB_PERIOD.WEEKLY: return '(周)';
    case GITHUB_PERIOD.MONTHLY: return '(月)';
    default: return '';
  }
});

// 根据时间周期返回后缀
const periodSuffix = computed(() => {
  switch (currentPeriod.value) {
    case GITHUB_PERIOD.DAILY: return '今日';
    case GITHUB_PERIOD.WEEKLY: return '本周';
    case GITHUB_PERIOD.MONTHLY: return '本月';
    default: return '';
  }
});

function formatStarsCount(count: string): string {
  // 如果包含 "stars this week" 或 "stars today" 或 "stars this month"，只保留数字和"stars"
  if (!count) return '';
  
  return count.replace(/ (this week|today|this month)( |$)/i, ' ');
}

// 根据当前选择的时间范围显示对应的星星数
function getStarsByPeriod(item: any) {
  let result = '';
  
  switch (currentPeriod.value) {
    case GITHUB_PERIOD.DAILY:
      result = item.starsToday;
      break;
    case GITHUB_PERIOD.WEEKLY:
      result = item.starsThisWeek;
      break;
    case GITHUB_PERIOD.MONTHLY:
      result = item.starsThisMonth;
      break;
    default:
      result = item.starsThisWeek;
  }
  
  return formatStarsCount(result);
}

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

// 处理刷新
function handleRefresh() {
  emit('refresh', currentPeriod.value);
}

// 处理时间范围变化
function handlePeriodChange(period: GithubPeriod) {
  currentPeriod.value = period;
  emit('periodChange', period);
}
</script>

<style scoped>
.github-card {
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
  flex-direction: column;
  padding: 10px 10px;
  border-bottom: 1px solid var(--border-color, rgba(48, 54, 61, 0.3));
  position: relative;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.header-title {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #58a6ff;
  white-space: nowrap;
}

.period-selector {
  display: flex;
  background: var(--card-bg, rgba(22, 27, 34, 0.8));
  border-radius: var(--radius, 6px);
  padding: 1px;
  border: 1px solid var(--border-color, rgba(48, 54, 61, 0.4));
  height: 20px;
}

.period-btn {
  padding: 1px 6px;
  border: none;
  background: transparent;
  color: var(--muted-foreground);
  font-size: 11px;
  font-weight: 500;
  border-radius: var(--radius, 4px);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 22px;
  text-align: center;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius, 6px);
  background: linear-gradient(135deg, #238636, #2ea043);
  box-shadow: 0 0 10px rgba(35, 134, 54, 0.3);
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
  box-shadow: 0 0 12px rgba(35, 134, 54, 0.5);
}

/* 浅色模式下调整边框颜色 */
:root:not(.dark) .logo {
  background: linear-gradient(135deg, #2ea043, #3fb950);
  box-shadow: 0 0 8px rgba(35, 134, 54, 0.25);
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
  padding: 6px 5px;
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
  color: #ff6b35;
}

.item-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.repo-name {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.3;
  color: var(--accent-blue, #58a6ff);
  text-decoration: none;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.repo-name:hover {
  color: var(--accent-blue-hover, #79c0ff);
  text-decoration: underline;
}

.repo-desc {
  font-size: 12px;
  line-height: 1.3;
  color: var(--muted-foreground, #8b949e);
  margin-top: 1px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  opacity: 0.9;
}

.repo-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 11px;
  line-height: 1.2;
}

.repo-lang {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--foreground);
}

.language-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.repo-stars {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--muted-foreground);
}

.repo-stars-period {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #1a73e8;
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

/* 深色模式特定滚动条样式 */
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

/* 浅色模式下的切换按钮容器 */
:root:not(.dark) .period-selector {
  background: rgba(240, 242, 245, 0.8);
  border: 1px solid rgba(200, 205, 215, 0.6);
}

/* 浅色模式下的按钮文字颜色 */
:root:not(.dark) .period-btn {
  color: rgba(80, 90, 110, 0.8);
}

.period-btn.active {
  background: #58a6ff;
  color: #fff;
  box-shadow: 0 2px 4px rgba(88, 166, 255, 0.2);
}

/* 浅色模式下的活跃按钮 */
:root:not(.dark) .period-btn.active {
  background: #4182dd;
  color: #ffffff;
  box-shadow: 0 1px 2px rgba(65, 130, 221, 0.2);
}

@media (max-width: 768px) {
  .github-card {
    max-width: 100%;
  }
}
</style> 