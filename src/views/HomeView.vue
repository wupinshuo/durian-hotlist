<template>
  <div class="home-container">
    <div class="hot-list-section">
      <GithubTrendingCard 
        :repos="githubTrending"
        :loading="githubLoading"
        :updateTime="githubUpdateTime"
        @refresh="refreshGithubTrending" 
        @periodChange="handleGithubPeriodChange"
      />
      <JuejinHotArticleCard
        :articles="juejinArticles"
        :loading="juejinLoading"
        :updateTime="juejinUpdateTime"
        @refresh="refreshJuejinHotArticle"
      />
      <WeiboHotListCard
        :hotTopics="weiboHotList"
        :loading="weiboLoading"
        :updateTime="weiboUpdateTime"
        @refresh="refreshWeiboHotList"
      />
      <BilibiliHotListCard
        :hotTopics="bilibiliHotList"
        :loading="bilibiliLoading"
        :updateTime="bilibiliUpdateTime"
        @refresh="refreshBilibiliHotList"
      />
      <IthomeHotListCard
        :hotTopics="ithomeHotList"
        :loading="ithomeLoading"
        :updateTime="ithomeUpdateTime"
        @refresh="refreshIthomeHotList"
      />
      <SspaiHotListCard
        :hotTopics="sspaiHotList"
        :loading="sspaiLoading"
        :updateTime="sspaiUpdateTime"
        @refresh="refreshSspaiHotList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import GithubTrendingCard from '@/components/GithubTrendingCard.vue'
import JuejinHotArticleCard from '@/components/JuejinHotArticleCard.vue'
import WeiboHotListCard from '@/components/WeiboHotListCard.vue'
import IthomeHotListCard from '@/components/IthomeHotListCard.vue'
import SspaiHotListCard from '@/components/SspaiHotListCard.vue'
import BilibiliHotListCard from '@/components/BilibiliHotListCard.vue'
import { ref, onMounted } from 'vue'
import { getHotListByType } from '@/api/hotlist'
import { ElMessage } from 'element-plus'
import { GithubHostItem, GithubHostList, HotItem, HotList } from '@/types/hot'
import { GithubPeriod, GITHUB_PERIOD } from '@/constants/hotlist'

const githubTrending = ref<GithubHostItem[]>([])
const juejinArticles = ref<HotItem[]>([])
const weiboHotList = ref<HotItem[]>([])
const ithomeHotList = ref<HotItem[]>([])
const sspaiHotList = ref<HotItem[]>([])
const bilibiliHotList = ref<HotItem[]>([])
const githubLoading = ref(true)
const juejinLoading = ref(true)
const weiboLoading = ref(true)
const ithomeLoading = ref(true)
const sspaiLoading = ref(true)
const bilibiliLoading = ref(true)
const githubUpdateTime = ref(0)
const juejinUpdateTime = ref(0)
const weiboUpdateTime = ref(0)
const ithomeUpdateTime = ref(0)
const sspaiUpdateTime = ref(0)
const bilibiliUpdateTime = ref(0)
const githubPeriod = ref<GithubPeriod>(GITHUB_PERIOD.WEEKLY)

onMounted(() => {
  // 热榜数据并行加载，互不影响
  loadGithubTrending()
  loadJuejinHotArticles()
  loadWeiboHotList()
  loadIthomeHotList()
  loadSspaiHotList()
  loadBilibiliHotList()
})

// 加载GitHub热榜数据
const loadGithubTrending = async (period: GithubPeriod = githubPeriod.value) => {
  githubLoading.value = true
  try {
    const githubData = await getHotListByType('github', period) as GithubHostList
    githubTrending.value = githubData.list
    githubUpdateTime.value = githubData.updateTime
  } catch (error) {
    console.error('加载 GitHub 热榜数据失败', error)
    ElMessage.error('加载 GitHub 热榜数据失败，请稍后刷新')
  } finally {
    githubLoading.value = false
  }
}

// 加载掘金热点文章
const loadJuejinHotArticles = async () => {
  juejinLoading.value = true
  try {
    const juejinData = await getHotListByType('juejin') as HotList
    juejinArticles.value = juejinData.list
    juejinUpdateTime.value = juejinData.updateTime
  } catch (error) {
    console.error('加载掘金热点文章失败', error)
    ElMessage.error('加载掘金热点文章失败，请稍后刷新')
  } finally {
    juejinLoading.value = false
  }
}

// 加载微博热榜数据
const loadWeiboHotList = async () => {
  weiboLoading.value = true
  try {
    const weiboData = await getHotListByType('weibo') as HotList
    weiboHotList.value = weiboData.list
    weiboUpdateTime.value = weiboData.updateTime
  } catch (error) {
    console.error('加载微博热榜数据失败', error)
    ElMessage.error('加载微博热榜数据失败，请稍后刷新')
  } finally {
    weiboLoading.value = false
  }
}

