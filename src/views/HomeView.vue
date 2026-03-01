<template>
  <div class="home-container">
    <div class="hot-list-section">
      <RecommendationCard
        :recommendations="recommendations"
        :loading="recommendationsLoading"
        @refresh="refreshRecommendations"
        @recordClick="handleRecommendationClick"
      />
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
      <ZhihuHotListCard
        :hotTopics="zhihuHotList"
        :loading="zhihuLoading"
        :updateTime="zhihuUpdateTime"
        @refresh="refreshZhihuHotList"
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
      <HupuHotListCard
        :hotTopics="hupuHotList"
        :loading="hupuLoading"
        :updateTime="hupuUpdateTime"
        @refresh="refreshHupuHotList"
      />
      <!-- 暂时屏蔽36氪
      <Kr36HotListCard
        :hotTopics="kr36HotList"
        :loading="kr36Loading"
        :updateTime="kr36UpdateTime"
        @refresh="refreshKr36HotList"
      />
      -->
      <V2exHotListCard
        :hotTopics="v2exHotList"
        :loading="v2exLoading"
        :updateTime="v2exUpdateTime"
        @refresh="refreshV2exHotList"
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
import ZhihuHotListCard from '@/components/ZhihuHotListCard.vue'
import HupuHotListCard from '@/components/HupuHotListCard.vue'
// import Kr36HotListCard from '@/components/Kr36HotListCard.vue' // 暂时屏蔽36氪
import V2exHotListCard from '@/components/V2exHotListCard.vue'
import RecommendationCard from '@/components/RecommendationCard.vue'
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { getHotListByType } from '@/api/hotlist'
import { ElMessage } from 'element-plus'
import { GithubHostItem, GithubHostList, HotItem, HotList } from '@/types/hot'
import { GithubPeriod, GITHUB_PERIOD } from '@/constants/hotlist'
import { useRecommendationEngine } from '@/composables/useRecommendationEngine'
import { useUserBehavior } from '@/composables/useUserBehavior'

const githubTrending = ref<GithubHostItem[]>([])
const juejinArticles = ref<HotItem[]>([])
const weiboHotList = ref<HotItem[]>([])
const ithomeHotList = ref<HotItem[]>([])
const sspaiHotList = ref<HotItem[]>([])
const bilibiliHotList = ref<HotItem[]>([])
const zhihuHotList = ref<HotItem[]>([])
const hupuHotList = ref<HotItem[]>([])
// const kr36HotList = ref<HotItem[]>([]) // 暂时屏蔽36氪
const v2exHotList = ref<HotItem[]>([])
const githubLoading = ref(true)
const juejinLoading = ref(true)
const weiboLoading = ref(true)
const ithomeLoading = ref(true)
const sspaiLoading = ref(true)
const bilibiliLoading = ref(true)
const zhihuLoading = ref(true)
const hupuLoading = ref(true)
// const kr36Loading = ref(true) // 暂时屏蔽36氪
const v2exLoading = ref(true)
const githubUpdateTime = ref(0)
const juejinUpdateTime = ref(0)
const weiboUpdateTime = ref(0)
const ithomeUpdateTime = ref(0)
const sspaiUpdateTime = ref(0)
const bilibiliUpdateTime = ref(0)
const zhihuUpdateTime = ref(0)
const hupuUpdateTime = ref(0)
// const kr36UpdateTime = ref(0) // 暂时屏蔽36氪
const v2exUpdateTime = ref(0)
const githubPeriod = ref<GithubPeriod>(GITHUB_PERIOD.WEEKLY)

// 推荐引擎
const { recommendations, loading: recommendationsLoading, generateRecommendations: generateEngineRecommendations } = useRecommendationEngine()

// 用户行为收集
const userBehavior = useUserBehavior()

// 监听所有热榜数据变化，更新推荐
watch([githubTrending, juejinArticles, weiboHotList, ithomeHotList, sspaiHotList, bilibiliHotList, zhihuHotList, hupuHotList, /* kr36HotList, */ v2exHotList], () => {
  generateRecommendations()
}, { deep: true })

onMounted(() => {
  // 热榜数据并行加载，互不影响
  loadGithubTrending()
  loadJuejinHotArticles()
  loadWeiboHotList()
  loadIthomeHotList()
  loadSspaiHotList()
  loadBilibiliHotList()
  loadZhihuHotList()
  loadHupuHotList()
  // loadKr36HotList() // 暂时屏蔽36氪
  loadV2exHotList()
  
  // 监听来自HeaderBar的刷新推荐事件
  window.addEventListener('refresh-recommendations', refreshRecommendations)
})

