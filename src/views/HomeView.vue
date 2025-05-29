<template>
  <div class="home-container">
    <div class="hot-list-section">
      <GithubTrendingCard 
        :repos="githubTrending"
        :loading="githubLoading"
        @refresh="refreshGithubTrending" 
      />
      <JuejinHotArticleCard
        :articles="juejinArticles"
        :loading="juejinLoading"
        @refresh="refreshJuejinHotArticle"
      />
      <WeiboHotListCard
        :hotTopics="weiboHotList"
        :loading="weiboLoading"
        @refresh="refreshWeiboHotList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import GithubTrendingCard from '@/components/GithubTrendingCard.vue'
import JuejinHotArticleCard from '@/components/JuejinHotArticleCard.vue'
import WeiboHotListCard from '@/components/WeiboHotListCard.vue'
import { ref, onMounted } from 'vue'
import { getGithubTrending, getJuejinHotArticle, getWeiboHotList } from '@/api/hotlist'
import { ElMessage } from 'element-plus'

const githubTrending = ref([])
const juejinArticles = ref([])
const weiboHotList = ref([])
const githubLoading = ref(true)
const juejinLoading = ref(true)
const weiboLoading = ref(true)

onMounted(async () => {
  githubLoading.value = true
  juejinLoading.value = true
  weiboLoading.value = true
  try {
    githubTrending.value = await getGithubTrending()
  } catch (error) {
    console.error('加载 GitHub 热榜数据失败', error)
    ElMessage.error('加载 GitHub 热榜数据失败，请稍后刷新')
  } finally {
    githubLoading.value = false
  }
  try {
    juejinArticles.value = await getJuejinHotArticle()
  } catch (error) {
    console.error('加载掘金热点文章失败', error)
    ElMessage.error('加载掘金热点文章失败，请稍后刷新')
  } finally {
    juejinLoading.value = false
  }
  try {
    weiboHotList.value = await getWeiboHotList()
  } catch (error) {
    console.error('加载微博热榜数据失败', error)
    ElMessage.error('加载微博热榜数据失败，请稍后刷新')
  } finally {
    weiboLoading.value = false
  }
})

// 刷新 GitHub 热榜
const refreshGithubTrending = async () => {
  try {
    githubLoading.value = true
    ElMessage.info('正在刷新 GitHub 热榜...')
    githubTrending.value = await getGithubTrending()
    ElMessage.success('GitHub 热榜已更新')
  } catch (error) {
    console.error('刷新 GitHub 热榜失败', error)
    ElMessage.error('刷新失败，请稍后再试')
  } finally {
    githubLoading.value = false
  }
}

// 刷新掘金热点文章
const refreshJuejinHotArticle = async () => {
  try {
    juejinLoading.value = true
    ElMessage.info('正在刷新掘金热点文章...')
    juejinArticles.value = await getJuejinHotArticle()
    ElMessage.success('掘金热点文章已更新')
  } catch (error) {
    console.error('刷新掘金热点文章失败', error)
    ElMessage.error('刷新失败，请稍后再试')
  } finally {
    juejinLoading.value = false
  }
}

// 刷新微博热榜
const refreshWeiboHotList = async () => {
  try {
    weiboLoading.value = true
    ElMessage.info('正在刷新微博热榜...')
    weiboHotList.value = await getWeiboHotList()
    ElMessage.success('微博热榜已更新')
  } catch (error) {
    console.error('刷新微博热榜失败', error)
    ElMessage.error('刷新失败，请稍后再试')
  } finally {
    weiboLoading.value = false
  }
}
</script>

<style scoped>
.home-container { 
  padding: 48px 0; 
  display: flex; 
  justify-content: center; 
}
.hot-list-section { 
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center; 
  max-width: 1480px;
  width: 100%;
  align-items: stretch; /* 保证卡片等高对齐 */
  padding: 0 10px;
  box-sizing: border-box;
}

@media (max-width: 1500px) {
  .hot-list-section {
    justify-content: center;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .hot-list-section {
    flex-direction: column;
    align-items: center;
  }
}
</style> 