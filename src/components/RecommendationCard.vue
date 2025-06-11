<template>
  <div class="recommendation-card">
    <div class="card-header">
      <div class="header-left">
        <div class="logo">
          <AppIcon name="guess-likes" />
        </div>
        <div>
          <div class="title">猜你喜欢</div>
          <div class="subtitle">个性化推荐</div>
        </div>
      </div>
      
      <div class="header-right">
        <button class="action-btn" @click="showInterestSelector">
          <svg class="action-icon" viewBox="0 0 24 24" width="16" height="16">
            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/>
          </svg>
          <span class="action-text">设置兴趣</span>
        </button>
        <button 
          v-if="recommendations.length > 0" 
          class="action-btn refresh-btn" 
          @click="refreshRecommendations"
          :disabled="loading"
        >
          <svg class="action-icon refresh-icon" viewBox="0 0 24 24" width="16" height="16" :class="{ 'rotating': loading }">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
          </svg>
          <span class="action-text">{{ loading ? '刷新中...' : '刷新推荐' }}</span>
        </button>
      </div>
    </div>

    <div class="recommendation-list-wrapper">
      <div class="recommendation-list-inner">
        <el-skeleton v-if="loading" :rows="8" animated />
        <template v-else>
          <div v-if="recommendations.length > 0" class="recommendation-list">
            <div 
              v-for="item in recommendations.slice(0, 8)" 
              :key="item.url" 
              class="recommendation-item"
            >
              <div class="item-source">
                <el-tag size="small" :style="{ backgroundColor: getSourceColor(item.source) }">
                  {{ item.source }}
                </el-tag>
              </div>
              <div class="item-main">
                <a 
                  :href="item.url" 
                  target="_blank" 
                  class="item-title" 
                  :class="{'read-link': isRead(item.url)}"
                  :title="item.title"
                  @click="handleClick(item)"
                >{{ item.title }}</a>
                <div class="item-reason">{{ item.reason }}</div>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-recommendations">
            <div class="empty-icon">
              <AppIcon name="guess-likes" />
            </div>
            <p class="empty-text">还没有推荐内容</p>
            <p class="empty-subtext">浏览更多内容或设置您的兴趣偏好</p>
            <el-button @click="showInterestSelector" type="primary">设置兴趣</el-button>
          </div>
        </template>
      </div>
    </div>
    
    <!-- 兴趣选择器对话框 -->
    <el-dialog v-model="interestDialogVisible" title="选择你感兴趣的主题" width="400px">
      <div class="interest-tags">
        <el-tag
          v-for="tag in availableTags"
          :key="tag"
          :class="{ selected: selectedTags.includes(tag) }"
          @click="toggleTag(tag)"
          class="interest-tag"
        >
          {{ tag }}
        </el-tag>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="interestDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveInterests">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElButton, ElTag, ElSkeleton, ElDialog, ElMessage } from 'element-plus';
import { RecommendationItem } from '@/composables/useRecommendationEngine';
import { useUserBehavior } from '@/composables/useUserBehavior';
import AppIcon from './AppIcon.vue';

// 接收外部传入的推荐数据和加载状态
const props = defineProps<{
  recommendations: RecommendationItem[];
  loading: boolean;
}>();

// 发射事件
const emit = defineEmits(['refresh', 'recordClick']);

// 使用用户行为收集
const { trackClick, isRead } = useUserBehavior();

// 用于强制组件重新渲染
const updateTrigger = ref(0);

// 兴趣标签选择对话框
const interestDialogVisible = ref(false);
const selectedTags = ref<string[]>([]);

// 可选的兴趣标签
const availableTags = [
  'React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'Node.js', 
  'Python', 'Java', 'Go', 'Rust', 'AI', '人工智能', '机器学习', 
  '深度学习', '区块链', '云计算', '大数据', '前端', '后端', '全栈',
  '微服务', 'Docker', 'Kubernetes', '开源', 'Git', 'GitHub',
  '算法', '编程', '架构', '数据库', 'API', '服务器', '安全',
  'iOS', 'Android', '移动端', 'Web3', '元宇宙',
  '科技', '金融', '教育', '医疗', '电商', '游戏', '娱乐', '音乐',
  '视频', '直播', '社交', '出行', '健康', '创业', '投资', '营销'
];

// 加载已保存的兴趣标签
onMounted(() => {
  loadSavedInterests();
});

// 切换标签选择状态
function toggleTag(tag: string) {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
  } else {
    selectedTags.value.splice(index, 1);
  }
}

// 保存用户兴趣标签
function saveInterests() {
  try {
    localStorage.setItem('durian_user_interests', JSON.stringify(selectedTags.value));
    interestDialogVisible.value = false;
    ElMessage.success('兴趣设置已保存');
    emit('refresh');
  } catch (error) {
    console.error('保存兴趣标签失败', error);
    ElMessage.error('保存失败，请重试');
  }
}

