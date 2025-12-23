import { ref, Ref } from 'vue';
import { RecommendationItem } from './useRecommendationEngine';

// 用户行为矩阵接口
interface UserBehaviorMatrix {
  [userId: string]: {
    [itemUrl: string]: number; // 点击次数或兴趣分数
  };
}

// 用户相似度接口
interface UserSimilarity {
  userId: string;
  similarity: number;
}

// 物品相似度接口
interface ItemSimilarity {
  itemUrl: string;
  similarity: number;
}

/**
 * 协同过滤推荐系统
 */
export function useCollaborativeFiltering() {
  const userMatrix: Ref<UserBehaviorMatrix> = ref({});
  const loading = ref(false);

  // 生成用户ID（基于浏览器指纹或随机生成）
  const getUserId = (): string => {
    let userId = localStorage.getItem('durian_user_id');
    if (!userId) {
      userId =
        'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('durian_user_id', userId);
    }
    return userId;
  };

  // 从本地存储加载用户行为矩阵
  const loadUserMatrix = (): void => {
    try {
      const stored = localStorage.getItem('durian_user_matrix');
      if (stored) {
        userMatrix.value = JSON.parse(stored);
      }
    } catch (error) {
      console.error('加载用户矩阵失败:', error);
      userMatrix.value = {};
    }
  };

  // 保存用户行为矩阵到本地存储
  const saveUserMatrix = (): void => {
    try {
      localStorage.setItem(
        'durian_user_matrix',
        JSON.stringify(userMatrix.value),
      );
    } catch (error) {
      console.error('保存用户矩阵失败:', error);
    }
  };

  // 记录用户行为
  const recordUserBehavior = (itemUrl: string, score: number = 1): void => {
    const userId = getUserId();

    if (!userMatrix.value[userId]) {
      userMatrix.value[userId] = {};
    }

    // 累加分数（多次点击增加权重）
    userMatrix.value[userId][itemUrl] =
      (userMatrix.value[userId][itemUrl] || 0) + score;

    saveUserMatrix();
  };

  // 计算两个用户的余弦相似度
  const calculateUserSimilarity = (userA: string, userB: string): number => {
    const itemsA = userMatrix.value[userA] || {};
    const itemsB = userMatrix.value[userB] || {};

    const commonItems = Object.keys(itemsA).filter((item) => itemsB[item]);

    if (commonItems.length === 0) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    commonItems.forEach((item) => {
      dotProduct += itemsA[item] * itemsB[item];
      normA += itemsA[item] * itemsA[item];
      normB += itemsB[item] * itemsB[item];
    });

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  };

  // 计算两个物品的Jaccard相似度
  const calculateItemSimilarity = (itemA: string, itemB: string): number => {
    const usersA = new Set<string>();
    const usersB = new Set<string>();

    Object.keys(userMatrix.value).forEach((userId) => {
      if (userMatrix.value[userId][itemA]) usersA.add(userId);
      if (userMatrix.value[userId][itemB]) usersB.add(userId);
    });

    const intersection = new Set(
      [...usersA].filter((user) => usersB.has(user)),
    );
    const union = new Set([...usersA, ...usersB]);

    return union.size > 0 ? intersection.size / union.size : 0;
  };

  // 基于用户的协同过滤推荐
  const getUserBasedRecommendations = (
    candidates: RecommendationItem[],
    k: number = 5,
  ): RecommendationItem[] => {
    const currentUserId = getUserId();
    const currentUserItems = userMatrix.value[currentUserId] || {};

    // 如果当前用户没有行为数据，返回空推荐
    if (Object.keys(currentUserItems).length === 0) {
      return [];
    }

    // 计算与其他用户的相似度
    const similarities: UserSimilarity[] = Object.keys(userMatrix.value)
      .filter((userId) => userId !== currentUserId)
      .map((userId) => ({
        userId,
        similarity: calculateUserSimilarity(currentUserId, userId),
      }))
      .filter((item) => item.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, k);

    if (similarities.length === 0) return [];

    // 收集相似用户喜欢的物品
    const itemScores = new Map<string, number>();

    similarities.forEach(({ userId, similarity }) => {
      Object.keys(userMatrix.value[userId]).forEach((itemUrl) => {
        // 只推荐当前用户未接触的物品
        if (!currentUserItems[itemUrl]) {
          const score =
            (itemScores.get(itemUrl) || 0) +
            similarity * userMatrix.value[userId][itemUrl];
          itemScores.set(itemUrl, score);
        }
      });
    });

    // 根据协同过滤分数对候选项进行重新排序
    return candidates
      .map((item) => ({
        ...item,
        cfScore: itemScores.get(item.url) || 0,
      }))
      .filter((item) => item.cfScore > 0)
      .sort((a, b) => b.cfScore - a.cfScore);
  };

  // 基于物品的协同过滤推荐
  const getItemBasedRecommendations = (
    candidates: RecommendationItem[],
  ): RecommendationItem[] => {
    const currentUserId = getUserId();
    const currentUserItems = userMatrix.value[currentUserId] || {};
    const userItemUrls = Object.keys(currentUserItems);

    if (userItemUrls.length === 0) return [];

    // 为每个候选物品计算与用户已喜欢物品的相似度
    const itemScores = new Map<string, number>();

    candidates.forEach((candidate) => {
      if (!currentUserItems[candidate.url]) {
        // 用户未接触的物品
        let totalSimilarity = 0;
        let count = 0;

        userItemUrls.forEach((userItemUrl) => {
          const similarity = calculateItemSimilarity(
            candidate.url,
            userItemUrl,
          );
          if (similarity > 0) {
            totalSimilarity += similarity * currentUserItems[userItemUrl];
            count++;
          }
        });

        if (count > 0) {
          itemScores.set(candidate.url, totalSimilarity / count);
        }
      }
    });

    return candidates
      .map((item) => ({
        ...item,
        cfScore: itemScores.get(item.url) || 0,
      }))
      .filter((item) => item.cfScore > 0)
      .sort((a, b) => b.cfScore - a.cfScore);
  };

  // 混合推荐：结合基于用户和基于物品的协同过滤
  const getHybridRecommendations = (
    candidates: RecommendationItem[],
    userWeight: number = 0.6,
    itemWeight: number = 0.4,
  ): RecommendationItem[] => {
    const userBasedRecs = getUserBasedRecommendations(candidates);
    const itemBasedRecs = getItemBasedRecommendations(candidates);

    // 创建综合分数映射
    const hybridScores = new Map<string, number>();

    // 合并两种推荐的分数
    candidates.forEach((candidate) => {
      const userRec = userBasedRecs.find((item) => item.url === candidate.url);
      const itemRec = itemBasedRecs.find((item) => item.url === candidate.url);

      const userScore = userRec?.cfScore || 0;
      const itemScore = itemRec?.cfScore || 0;

      const hybridScore = userScore * userWeight + itemScore * itemWeight;

      if (hybridScore > 0) {
        hybridScores.set(candidate.url, hybridScore);
      }
    });

    return candidates
      .map((item) => ({
        ...item,
        cfScore: hybridScores.get(item.url) || 0,
        reason: hybridScores.get(item.url) > 0 ? '相似用户推荐' : item.reason,
      }))
      .filter((item) => item.cfScore > 0)
      .sort((a, b) => b.cfScore - a.cfScore);
  };

  // 获取用户行为统计
  const getUserStats = () => {
    const currentUserId = getUserId();
    const userItems = userMatrix.value[currentUserId] || {};
    const totalUsers = Object.keys(userMatrix.value).length;
    const totalItems = new Set(
      Object.values(userMatrix.value).flatMap((items) => Object.keys(items)),
    ).size;

    return {
      currentUserItems: Object.keys(userItems).length,
      totalUsers,
      totalItems,
      sparsity:
        totalUsers > 0 && totalItems > 0
          ? 1 - Object.keys(userItems).length / totalItems
          : 1,
    };
  };

  // 初始化
  loadUserMatrix();

  return {
    recordUserBehavior,
    getUserBasedRecommendations,
    getItemBasedRecommendations,
    getHybridRecommendations,
    getUserStats,
    loading,
  };
}