// 加载IT之家热榜数据
const loadIthomeHotList = async () => {
  ithomeLoading.value = true
  try {
    const ithomeData = await getHotListByType('ithome', 'weekly') as HotList
    ithomeHotList.value = ithomeData.list
    ithomeUpdateTime.value = ithomeData.updateTime
  } catch (error) {
    console.error('加载IT之家热榜数据失败', error)
    ElMessage.error('加载IT之家热榜数据失败，请稍后刷新')
  } finally {
    ithomeLoading.value = false
  }
}

// 加载少数派热榜数据
const loadSspaiHotList = async () => {
  sspaiLoading.value = true
  try {
    const sspaiData = await getHotListByType('sspai', 'weekly') as HotList
    sspaiHotList.value = sspaiData.list
    sspaiUpdateTime.value = sspaiData.updateTime
  } catch (error) {
    console.error('加载少数派热榜数据失败', error)
    ElMessage.error('加载少数派热榜数据失败，请稍后刷新')
  } finally {
    sspaiLoading.value = false
  }
}

// 加载B站热榜数据
const loadBilibiliHotList = async () => {
  bilibiliLoading.value = true
  try {
    const bilibiliData = await getHotListByType('bilibili', 'weekly') as HotList
    bilibiliHotList.value = bilibiliData.list
    bilibiliUpdateTime.value = bilibiliData.updateTime
  } catch (error) {
    console.error('加载B站热榜数据失败', error)
    ElMessage.error('加载B站热榜数据失败，请稍后刷新')
  } finally {
    bilibiliLoading.value = false
  }
}

// 处理GitHub热榜时间范围变化
const handleGithubPeriodChange = (period: GithubPeriod) => {
  githubPeriod.value = period
  loadGithubTrending(period)
}

// 刷新 GitHub 热榜
const refreshGithubTrending = async (period: GithubPeriod = githubPeriod.value) => {
  try {
    githubLoading.value = true
    ElMessage.info('正在刷新 GitHub 热榜...')
    const githubData = await getHotListByType('github', period) as GithubHostList
    githubTrending.value = githubData.list
    githubUpdateTime.value = githubData.updateTime
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
    const juejinData = await getHotListByType('juejin') as HotList
    juejinArticles.value = juejinData.list
    juejinUpdateTime.value = juejinData.updateTime
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
    const weiboData = await getHotListByType('weibo') as HotList
    weiboHotList.value = weiboData.list
    weiboUpdateTime.value = weiboData.updateTime
    ElMessage.success('微博热榜已更新')
  } catch (error) {
    console.error('刷新微博热榜失败', error)
    ElMessage.error('刷新失败，请稍后再试')
  } finally {
    weiboLoading.value = false
  }
}

// 刷新IT之家热榜
const refreshIthomeHotList = async () => {
  try {
    ithomeLoading.value = true
    ElMessage.info('正在刷新IT之家热榜...')
    const ithomeData = await getHotListByType('ithome', 'weekly', true) as HotList
    ithomeHotList.value = ithomeData.list
    ithomeUpdateTime.value = ithomeData.updateTime
    ElMessage.success('IT之家热榜已更新')
  } catch (error) {
    console.error('刷新IT之家热榜失败', error)
    ElMessage.error('刷新失败，请稍后再试')
  } finally {
    ithomeLoading.value = false
  }
}

// 刷新少数派热榜
const refreshSspaiHotList = async () => {
  try {
    sspaiLoading.value = true
    ElMessage.info('正在刷新少数派热榜...')
    const sspaiData = await getHotListByType('sspai', 'weekly', true) as HotList
    sspaiHotList.value = sspaiData.list
    sspaiUpdateTime.value = sspaiData.updateTime
    ElMessage.success('少数派热榜已更新')
  } catch (error) {
    console.error('刷新少数派热榜失败', error)
    ElMessage.error('刷新失败，请稍后再试')
  } finally {
    sspaiLoading.value = false
  }
}

// 刷新B站热榜
const refreshBilibiliHotList = async () => {
  try {
    bilibiliLoading.value = true
    ElMessage.info('正在刷新B站热榜...')
    const bilibiliData = await getHotListByType('bilibili', 'weekly', true) as HotList
    bilibiliHotList.value = bilibiliData.list
    bilibiliUpdateTime.value = bilibiliData.updateTime
    ElMessage.success('B站热榜已更新')
  } catch (error) {
    console.error('刷新B站热榜失败', error)
    ElMessage.error('刷新失败，请稍后再试')
  } finally {
    bilibiliLoading.value = false
  }
}
</script>

<style scoped>
.home-container { 
  padding: 120px 0 48px 0; 
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

@media (max-width: 900px) {
  .home-container {
    padding-top: 150px; /* 为移动端折叠后的顶部导航提供更多空间 */
  }
}

@media (max-width: 768px) {
  .hot-list-section {
    flex-direction: column;
    align-items: center;
  }
}
</style> 