import { GithubPeriod } from '../types/hot';

/**
 * GitHub趋势时间范围常量
 */
export const GITHUB_PERIOD = {
  /** 日榜 */
  DAILY: 'daily' as GithubPeriod,
  /** 周榜 */
  WEEKLY: 'weekly' as GithubPeriod,
  /** 月榜 */
  MONTHLY: 'monthly' as GithubPeriod,
};

/**
 * GitHub趋势默认时间范围
 */
export const DEFAULT_GITHUB_PERIOD: GithubPeriod = GITHUB_PERIOD.WEEKLY;

/**
 * GitHub趋势时间范围中文描述
 */
export const GITHUB_PERIOD_TEXT = {
  [GITHUB_PERIOD.DAILY]: '日榜',
  [GITHUB_PERIOD.WEEKLY]: '周榜',
  [GITHUB_PERIOD.MONTHLY]: '月榜',
};
