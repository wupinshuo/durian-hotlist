import axios from 'axios';
import { ReturnData } from '@/types/base';
import { GithubHostList, HotList, HotType, GithubPeriod } from '@/types/hot';

/**
 * 根据热榜类型获取热榜数据
 * @param type 热榜类型
 * @param period 时间周期
 * @param force 是否强制刷新
 * @returns 热榜列表
 */
export async function getHotListByType(
  type: HotType,
  period: GithubPeriod = 'weekly',
  force: boolean = false,
): Promise<HotList | GithubHostList> {
  try {
    console.log(`开始获取${type}热榜数据`, { period, force });

    // 获取当前域名
    const baseUrl = window.location.origin;

    // 使用POST请求，请求体中包含type字段
    const res = await axios.post<ReturnData<HotList | GithubHostList>>(
      `${baseUrl}/api/hot-list`,
      { type, period, force },
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    console.log(`${type}热榜API响应:`, {
      status: res.status,
      code: res.data?.code,
      hasData: !!res.data?.data,
    });

    // 如果接口返回错误码
    if (res.data?.code !== 0) {
      console.error(`获取${type}热榜失败:`, res.data?.message);
      return { list: [], updateTime: 0, total: 0 };
    }

    const data = res.data?.data;

    // 获取列表数据
    const list = data?.list;

    // 返回数据
    if (list && Array.isArray(list)) {
      console.log(`${type}热榜数据获取成功，条目数:`, list.length);
      return data;
    } else {
      console.error('接口返回格式不符合预期:', res.data);
      return { list: [], updateTime: 0, total: 0 };
    }
  } catch (error) {
    console.error(`获取${type}热榜数据失败:`, error);
    return { list: [], updateTime: 0, total: 0 };
  }
}
