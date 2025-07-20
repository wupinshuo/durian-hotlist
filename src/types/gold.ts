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
