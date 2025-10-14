/**
 * 金价数据项
 */
export interface GoldItem {
  /** 金价ID */
  goldId: string;
  /** 金价名称 */
  name: string;
  /** 金价价格 */
  price: string | number;
  /** 时间 */
  time?: string;
}

/**
 * 金价历史数据请求参数
 */
export interface GoldHistoryParams {
  /** 金价ID */
  goldId: string;
  /** 查询天数 */
  days: number;
}

/**
 * 今日金价详细数据项
 */
export interface TodayGoldItem {
  /** 金价名称 */
  name: string;
  /** 金价价格 */
  price: number;
  /** 时间戳(毫秒) */
  timestamp: number;
}

/**
 * 今日金价历史数据响应
 */
export interface TodayGoldHistoryData {
  /** 金价列表 */
  list: TodayGoldItem[];
  /** 总数 */
  total: number;
  /** 查询天数 */
  days: number;
}

/**
 * 今日金价历史数据请求参数
 */
export interface TodayGoldHistoryParams {
  /** 查询天数 (1-7) */
  days: number;
}
