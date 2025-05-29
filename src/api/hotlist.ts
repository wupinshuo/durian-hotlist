import axios from 'axios';

/** 热榜数据地址 */
const BASE_URL = 'http://localhost:8082/api/v1/api-data';

/**
 * 通用热榜数据获取方法
 * @param url 请求地址
 * @returns Promise<any[]>
 */
async function getHotListData(url: string): Promise<any[]> {
  try {
    const res = await axios.get(url);
    if (res.data && Array.isArray(res.data)) {
      return res.data;
    } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return res.data.data;
    } else {
      console.error('接口返回格式不符合预期:', res.data);
      return [];
    }
  } catch (error) {
    console.error('获取热榜数据失败:', error);
    return [];
  }
}

/**
 * 获取github trending 一周热榜数据
 */
export async function getGithubTrending() {
  return getHotListData(`${BASE_URL}/github-trending`);
}

/**
 * 获取掘金热点文章数据
 * @returns 掘金热点文章列表
 */
export async function getJuejinHotArticle() {
  return getHotListData(`${BASE_URL}/juejin-hot-article`);
}

/**
 * 获取微博热榜数据
 * @returns 微博热榜列表
 */
export async function getWeiboHotList() {
  return getHotListData(`${BASE_URL}/weibo-hot-list`);
}
