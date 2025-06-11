<template>
  <div class="recommendation-card">
    <div class="card-header">
      <div class="header-left">
        <div class="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#paint0_linear)" />
            <defs>
              <linearGradient id="paint0_linear" x1="2" y1="2" x2="22" y2="21.02" gradientUnits="userSpaceOnUse">
                <stop stop-color="#FF8A00" />
                <stop offset="1" stop-color="#FF4578" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <div class="title">猜你喜欢</div>
          <div class="subtitle">个性化推荐</div>
        </div>
      </div>
      
      <div class="header-right">
        <el-button 
          size="small" 
          @click="showInterestSelector" 
          text
        >
          设置兴趣
        </el-button>
        <el-button 
          v-if="recommendations.length > 0" 
          size="small" 
          @click="refreshRecommendations"
          :loading="loading"
          text
        >
          刷新推荐
        </el-button>
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
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#e0e0e0" />
              </svg>
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
  background: linear-gradient(135deg, #FF8A00, #FF4578);
  box-shadow: 0 0 8px rgba(255, 138, 0, 0.25);
}

.logo svg {
  width: 22px;
  height: 22px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

/* 深色模式下增加发光效果 */
:root.dark .logo {
  box-shadow: 0 0 12px rgba(255, 138, 0, 0.5);
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #FF8A00;
}

.subtitle {
  font-size: 12px;
  color: var(--muted-foreground);
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
</style> 