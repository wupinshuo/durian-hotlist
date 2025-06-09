'use client';

import { useState, useEffect, useCallback } from 'react';
import { GithubHostList, HotList, HotType } from '../../types/hot';
import { GithubPeriod } from '../../types/hot';
import { getHotListByType } from './hotlist';
import { toast } from 'sonner';

/**
 * 使用热榜数据的钩子
 * @param type 热榜类型
 * @param initialPeriod 初始时间周期
 * @returns 热榜数据和操作方法
 */
export function useHotList<T extends HotList | GithubHostList>(
  type: HotType,
  initialPeriod: GithubPeriod = 'weekly',
) {
  const [data, setData] = useState<T>({ list: [], updateTime: 0 });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<GithubPeriod>(initialPeriod);

  const fetchData = useCallback(
    async (force: boolean = false) => {
      setLoading(true);
      try {
        const result = await getHotListByType(type, period, force);
        setData(result as T);
      } catch (error) {
        console.error(`获取${type}热榜数据失败:`, error);
        toast.error(`获取${type}热榜数据失败，请稍后刷新`);
      } finally {
        setLoading(false);
      }
    },
    [type, period],
  );

  // 首次加载数据
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 刷新数据
  const refresh = useCallback(async () => {
    toast.info(`正在刷新${type}热榜...`);
    await fetchData(true);
    toast.success(`${type}热榜已更新`);
  }, [fetchData, type]);

  // 改变时间周期
  const changePeriod = useCallback(
    (newPeriod: GithubPeriod) => {
      if (newPeriod !== period) {
        setPeriod(newPeriod);
      }
    },
    [period],
  );

  // 当period变化时重新获取数据
  useEffect(() => {
    fetchData();
  }, [period, fetchData]);

  return {
    data,
    loading,
    period,
    refresh,
    changePeriod,
  };
}
