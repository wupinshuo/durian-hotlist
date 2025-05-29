<template>
  <div class="home-page">
    <main class="main-content">
      <GithubTrendingCard :repos="githubRepos" @refresh="refreshGithub" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { GithubTrendingCard } from '@/components';

// GitHub 热门仓库数据
const githubRepos = ref([
  {
    name: 'microsoft/vscode',
    url: 'https://github.com/microsoft/vscode',
    description: 'Visual Studio Code 是微软开发的免费、开源的代码编辑器',
    stars: '157k',
    language: 'TypeScript',
    forks: '28.5k',
    starsThisWeek: '328'
  },
  {
    name: 'facebook/react',
    url: 'https://github.com/facebook/react',
    description: 'React 是用于构建用户界面的 JavaScript 库',
    stars: '216k',
    language: 'JavaScript',
    forks: '45.7k',
    starsThisWeek: '512'
  },
  {
    name: 'flutter/flutter',
    url: 'https://github.com/flutter/flutter',
    description: 'Flutter 是谷歌的移动应用 SDK，用于创建高质量的跨平台应用',
    stars: '158k',
    language: 'Dart',
    forks: '25.3k',
    starsThisWeek: '421'
  },
  {
    name: 'vuejs/vue',
    url: 'https://github.com/vuejs/vue',
    description: 'Vue.js 是一个用于构建交互式界面的 JavaScript 框架',
    stars: '208k',
    language: 'JavaScript',
    forks: '34.2k',
    starsThisWeek: '289'
  },
  {
    name: 'rust-lang/rust',
    url: 'https://github.com/rust-lang/rust',
    description: 'Rust 是一种系统编程语言，注重安全性、并发性和性能',
    stars: '87k',
    language: 'Rust',
    forks: '11.8k',
    starsThisWeek: '367'
  }
]);

const refreshGithub = () => {
  console.log('Refreshing GitHub trending data...');
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f8fa;
}

.main-content {
  flex: 1;
  padding: 20px 0;
}
</style> 