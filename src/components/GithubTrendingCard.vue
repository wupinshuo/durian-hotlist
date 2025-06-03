<template>
  <div class="github-card">
    <div class="card-header">
      <div class="header-left">
        <div class="logo">
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
            <path :fill="isDarkMode ? '#ffffff' : '#24292f'" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </div>
        <div>
          <div class="title-row">
            <div class="title">GitHub热榜</div>
            <div class="period-text">{{ periodShortText }}</div>
          </div>
          <div class="subtitle">开源热点</div>
        </div>
      </div>
      
      <div class="right-actions">
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
        
        <div class="refresh-wrapper">
          <div class="time-indicator">
            <div class="status-dot"></div>
            <span class="time-text">{{ formattedUpdateTime }}</span>
          </div>
          
          <button class="refresh-btn" @click="handleRefresh" :disabled="loading">
            <svg class="refresh-icon" viewBox="0 0 24 24" :class="{ 'rotating': loading }">
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
            </svg>
          </button>
        </div>
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
                <a :href="item.url" target="_blank" class="repo-name" :title="item.name">{{ item.name }}</a>
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

const themeStore = useThemeStore();
const isDarkMode = computed(() => themeStore.isDark);

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

// 格式化更新时间
const formattedUpdateTime = computed(() => {
  if (!props.updateTime) {
    return '暂无更新';
  }
  
  const now = Date.now();
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

// 根据当前选择的时间范围显示对应的星星数
function getStarsByPeriod(item: any) {
  switch (currentPeriod.value) {
    case GITHUB_PERIOD.DAILY:
      return item.starsToday;
    case GITHUB_PERIOD.WEEKLY:
      return item.starsThisWeek;
    case GITHUB_PERIOD.MONTHLY:
      return item.starsThisMonth;
    default:
      return item.starsThisWeek;
  }
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
  padding: 8px 10px;
  border-bottom: 1px solid var(--border-color, rgba(48, 54, 61, 0.3));
  position: relative;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #58a6ff, #79c0ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.period-text {
  font-size: 14px;
  color: var(--muted-foreground);
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

.right-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.refresh-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.time-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(35, 134, 54, 0.1);
  padding: 4px 8px;
  border-radius: var(--radius-full, 50px);
  border: 1px solid rgba(35, 134, 54, 0.2);
}

.status-dot {
  width: 5px;
  height: 5px;
  background: #2ea043;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
}

.time-text {
  font-size: 11px;
  color: #2ea043;
}

.period-selector {
  display: flex;
  background: var(--muted, rgba(13, 17, 23, 0.5));
  border-radius: var(--radius, 6px);
  padding: 2px;
  border: 1px solid var(--border-color, rgba(48, 54, 61, 0.4));
}

/* 浅色模式下的切换按钮容器 */
:root:not(.dark) .period-selector {
  background: rgba(240, 242, 245, 0.8);
  border: 1px solid rgba(200, 205, 215, 0.6);
}

.period-btn {
  padding: 3px 7px;
  border: none;
  background: transparent;
  color: var(--muted-foreground);
  font-size: 12px;
  font-weight: 500;
  border-radius: var(--radius, 4px);
  cursor: pointer;
  transition: all 0.3s ease;
}

/* 浅色模式下的按钮文字颜色 */
:root:not(.dark) .period-btn {
  color: rgba(80, 90, 110, 0.8);
}

.period-btn.active {
  background: linear-gradient(135deg, #58a6ff, #79c0ff);
  color: var(--background);
  box-shadow: 0 2px 6px rgba(88, 166, 255, 0.3);
}

/* 浅色模式下的活跃按钮 */
:root:not(.dark) .period-btn.active {
  background: linear-gradient(135deg, #4182dd, #589bf5);
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(65, 130, 221, 0.3);
}

.refresh-btn {
  background: rgba(88, 166, 255, 0.1);
  border: 1px solid rgba(88, 166, 255, 0.2);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: rgba(88, 166, 255, 0.2);
}

.refresh-icon {
  width: 14px;
  height: 14px;
  fill: #58a6ff;
  transition: transform 0.6s ease;
}

.refresh-icon.rotating {
  animation: rotate 1s infinite linear;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
  color: #ff6b35;
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

@media (max-width: 768px) {
  .github-card {
    max-width: 100%;
  }
}
</style> 