<template>
  <el-button @click="themeStore.toggleTheme" circle class="header-btn">
    <el-icon :size="20"><component :is="themeStore.isDark ? Sunny : Moon" /></el-icon>
  </el-button>
  <el-switch
    v-model="localShowLogo"
    active-text="开摸"
    inactive-text="沉淀"
    inline-prompt
    style="margin-left: 10px;"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useThemeStore } from '../store/theme';
import { Moon, Sunny } from '@element-plus/icons-vue';

const props = defineProps<{ showLogo: boolean }>();
const emit = defineEmits(['update:showLogo']);

const localShowLogo = ref(props.showLogo);

// 更新标题的函数
const updateDocumentTitle = (isSedimentationMode: boolean) => {
  document.title = isSedimentationMode ? '榴莲热榜' : '学习网站';
};

// 初始化时设置标题
updateDocumentTitle(localShowLogo.value);

watch(() => props.showLogo, val => {
  localShowLogo.value = val;
  updateDocumentTitle(val);
});
watch(localShowLogo, val => {
  emit('update:showLogo', val);
  updateDocumentTitle(val);
});

const themeStore = useThemeStore();
</script>

<style scoped>
.header-btn {
  background: none;
  border: none;
  box-shadow: none;
}
.header-btn:hover {
  background: #f0f7ff;
}
</style> 