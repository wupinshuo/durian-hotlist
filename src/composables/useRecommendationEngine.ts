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
    zhihuItems: HotItem[] = [],
  ) => {
    loading.value = true;

    try {
      // 获取用户兴趣标签
      const userInterests = userBehavior.getUserInterests();

      // 创建候选推荐项
      const candidates: RecommendationItem[] = [];

      // 处理GitHub项目
      githubItems.forEach((item) => {
        // 添加0-0.3的随机分数，增加推荐结果的随机性
        const randomBonus = Math.random() * 0.3;
        const score =
          calculateMatchScore(item.name, userInterests) + randomBonus;
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
        const randomBonus = Math.random() * 0.3;
        const score =
          calculateMatchScore(item.title, userInterests) + randomBonus;
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
        const randomBonus = Math.random() * 0.3;
        const score =
          calculateMatchScore(item.title, userInterests) + randomBonus;
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
        const randomBonus = Math.random() * 0.3;
        const score =
          calculateMatchScore(item.title, userInterests) + randomBonus;
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
        const randomBonus = Math.random() * 0.3;
        const score =
          calculateMatchScore(item.title, userInterests) + randomBonus;
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
        const randomBonus = Math.random() * 0.3;
        const score =
          calculateMatchScore(item.title, userInterests) + randomBonus;
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

      // 处理知乎热榜
      zhihuItems.forEach((item) => {
        const randomBonus = Math.random() * 0.3;
        const score =
          calculateMatchScore(item.title, userInterests) + randomBonus;
        const matchedTags = userInterests.filter(
          (tag) =>
            item.title.toLowerCase().includes(tag.toLowerCase()) ||
            (item.desc && item.desc.toLowerCase().includes(tag.toLowerCase())),
        );

        candidates.push({
          ...item,
          score,
          source: '知乎',
          reason: matchedTags.length
            ? `匹配"${matchedTags.join('、')}"`
            : '热门问答',
          matchedTags,
        });
      });

      // 按分数排序
      candidates.sort((a, b) => b.score - a.score);

      // 保证多样性：从不同来源选取内容
      const topRecommendations: RecommendationItem[] = [];
      const sourceCounts: Record<string, number> = {};
      const MAX_PER_SOURCE = 3; // 每个来源最多3个
      const MAX_RECOMMENDATIONS = 20; // 总共最多20个推荐

      // 随机选择一些低分项目提升到顶部，增加多样性
      if (candidates.length > 20) {
        // 将候选列表分为两部分：高分项目和低分项目
        const highScoreCandidates = candidates.slice(
          0,
          Math.ceil(candidates.length * 0.3),
        );
        const lowScoreCandidates = candidates.slice(
          Math.ceil(candidates.length * 0.3),
        );

        // 随机从低分项目中选择2-4个
        const randomCount = Math.floor(Math.random() * 3) + 2; // 2-4个

        // 随机打乱低分数组
        const shuffledLowScore = [...lowScoreCandidates].sort(
          () => Math.random() - 0.5,
        );

        // 从低分项目中选择一些项目提升排名
        const promotedItems = shuffledLowScore.slice(0, randomCount);

        // 重新组合列表并按分数排序
        candidates.length = 0;
        candidates.push(...highScoreCandidates, ...promotedItems);

        // 重新打乱顺序，减少预测性
        candidates.sort(() => 0.7 - Math.random());

        // 按分数重新排序
        candidates.sort((a, b) => b.score - a.score);
      }

      for (const item of candidates) {
        const source = item.source;
        sourceCounts[source] = sourceCounts[source] || 0;

        if (sourceCounts[source] < MAX_PER_SOURCE) {
          topRecommendations.push(item);
          sourceCounts[source]++;
        }

        if (topRecommendations.length >= MAX_RECOMMENDATIONS) break;
      }

      // 最终随机打乱结果的顺序，但保持前5个不变，保证高质量推荐仍在顶部
      if (topRecommendations.length > 5) {
        const topFive = topRecommendations.slice(0, 5);
        const rest = topRecommendations.slice(5);

        // 随机打乱剩余部分
        rest.sort(() => Math.random() - 0.5);

        // 重组列表
        topRecommendations.length = 0;
        topRecommendations.push(...topFive, ...rest);
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
