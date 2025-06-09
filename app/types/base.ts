/**
 * 通用返回数据结构
 */
export interface ReturnData<T> {
  /** 状态码 */
  code: number;
  /** 消息 */
  message: string;
  /** 数据 */
  data: T;
}

/**
 * 分页参数
 */
export interface PageParams {
  /** 页码 */
  page: number;
  /** 每页条数 */
  pageSize: number;
}