// 组件卸载时移除事件监听
onBeforeUnmount(() => {
  window.removeEventListener('refresh-recommendations', refreshRecommendations)
})

// 生成推荐内容
const generateRecommendations = () => {
  generateEngineRecommendations(
    githubTrending.value,
    juejinArticles.value,
    weiboHotList.value,
    ithomeHotList.value,
    sspaiHotList.value,
    bilibiliHotList.value,
    zhihuHotList.value,
    hupuHotList.value,
    [], // kr36HotList.value, // 暂时屏蔽36氪
    v2exHotList.value
  )
}

// 处理推荐项点击
const handleRecommendationClick = (item: any) => {
  console.log('推荐项被点击:', item.title);
}

// 刷新推荐内容
const refreshRecommendations = async () => {
  try {
    recommendationsLoading.value = true
    ElMessage.info('正在刷新推荐内容...')
    
    // 随机等待一小段时间，模拟网络请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 重新生成推荐内容
    generateRecommendations()
    
    ElMessage.success('推荐内容已更新')
  } catch (error) {
    console.error('刷新推荐内容失败', error)
    ElMessage.error('刷新失败，请稍后再试')
  } finally {
    recommendationsLoading.value = false
  }
}

// 加载GitHub热榜数据
const loadGithubTrending = async (period: GithubPeriod = githubPeriod.value) => {
  githubLoading.value = true
  try {
    const githubData = await getHotListByType('github', period) as GithubHostList
    if(githubData.list.length === 0) {
      console.error('GitHub热榜数据为空', githubData)
      return;
    }
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
    if(juejinData.list.length === 0) {
      console.error('掘金热点文章数据为空', juejinData)
      return;
    }
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
    if(weiboData.list.length === 0) {
      console.error('微博热榜数据为空', weiboData)
      return;
    }
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
    if(ithomeData.list.length === 0) {
      console.error('IT之家热榜数据为空', ithomeData)
      return;
    }
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
    if(sspaiData.list.length === 0) {
      console.error('少数派热榜数据为空', sspaiData)
      return;
    }
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
    if(bilibiliData.list.length === 0) {
      console.error('B站热榜数据为空', bilibiliData)
      return;
    }
    bilibiliHotList.value = bilibiliData.list
    bilibiliUpdateTime.value = bilibiliData.updateTime
  } catch (error) {
    console.error('加载B站热榜数据失败', error)
    ElMessage.error('加载B站热榜数据失败，请稍后刷新')
  } finally {
    bilibiliLoading.value = false
  }
}

// 加载知乎热榜数据
const loadZhihuHotList = async () => {
  zhihuLoading.value = true
  try {
    const zhihuData = await getHotListByType('zhihu') as HotList
    if(zhihuData.list.length === 0) {
      console.error('知乎热榜数据为空', zhihuData)
      return;
    }
    zhihuHotList.value = zhihuData.list
    zhihuUpdateTime.value = zhihuData.updateTime
  } catch (error) {
    console.error('加载知乎热榜数据失败', error)
    ElMessage.error('加载知乎热榜数据失败，请稍后刷新')
  } finally {
    zhihuLoading.value = false
  }
}

// 加载虎扑热榜数据
const loadHupuHotList = async () => {
  hupuLoading.value = true
  try {
    const hupuData = await getHotListByType('hupu') as HotList
    if(hupuData.list.length === 0) {
      console.error('虎扑热榜数据为空', hupuData)
      return;
    }
    hupuHotList.value = hupuData.list
    hupuUpdateTime.value = hupuData.updateTime
  } catch (error) {
    console.error('加载虎扑热榜数据失败', error)
    ElMessage.error('加载虎扑热榜数据失败，请稍后刷新')
  } finally {
    hupuLoading.value = false
  }
}

// 暂时屏蔽36氪
/*
// 加载36氪热榜数据
const loadKr36HotList = async () => {
  kr36Loading.value = true
  try {
    const kr36Data = await getHotListByType('36kr') as HotList
    if(kr36Data.list.length === 0) {
      console.error('36氪热榜数据为空', kr36Data)
      return;
    }
    kr36HotList.value = kr36Data.list
    kr36UpdateTime.value = kr36Data.updateTime
  } catch (error) {
    console.error('加载36氪热榜数据失败', error)
    ElMessage.error('加载36氪热榜数据失败，请稍后刷新')
  } finally {
    kr36Loading.value = false
  }
}
*/

