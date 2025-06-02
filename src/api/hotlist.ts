import axios from 'axios';
import { useConfigStore } from '@/store/configStore';
import { ReturnData } from '@/types/base';
import { GithubHostList, HotList } from '@/types/hot';

/**
 * 通用热榜数据获取方法
 * @param url 请求地址
 * @returns Promise<HotList>
 */
async function getHotListData(url: string): Promise<HotList> {
  try {
    const res = await axios.get<ReturnData<HotList>>(url);
    // 获取列表数据
    const list = res.data?.data?.list;
    // 获取更新时间
    const updateTime = res.data?.data?.updateTime;
    // 获取总条数
    const total = res.data?.data?.total;
    // 返回数据
    if (list && Array.isArray(list)) {
      return { list, updateTime, total };
    } else {
      console.error('接口返回格式不符合预期:', res.data);
      return { list: [], updateTime: 0, total: 0 };
    }
  } catch (error) {
    console.error('获取热榜数据失败:', error);
    return { list: [], updateTime: 0, total: 0 };
  }
}

/**
 * 获取github trending 一周热榜数据
 */
export async function getGithubTrending(): Promise<GithubHostList> {
  const configStore = useConfigStore();
  try {
    const res = await axios.get<ReturnData<GithubHostList>>(
      `${configStore.baseUrl}/github`,
    );
    const list = res.data?.data?.list;
    const updateTime = res.data?.data?.updateTime;
    const total = res.data?.data?.total;
    if (list && Array.isArray(list)) {
      return { list, updateTime, total };
    } else {
      console.error('接口返回格式不符合预期:', res.data);
      return { list: [], updateTime: 0, total: 0 };
    }
  } catch (error) {
    console.error('获取github trending 一周热榜数据失败:', error);
    return { list: [], updateTime: 0, total: 0 };
  }
}

/**
 * 获取掘金热点文章数据
 * @returns 掘金热点文章列表
 */
export async function getJuejinHotArticle(): Promise<HotList> {
  const configStore = useConfigStore();
  return await getHotListData(`${configStore.baseUrl}/juejin`);
}

/**
 * 获取微博热榜数据
 * @returns 微博热榜列表
 */
export async function getWeiboHotList(): Promise<HotList> {
  const configStore = useConfigStore();
  return await getHotListData(`${configStore.baseUrl}/weibo`);
}
