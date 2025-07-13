<template>
  <div class="header-bar" :class="{ 'compact': isCompact }">
    <div class="header-left-placeholder">
      <div class="header-left" v-if="showLogo">
        <img src="/durian_logo.svg" alt="榴莲LOGO" class="logo" @click="navigateToHomepage" />
        <div class="site-info">
          <span class="site-title">榴莲热榜</span>
          <span class="site-desc">技术与资讯热榜聚合平台</span>
        </div>
      </div>
    </div>
    <div class="header-center">
      <NowTime />
    </div>
    <div class="header-right">
      <ThemeSwitch v-model:show-logo="showLogo" />
      <!-- TODO 暂时隐藏 打开的样式有问题 -->
      <!-- <el-tooltip
        content="设置兴趣偏好"
        placement="bottom"
        :effect="tooltipEffect"
      >
        <div class="action-btn" @click="showInterestSelector">
          <svg class="action-icon" viewBox="0 0 24 24" width="16" height="16">
            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/>
          </svg>
        </div>
      </el-tooltip> -->
      <!-- TODO 暂时隐藏 样式或者位置需要再调整-->
      <!-- <div class="product-switcher">
        <el-tooltip
          content="榴莲+"
          placement="bottom"
          :effect="tooltipEffect"
        >
          <el-dropdown trigger="click">
            <div class="product-dropdown">
              <div class="durian-menu-icon">
                <img src="/durian_logo.svg" alt="榴莲" class="mini-durian-logo" />
                <div class="dots">
                  <span class="dot"></span>
                  <span class="dot"></span>
                  <span class="dot"></span>
                </div>
              </div>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="product-menu">
                <el-dropdown-item>
                  <a href="https://xiuxian.durio.cc/" target="_blank" class="product-link">
                    <div class="product-item">
                      <img src="/durian_logo.svg" alt="榴莲修仙" class="product-logo" />
                      <span class="product-title">榴莲修仙</span>
                    </div>
                  </a>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>
      </div> -->
    </div>
    
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
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import NowTime from './NowTime.vue';
import ThemeSwitch from './ThemeSwitch.vue';
import { CaretBottom, Menu } from '@element-plus/icons-vue';
import { useThemeStore } from '@/store/theme';
import { ElButton, ElTag, ElDialog, ElMessage, ElTooltip, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus';
import { useUserBehavior } from '@/composables/useUserBehavior';

const showLogo = ref(true);
const isCompact = ref(false);
let lastScrollTop = 0;
const themeStore = useThemeStore();
const isDarkMode = computed(() => themeStore.isDark);
const tooltipEffect = computed(() => isDarkMode.value ? 'dark' : 'light');

const { getUserInterests } = useUserBehavior();

const interestDialogVisible = ref(false);
const selectedTags = ref<string[]>([]);

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

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > 50) {
    isCompact.value = true;
  } else {
    isCompact.value = false;
  }
  
  lastScrollTop = scrollTop;
};

onMounted(() => {
  const saved = localStorage.getItem('showLogo');
  if (saved !== null) {
    showLogo.value = saved === 'true';
  }
  
  window.addEventListener('scroll', handleScroll);
  
  loadSavedInterests();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

watch(showLogo, (val) => {
  localStorage.setItem('showLogo', String(val));
});

function showInterestSelector() {
  console.log('显示兴趣选择器');
  interestDialogVisible.value = true;
}

function toggleTag(tag: string) {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
  } else {
    selectedTags.value.splice(index, 1);
  }
}

function saveInterests() {
  try {
    localStorage.setItem('durian_user_interests', JSON.stringify(selectedTags.value));
    interestDialogVisible.value = false;
    ElMessage.success('兴趣设置已保存');
    window.dispatchEvent(new CustomEvent('refresh-recommendations'));
  } catch (error) {
    console.error('保存兴趣标签失败', error);
    ElMessage.error('保存失败，请重试');
  }
}

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

function navigateToHomepage() {
  window.open('https://durio.cc', '_blank');
}
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 36px 12px 36px;
  background: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background-color: rgba(249, 250, 252, 0.75);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: all var(--transition-duration) ease;
  height: auto;
  border-bottom: 1px solid rgba(230, 235, 243, 0.6);
}

