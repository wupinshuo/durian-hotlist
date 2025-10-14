import axios from 'axios';
import { GoldItem, TodayGoldHistoryData } from '@/types/gold';
import { ReturnData } from '@/types/base';

/**
 * 获取今日金价列表
 * @returns 金价列表数据
 */
export async function getGoldList(): Promise<GoldItem[]> {
  try {
    // 获取当前域名
    const baseUrl = window.location.origin;
    const res = await axios.post<ReturnData<GoldItem[]>>(
      `${baseUrl}/api/v1/gold`,
      {},
      {
        timeout: 30000,
      },
    );

    if (res.data?.status === 200 && res.data?.data) {
      // 价格保留一位小数
      res.data.data.forEach((item) => {
        item.price = Number(item.price).toFixed(1);
      });
      return res.data.data;
    } else {
      console.error('获取金价列表数据失败:', res.data);
      return [];
    }
  } catch (error) {
    console.error('获取金价列表数据失败:', error);
    return [];
  }
}

/**
 * 获取金价历史数据
 * @param goldId 金价ID
 * @param days 查询天数
 * @returns 金价历史数据
 */
export async function getGoldHistory(
  goldId: string,
  days: number = 7,
): Promise<GoldItem[]> {
  try {
    // 获取当前域名
    const baseUrl = window.location.origin;
    const res = await axios.post<ReturnData<GoldItem[]>>(
      `${baseUrl}/api/v1/gold/current`,
      { goldId, days },
      { timeout: 30000 },
    );

    if (res.data?.status === 200 && res.data?.data) {
      return res.data.data;
    } else {
      console.error('获取金价历史数据失败:', res.data);
      return [];
    }
  } catch (error) {
    console.error('获取金价历史数据失败:', error);
    return [];
  }
}

/**
 * 获取今日金价详细历史数据(半小时更新一次)
 * @param days 查询天数 (1-7天)
 * @returns 今日金价详细历史数据
 */
export async function getTodayGoldHistory(
  days: number = 1,
): Promise<TodayGoldHistoryData | null> {
  try {
    // 获取当前域名
    const baseUrl = window.location.origin;
    const res = await axios.post<ReturnData<TodayGoldHistoryData>>(
      `${baseUrl}/api/v1/gold/history`,
      { days },
      { timeout: 30000 },
    );

    if (res.data?.status === 200 && res.data?.data) {
      return res.data.data;
    } else {
      console.error('获取今日金价详细历史数据失败:', res.data);
      return null;
    }
  } catch (error) {
    console.error('获取今日金价详细历史数据失败:', error);
    return null;
  }
}
