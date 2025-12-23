import { GithubPeriod } from '../constants/hotlist';

/**
 * 返回的单条热点数据结构
 */
export interface HotItem {
  /** 热榜标题 */
  title: string;
  /** 热榜描述 */
  desc: string;
  /** 热榜链接 */
  url: string;
  /** 热榜热度 */
  hot: string;
  /** 作者 */
  author?: string;
  /** 标签 */
  tag?: string;
}

/**
 * 返回的热点数据结构
 */
export interface HotList {
  /** 列表 */
  list: HotItem[];
  /** 更新时间 */
  updateTime: number;
  /** 总条数 */
  total?: number;
}

/**
 * 返回的github trending仓库数据结构
 */
export interface GithubHostList {
  /** 列表 */
  list: GithubHostItem[];
  /** 更新时间 */
  updateTime: number;
  /** 总条数 */
  total?: number;
  /** 时间范围：daily(日榜)、weekly(周榜)、monthly(月榜) */
  period?: GithubPeriod;
}

/** 最近一周github热点trending仓库 */
export interface GithubHostItem {
  /** 仓库名称 */
  name: string;
  /** 仓库描述 */
  desc: string;
  /** 仓库语言 */
  language: string;
  /** 仓库星星数 */
  stars: string;

  /** 仓库fork数 */
  forks: string;
  /** 今日新增星星数 */
  starsToday: string;
  /** 本周新增星星数 */
  starsThisWeek: string;
  /** 月新增星星数 */
  starsThisMonth: string;
  /** 仓库url */
  url: string;
}

/**
 * daily-hot-api 单条数据结构
 */
export interface DailyHotApiItem {
  /** 热榜标题 */
  title: string;
  /** 热榜描述 */
  desc: string;
  /** 热榜链接 */
  url: string;
  /** 热榜热度 */
  hot: number;
  /** 唯一标识 */
  id?: string;
  /** 作者 */
  author?: string;
  /** 时间戳 */
  timestamp?: number;
  /** 移动端链接 */
  mobileUrl?: string;
}

/**
 * daily-hot-api 返回的数据结构
 */
export interface DailyHotApiResponse {
  /** 状态码 */
  code: number;
  /** 站点名称 */
  name: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 总条数 */
  total: number;
  /** 数据 */
  data: DailyHotApiItem[];
}

/**
 * 热榜类型
 */
export type HotType =
  | 'weibo' // 微博
  | 'juejin' // 掘金
  | 'github' // github
  | 'ithome' // IT之家
  | 'sspai' // 少数派
  | 'bilibili' // B站
  | 'zhihu' // 知乎
  | 'hupu' // 虎扑
  | '36kr' // 36氪
  | 'v2ex'; // V2EX