// 加载V2EX热榜数据
const loadV2exHotList = async () => {
  v2exLoading.value = true
  try {
    const v2exData = await getHotListByType('v2ex') as HotList
    if(v2exData.list.length === 0) {
      console.error('V2EX热榜数据为空', v2exData)
      return;
    }
    v2exHotList.value = v2exData.list
    v2exUpdateTime.value = v2exData.updateTime
  } catch (error) {
    console.error('加载V2EX热榜数据失败', error)
    ElMessage.error('加载V2EX热榜数据失败，请稍后刷新')
  } finally {
    v2exLoading.value = false
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
    const githubData = await getHotListByType('github', period, true) as GithubHostList
    if(githubData.list.length === 0) {
      console.error('GitHub热榜数据为空', githubData)
      return;
    }
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
    const juejinData = await getHotListByType('juejin', undefined, true) as HotList
    if(juejinData.list.length === 0) {
      console.error('掘金热点文章数据为空', juejinData)
      return;
    }
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
    const weiboData = await getHotListByType('weibo', undefined, true) as HotList
    if(weiboData.list.length === 0) {
      console.error('微博热榜数据为空', weiboData)
      return;
    }
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
    if(ithomeData.list.length === 0) {
      console.error('IT之家热榜数据为空', ithomeData)
      return;
    }
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
    if(sspaiData.list.length === 0) {
      console.error('少数派热榜数据为空', sspaiData)
      return;
    }
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
    if(bilibiliData.list.length === 0) {
      console.error('B站热榜数据为空', bilibiliData)
      return;
    }
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

// 刷新知乎热榜
const refreshZhihuHotList = async () => {
  try {
    zhihuLoading.value = true
    ElMessage.info('正在刷新知乎热榜...')
    const zhihuData = await getHotListByType('zhihu', undefined, true) as HotList
    if(zhihuData.list.length === 0) {
      console.error('知乎热榜数据为空', zhihuData)
      return;
    }
    zhihuHotList.value = zhihuData.list
    zhihuUpdateTime.value = zhihuData.updateTime
    ElMessage.success('知乎热榜已更新')
  } catch (error) {
    console.error('刷新知乎热榜失败', error)
    ElMessage.error('刷新失败，请稍后再试')
  } finally {
    zhihuLoading.value = false
  }
}

// 刷新虎扑热榜
const refreshHupuHotList = async () => {
  try {
    hupuLoading.value = true
    ElMessage.info('正在刷新虎扑热榜...')
    const hupuData = await getHotListByType('hupu', undefined, true) as HotList
    if(hupuData.list.length === 0) {
      console.error('虎扑热榜数据为空', hupuData)
      return;
    }
    hupuHotList.value = hupuData.list
    hupuUpdateTime.value = hupuData.updateTime
    ElMessage.success('虎扑热榜已更新')
  } catch (error) {
    console.error('刷新虎扑热榜失败', error)
    ElMessage.error('刷新失败，请稍后再试')
  } finally {
    hupuLoading.value = false
  }
}

// 暂时屏蔽36氪
/*
// 刷新36氪热榜
const refreshKr36HotList = async () => {
  try {
    kr36Loading.value = true
    ElMessage.info('正在刷新36氪热榜...')
    const kr36Data = await getHotListByType('36kr', undefined, true) as HotList
    if(kr36Data.list.length === 0) {
      console.error('36氪热榜数据为空', kr36Data)
      return;
    }
    kr36HotList.value = kr36Data.list
    kr36UpdateTime.value = kr36Data.updateTime
    ElMessage.success('36氪热榜已更新')
  } catch (error) {
    console.error('刷新36氪热榜失败', error)
    ElMessage.error('刷新失败，请稍后再试')
  } finally {
    kr36Loading.value = false
  }
}
*/

// 刷新V2EX热榜
const refreshV2exHotList = async () => {
  try {
    v2exLoading.value = true
    ElMessage.info('正在刷新V2EX热榜...')
    const v2exData = await getHotListByType('v2ex', undefined, true) as HotList
    if(v2exData.list.length === 0) {
      console.error('V2EX热榜数据为空', v2exData)
      return;
    }
    v2exHotList.value = v2exData.list
    v2exUpdateTime.value = v2exData.updateTime
    ElMessage.success('V2EX热榜已更新')
  } catch (error) {
    console.error('刷新V2EX热榜失败', error)
    ElMessage.error('刷新失败，请稍后再试')
  } finally {
    v2exLoading.value = false
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