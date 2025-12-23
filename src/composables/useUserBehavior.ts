import { HotItem } from '@/types/hot';
import { useReadStatus } from './useReadStatus';

// 用户行为数据接口
interface BehaviorData {
  itemId: string; // URL作为唯一标识
  title: string; // 标题
  source: string; // 来源平台
  type: 'click'; // 行为类型
  timestamp: number; // 时间戳
  tags: string[]; // 提取的标签
}

// 本地存储键名
const BEHAVIOR_STORAGE_KEY = 'durian_user_behavior';
const MAX_STORED_BEHAVIORS = 100; // 最多存储100条行为记录

/**
 * 从标题中提取关键词作为简单标签
 */
function extractTags(title: string): string[] {
  // 技术相关关键词
  const techKeywords = [
    'React',
    'Vue',
    'Angular',
    'JavaScript',
    'TypeScript',
    'Node.js',
    'Python',
    'Java',
    'Go',
    'Rust',
    'AI',
    '人工智能',
    '机器学习',
    '深度学习',
    '区块链',
    '云计算',
    '大数据',
    '前端',
    '后端',
    '全栈',
    '微服务',
    'Docker',
    'Kubernetes',
    '开源',
    'Git',
    'GitHub',
    '算法',
    '编程',
    '架构',
    '数据库',
    'API',
    '服务器',
    '安全',
    'iOS',
    'Android',
    '移动端',
    'Web3',
    '元宇宙',
  ];

  // 行业相关关键词
  const industryKeywords = [
    '科技',
    '金融',
    '教育',
    '医疗',
    '电商',
    '游戏',
    '娱乐',
    '音乐',
    '视频',
    '直播',
    '社交',
    '出行',
    '健康',
    '创业',
    '投资',
    '营销',
    '体育',
    '篮球',
    '足球',
    '运动',
    '健身',
    '创投',
    '融资',
    'IPO',
    '股票',
    '区块链',
    '数字货币',
    '技术讨论',
    '开发者',
    '程序员',
  ];

  // 合并所有关键词
  const allKeywords = [...techKeywords, ...industryKeywords];

  // 提取匹配的标签
  const tags: string[] = [];
  for (const keyword of allKeywords) {
    if (title.includes(keyword)) {
      tags.push(keyword);
    }
  }

  return tags;
}

/**
 * 存储用户行为数据到本地存储
 */
function storeUserBehavior(data: BehaviorData): void {
  try {
    // 获取现有行为数据
    const stored = localStorage.getItem(BEHAVIOR_STORAGE_KEY);
    const behaviors: BehaviorData[] = stored ? JSON.parse(stored) : [];

    // 检查是否已存在相同记录(相同URL相同行为)，避免重复
    const existingIndex = behaviors.findIndex(
      (b) => b.itemId === data.itemId && b.type === data.type,
    );

    if (existingIndex !== -1) {
      // 更新现有记录的时间戳
      behaviors[existingIndex].timestamp = data.timestamp;
    } else {
      // 添加新记录
      behaviors.unshift(data);
      // 限制存储数量
      if (behaviors.length > MAX_STORED_BEHAVIORS) {
        behaviors.pop(); // 移除最旧的记录
      }
    }

    // 保存回本地存储
    localStorage.setItem(BEHAVIOR_STORAGE_KEY, JSON.stringify(behaviors));
  } catch (error) {
    console.error('保存用户行为失败:', error);
  }
}

/**
 * 获取用户行为历史
 */
function getUserBehaviorHistory(): BehaviorData[] {
  try {
    const stored = localStorage.getItem(BEHAVIOR_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('获取用户行为失败:', error);
    return [];
  }
}

/**
 * 用户行为收集Hook
 */
export function useUserBehavior() {
  // 获取已读状态功能
  const { markAsRead, isRead } = useReadStatus();

  // 记录点击行为
  const trackClick = (item: HotItem, source: string) => {
    // 首先检查是否已经标记为已读
    const alreadyRead = isRead(item.url);

    const behaviorData: BehaviorData = {
      itemId: item.url,
      title: item.title,
      source,
      type: 'click',
      timestamp: Date.now(),
      tags: extractTags(item.title),
    };

    storeUserBehavior(behaviorData);

    // 同时标记为已读
    if (!alreadyRead) {
      markAsRead(item.url);
    }

    return behaviorData;
  };

  // 获取用户兴趣标签
  const getUserInterests = (): string[] => {
    const behaviors = getUserBehaviorHistory();
    const tagCount: Record<string, number> = {};

    // 统计所有标签出现次数
    behaviors.forEach((behavior) => {
      behavior.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    // 按计数排序并返回前10个标签
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  };

  return {
    trackClick,
    getUserInterests,
    getUserBehaviorHistory,
    isRead, // 也导出 isRead 方法方便直接使用
  };
}