.header-bar.compact {
  padding: 10px 36px 6px 36px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.header-bar.compact .site-title {
  font-size: 22px;
}

.header-bar.compact .site-desc {
  font-size: 12px;
}

.header-bar.compact .logo {
  width: 36px;
  height: 36px;
}

body[data-theme='dark'] .header-bar {
  background-color: rgba(34, 39, 46, 0.8);
  border-bottom: 1px solid rgba(48, 54, 61, 0.8);
}

.header-left-placeholder {
  min-width: 220px;
  height: 60px;
  display: flex;
  align-items: center;
  transition: all var(--transition-duration) ease;
}

.header-bar.compact .header-left-placeholder {
  height: 40px;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  width: 48px;
  height: 48px;
  margin-right: 16px;
  transition: all var(--transition-duration) ease;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.1));
  cursor: pointer; /* 添加鼠标指针样式 */
}

.site-info {
  display: flex;
  flex-direction: column;
}

.site-title {
  font-size: 28px;
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
  letter-spacing: 2px;
  font-family: 'ZCOOL KuaiLe', 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  transition: all var(--transition-duration) ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.site-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 2px;
  transition: all var(--transition-duration) ease;
  letter-spacing: 0.5px;
}

.product-switcher {
  margin-left: 14px;
  display: flex;
  align-items: center;
}

.product-dropdown {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s;
  padding: 6px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

body[data-theme='dark'] .product-dropdown {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.product-dropdown:hover {
  color: var(--primary-color);
  background-color: rgba(0, 0, 0, 0.08);
}

body[data-theme='dark'] .product-dropdown:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.durian-menu-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.mini-durian-logo {
  width: 20px;
  height: 20px;
}

.dots {
  display: flex;
  gap: 2px;
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--text-secondary);
}

.product-dropdown:hover .dot {
  background-color: var(--primary-color);
}

.menu-icon {
  font-size: 18px;
}

.product-menu {
  min-width: 150px;
  padding: 5px;
  border-radius: 8px;
}

body[data-theme='dark'] .el-dropdown-menu {
  background-color: #1e1e2d;
  border-color: #2d2d3a;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

body[data-theme='dark'] .el-dropdown-item:hover,
body[data-theme='dark'] .el-dropdown-item:focus {
  background-color: #3a3a4c;
}

body[data-theme='dark'] .el-dropdown-item.is-active {
  color: #55a7ff;
  background-color: #252533;
}

body[data-theme='dark'] .product-title {
  color: #ffffff;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

body[data-theme='dark'] .product-item span {
  color: #ffffff;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 8px 5px;
  gap: 8px;
}

.product-logo {
  width: 18px;
  height: 18px;
}

.product-item span {
  font-size: 14px;
  color: var(--text-color);
}

.product-link {
  color: inherit;
  text-decoration: none;
  display: block;
  width: 100%;
}

.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 1;
  transition: all var(--transition-duration) ease;
  padding: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

@media (max-width: 900px) {
  .header-bar {
    flex-direction: column;
    align-items: flex-start;
    padding: 18px 16px 8px 16px;
  }
  
  .header-bar.compact {
    padding: 8px 16px 4px 16px;
  }
  
  .header-center {
    position: static;
    left: auto;
    transform: none;
    margin: 12px 0;
    width: 100%;
    text-align: left;
  }
  
  .header-bar.compact .header-center {
    margin: 8px 0;
  }
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

body[data-theme='dark'] .action-btn {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.action-btn:hover {
  background-color: rgba(0, 0, 0, 0.08);
}

body[data-theme='dark'] .action-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.action-icon {
  fill: var(--text-secondary);
  transition: all 0.2s;
}

.action-btn:hover .action-icon {
  fill: var(--primary-color);
}

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
</style> 