// 加载保存的兴趣标签
function loadSavedInterests() {
  try {
    const savedInterests = localStorage.getItem('durian_user_interests');
    if (savedInterests) {
      selectedTags.value = JSON.parse(savedInterests);
    }
  } catch (error) {
    console.error('加载兴趣标签失败', error);
  }
}

// 显示兴趣选择器
function showInterestSelector() {
  interestDialogVisible.value = true;
}

// 刷新推荐
function refreshRecommendations() {
  emit('refresh');
}

// 处理点击推荐项
function handleClick(item: RecommendationItem) {
  // 使用整合的行为跟踪，会同时标记为已读
  trackClick({
    title: item.title,
    url: item.url,
    desc: item.desc,
    hot: item.hot
  }, item.source);
  
  // 增加更新触发器来强制视图更新
  updateTrigger.value++;
  
  // 向父组件通知点击事件
  emit('recordClick', item);
}

// 根据来源获取颜色
function getSourceColor(source: string): string {
  const colorMap: Record<string, string> = {
    'GitHub': '#2ea043',
    '掘金': '#1e80ff',
    '微博': '#e6162d',
    'IT之家': '#E74025',
    '少数派': '#D71718',
    'B站': '#FB7299'
  };
  
  return colorMap[source] || '#606266';
}
</script>

<style scoped>
.recommendation-card {
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
  background: #FFDA00;
  box-shadow: 0 0 8px rgba(255, 218, 0, 0.25);
  overflow: hidden;
}

:deep(.svg-icon svg) {
  width: 24px;
  height: 24px;
}

/* 移除对SVG填充色的覆盖，保持原始样式 */
:deep(.svg-icon svg path) {
  /* 不设置fill */
}

/* 深色模式下增加发光效果 */
:root.dark .logo {
  box-shadow: 0 0 12px rgba(255, 218, 0, 0.5);
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #FFDA00;
}

.subtitle {
  font-size: 12px;
  color: var(--muted-foreground);
}

.item-title.read-link {
  color: var(--muted-foreground, #909399) !important;
  opacity: 0.8;
}

.recommendation-list-wrapper {
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

.recommendation-list-inner {
  height: 100%;
  min-height: 290px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.recommendation-list {
  display: flex;
  flex-direction: column;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 5px;
  transition: all 0.2s;
  border-bottom: 1px dashed var(--border-color, rgba(48, 54, 61, 0.2));
}

.recommendation-item:last-child {
  border-bottom: none;
}

.recommendation-item:hover {
  background-color: var(--hover-bg, rgba(48, 54, 61, 0.2));
  transform: translateY(-2px);
}

.item-source {
  flex-shrink: 0;
  width: 50px;
}

.item-source .el-tag {
  font-size: 10px;
  padding: 0 4px;
  height: 18px;
  line-height: 18px;
  color: white;
  border: none;
}

.item-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.item-title {
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

.item-title:hover {
  color: #FF8A00;
  text-decoration: underline;
}

.item-reason {
  font-size: 11px;
  color: var(--muted-foreground);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty-recommendations {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 20px;
  text-align: center;
}

.empty-icon {
  margin-bottom: 12px;
}

.empty-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 4px;
}

.empty-subtext {
  font-size: 12px;
  color: var(--muted-foreground);
  margin-bottom: 16px;
}

/* 兴趣标签对话框样式 */
.interest-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.interest-tag {
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  transition: all 0.2s;
}

.interest-tag.selected {
  background-color: #FF8A00;
  color: white;
  border-color: #FF8A00;
}

/* 滚动条美化 */
.recommendation-list-wrapper::-webkit-scrollbar {
  width: 5px;
}

.recommendation-list-wrapper::-webkit-scrollbar-thumb {
  background: var(--scroll-thumb, rgba(120, 130, 140, 0.5));
  border-radius: var(--radius, 4px);
}

.recommendation-list-wrapper::-webkit-scrollbar-thumb:hover {
  background: var(--scroll-thumb-hover, rgba(130, 160, 190, 0.8));
}

@media (max-width: 768px) {
  .recommendation-card {
    max-width: 100%;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: transparent;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  color: #8c959f;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn:hover:not(:disabled) {
  background: rgba(255, 218, 0, 0.1);
  color: #FFDA00;
}

.action-btn:hover:not(:disabled) .action-icon {
  fill: #FFDA00;
}

.action-icon {
  width: 16px;
  height: 16px;
  fill: #8c959f;
  transition: all 0.2s ease;
}

.refresh-icon.rotating {
  animation: rotate 1s infinite linear;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.action-text {
  white-space: nowrap;
}
</style> 