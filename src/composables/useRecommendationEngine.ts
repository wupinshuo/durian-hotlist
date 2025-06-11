import { ref, Ref } from 'vue';
import { HotItem, GithubHostItem } from '@/types/hot';
import { useUserBehavior } from './useUserBehavior';

// 推荐项接口
export interface RecommendationItem {
  title: string; // 标题
  desc: string; // 描述
  url: string; // 链接
  hot: string; // 热度
  score: number; // 推荐分数
  source: string; // 来源平台
  reason: string; // 推荐理由
  matchedTags: string[]; // 匹配的标签
  author?: string; // 可选：作者
  tag?: string; // 可选：标签
}

/**
 * 推荐引擎Hook
 */
export function useRecommendationEngine() {
  const recommendations: Ref<RecommendationItem[]> = ref([]);
  const loading = ref(false);
  const userBehavior = useUserBehavior();

  /**
   * 计算项目与用户兴趣的匹配分数
   */
  const calculateMatchScore = (
    itemTitle: string,
    userInterests: string[],
  ): number => {
    // 如果没有关键词或兴趣，返回低分
    if (!userInterests.length) return 0.1;

    // 从标题中提取关键词
    const titleLower = itemTitle.toLowerCase();
    let matchCount = 0;

    // 计算匹配的关键词数量
    userInterests.forEach((interest) => {
      const interestLower = interest.toLowerCase();
      if (titleLower.includes(interestLower)) {
        matchCount++;
      }
    });

    // 基础分数 + 匹配关键词加分
    return 0.1 + matchCount * 0.3;
  };

  /**
   * 根据热榜内容生成推荐
   */
  const generateRecommendations = (
    githubItems: GithubHostItem[] = [],
    juejinItems: HotItem[] = [],
    weiboItems: HotItem[] = [],
    ithomeItems: HotItem[] = [],
    sspaiItems: HotItem[] = [],
    bilibiliItems: HotItem[] = [],
  ) => {
    loading.value = true;

    try {
      // 获取用户兴趣标签
      const userInterests = userBehavior.getUserInterests();

      // 创建候选推荐项
      const candidates: RecommendationItem[] = [];

      // 处理GitHub项目
      githubItems.forEach((item) => {
        const score = calculateMatchScore(item.name, userInterests);
        const matchedTags = userInterests.filter(
          (tag) =>
            item.name.toLowerCase().includes(tag.toLowerCase()) ||
            (item.desc && item.desc.toLowerCase().includes(tag.toLowerCase())),
        );

        candidates.push({
          title: item.name,
          desc: item.desc || '',
          url: item.url,
          hot: item.stars,
          score,
          source: 'GitHub',
          reason: matchedTags.length
            ? `匹配"${matchedTags.join('、')}"`
            : '热门开源项目',
          matchedTags,
        });
      });

      // 处理掘金文章
      juejinItems.forEach((item) => {
        const score = calculateMatchScore(item.title, userInterests);
        const matchedTags = userInterests.filter(
          (tag) =>
            item.title.toLowerCase().includes(tag.toLowerCase()) ||
            (item.desc && item.desc.toLowerCase().includes(tag.toLowerCase())),
        );

        candidates.push({
          ...item,
          score,
          source: '掘金',
          reason: matchedTags.length
            ? `匹配"${matchedTags.join('、')}"`
            : '技术热文',
          matchedTags,
        });
      });

      // 处理微博热榜
      weiboItems.forEach((item) => {
        const score = calculateMatchScore(item.title, userInterests);
        const matchedTags = userInterests.filter((tag) =>
          item.title.toLowerCase().includes(tag.toLowerCase()),
        );

        candidates.push({
          ...item,
          score,
          source: '微博',
          reason: matchedTags.length
            ? `匹配"${matchedTags.join('、')}"`
            : '热门话题',
          matchedTags,
        });
      });

      // 处理IT之家
      ithomeItems.forEach((item) => {
        const score = calculateMatchScore(item.title, userInterests);
        const matchedTags = userInterests.filter((tag) =>
          item.title.toLowerCase().includes(tag.toLowerCase()),
        );

        candidates.push({
          ...item,
          score,
          source: 'IT之家',
          reason: matchedTags.length
            ? `匹配"${matchedTags.join('、')}"`
            : '科技资讯',
          matchedTags,
        });
      });

      // 处理少数派
      sspaiItems.forEach((item) => {
        const score = calculateMatchScore(item.title, userInterests);
        const matchedTags = userInterests.filter((tag) =>
          item.title.toLowerCase().includes(tag.toLowerCase()),
        );

        candidates.push({
          ...item,
          score,
          source: '少数派',
          reason: matchedTags.length
            ? `匹配"${matchedTags.join('、')}"`
            : '科技生活',
          matchedTags,
        });
      });

      // 处理B站热榜
      bilibiliItems.forEach((item) => {
        const score = calculateMatchScore(item.title, userInterests);
        const matchedTags = userInterests.filter((tag) =>
          item.title.toLowerCase().includes(tag.toLowerCase()),
        );

        candidates.push({
          ...item,
          score,
          source: 'B站',
          reason: matchedTags.length
            ? `匹配"${matchedTags.join('、')}"`
            : '热门视频',
          matchedTags,
        });
      });

      // 按分数排序
      candidates.sort((a, b) => b.score - a.score);

      // 保证多样性：从不同来源选取内容
      const topRecommendations: RecommendationItem[] = [];
      const sourceCounts: Record<string, number> = {};
      const MAX_PER_SOURCE = 3; // 每个来源最多3个
      const MAX_RECOMMENDATIONS = 12; // 总共最多12个推荐

      for (const item of candidates) {
        const source = item.source;
        sourceCounts[source] = sourceCounts[source] || 0;

        if (sourceCounts[source] < MAX_PER_SOURCE) {
          topRecommendations.push(item);
          sourceCounts[source]++;
        }

        if (topRecommendations.length >= MAX_RECOMMENDATIONS) break;
      }

      // 更新推荐列表
      recommendations.value = topRecommendations;
    } catch (error) {
      console.error('生成推荐失败:', error);
    } finally {
      loading.value = false;
    }
  };

  return {
    recommendations,
    loading,
    generateRecommendations,
  };
}
