import axios from 'axios';
import { useConfigStore } from '@/store/configStore';
import { ReturnData } from '@/types/base';
import { GithubHostList, HotList, HotType } from '@/types/hot';
import { GithubPeriod } from '@/constants/hotlist';

/**
 * 根据热榜类型获取热榜数据
 * @param type 热榜类型
 * @returns 热榜列表
 */
export async function getHotListByType(
  type: HotType,
  period: GithubPeriod,
): Promise<HotList | GithubHostList> {
  const configStore = useConfigStore();
  try {
    // 使用POST请求，请求体中包含type字段
    const res = await axios.post<ReturnData<HotList | GithubHostList>>(
      `${configStore.baseUrl}/hot-list`,
      { type, period },
    );
    const data = res.data?.data;

    // 获取列表数据
    const list = data?.list;

    // 返回数据
    if (list && Array.isArray(list)) {
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
