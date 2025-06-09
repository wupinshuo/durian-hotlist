'use client';

import { useState, useEffect } from 'react';
import { GithubHostItem, GithubPeriod, HotItem } from '@/types/hot';
import { getHotListByType } from '@/lib/api/hotlist';
import { GithubTrendingCard } from '@/components/hotlist/GithubTrendingCard';
import { HotListCard } from '@/components/hotlist/HotListCard';
import { Header } from '@/components/header';
import dynamic from 'next/dynamic';

// 动态导入诊断工具，仅在开发环境中显示
const DiagnosticsTool = dynamic(
  () =>
    process.env.NODE_ENV === 'development'
      ? import('@/components/DiagnosticsTool').then(
          (mod) => mod.DiagnosticsTool,
        )
      : Promise.resolve(() => null),
  { ssr: false },
);

export default function Home() {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  // GitHub 热榜
  const [githubRepos, setGithubRepos] = useState<GithubHostItem[]>([]);
  const [githubLoading, setGithubLoading] = useState(true);
  const [githubUpdateTime, setGithubUpdateTime] = useState(0);

  // 掘金热榜
  const [juejinItems, setJuejinItems] = useState<HotItem[]>([]);
  const [juejinLoading, setJuejinLoading] = useState(true);
  const [juejinUpdateTime, setJuejinUpdateTime] = useState(0);

  // 微博热榜
  const [weiboItems, setWeiboItems] = useState<HotItem[]>([]);
  const [weiboLoading, setWeiboLoading] = useState(true);
  const [weiboUpdateTime, setWeiboUpdateTime] = useState(0);

  // B站热榜
  const [bilibiliItems, setBilibiliItems] = useState<HotItem[]>([]);
  const [bilibiliLoading, setBilibiliLoading] = useState(true);
  const [bilibiliUpdateTime, setBilibiliUpdateTime] = useState(0);

  // IT之家热榜
  const [ithomeItems, setIthomeItems] = useState<HotItem[]>([]);
  const [ithomeLoading, setIthomeLoading] = useState(true);
  const [ithomeUpdateTime, setIthomeUpdateTime] = useState(0);

  // 少数派热榜
  const [sspaiItems, setSspaiItems] = useState<HotItem[]>([]);
  const [sspaiLoading, setSspaiLoading] = useState(true);
  const [sspaiUpdateTime, setSspaiUpdateTime] = useState(0);

  useEffect(() => {
    // 加载所有热榜数据
    loadGithubTrending();
    loadJuejinHotList();
    loadWeiboHotList();
    loadBilibiliHotList();
    loadIthomeHotList();
    loadSspaiHotList();

    // 在开发环境中，按下D键显示诊断工具
    if (process.env.NODE_ENV === 'development') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'd' || e.key === 'D') {
          setShowDiagnostics((prev) => !prev);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  // 加载GitHub热榜
  const loadGithubTrending = async (period: GithubPeriod = 'weekly') => {
    try {
      setGithubLoading(true);
      const data = await getHotListByType('github', period);
      setGithubRepos(data.list as GithubHostItem[]);
      setGithubUpdateTime(data.updateTime);
    } catch (error) {
      console.error('加载GitHub热榜失败:', error);
    } finally {
      setGithubLoading(false);
    }
  };

  // 加载掘金热榜
  const loadJuejinHotList = async () => {
    try {
      setJuejinLoading(true);
      const data = await getHotListByType('juejin');
      setJuejinItems(data.list as HotItem[]);
      setJuejinUpdateTime(data.updateTime);
    } catch (error) {
      console.error('加载掘金热榜失败:', error);
    } finally {
      setJuejinLoading(false);
    }
  };

  // 加载微博热榜
  const loadWeiboHotList = async () => {
    try {
      setWeiboLoading(true);
      const data = await getHotListByType('weibo');
      setWeiboItems(data.list as HotItem[]);
      setWeiboUpdateTime(data.updateTime);
    } catch (error) {
      console.error('加载微博热榜失败:', error);
    } finally {
      setWeiboLoading(false);
    }
  };

  // 加载B站热榜
  const loadBilibiliHotList = async () => {
    try {
      setBilibiliLoading(true);
      const data = await getHotListByType('bilibili');
      setBilibiliItems(data.list as HotItem[]);
      setBilibiliUpdateTime(data.updateTime);
    } catch (error) {
      console.error('加载B站热榜失败:', error);
    } finally {
      setBilibiliLoading(false);
    }
  };

  // 加载IT之家热榜
  const loadIthomeHotList = async () => {
    try {
      setIthomeLoading(true);
      const data = await getHotListByType('ithome');
      setIthomeItems(data.list as HotItem[]);
      setIthomeUpdateTime(data.updateTime);
    } catch (error) {
      console.error('加载IT之家热榜失败:', error);
    } finally {
      setIthomeLoading(false);
    }
  };

  // 加载少数派热榜
  const loadSspaiHotList = async () => {
    try {
      setSspaiLoading(true);
      const data = await getHotListByType('sspai');
      setSspaiItems(data.list as HotItem[]);
      setSspaiUpdateTime(data.updateTime);
    } catch (error) {
      console.error('加载少数派热榜失败:', error);
    } finally {
      setSspaiLoading(false);
    }
  };

  // 处理GitHub时间范围变化
  const handleGithubPeriodChange = (period: GithubPeriod) => {
    loadGithubTrending(period);
  };

  return (
    <div className="min-h-screen bg-[#191b1f] text-gray-200">
      <Header />
      <main className="container mx-auto px-4 py-[120px]">
        {showDiagnostics && process.env.NODE_ENV === 'development' && (
          <DiagnosticsTool />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GithubTrendingCard
            repos={githubRepos}
            isLoading={githubLoading}
            updateTime={githubUpdateTime}
            onRefresh={loadGithubTrending}
            onPeriodChange={handleGithubPeriodChange}
          />

          <HotListCard
            title="掘金热榜"
            items={juejinItems}
            isLoading={juejinLoading}
            updateTime={juejinUpdateTime}
            onRefresh={loadJuejinHotList}
            iconColor="#1e80ff"
          />

          <HotListCard
            title="微博热榜"
            items={weiboItems}
            isLoading={weiboLoading}
            updateTime={weiboUpdateTime}
            onRefresh={loadWeiboHotList}
            iconColor="#e6162d"
          />

          <HotListCard
            title="B站热榜"
            items={bilibiliItems}
            isLoading={bilibiliLoading}
            updateTime={bilibiliUpdateTime}
            onRefresh={loadBilibiliHotList}
            iconColor="#fb7299"
          />

          <HotListCard
            title="IT之家热榜"
            items={ithomeItems}
            isLoading={ithomeLoading}
            updateTime={ithomeUpdateTime}
            onRefresh={loadIthomeHotList}
            iconColor="#d22222"
          />

          <HotListCard
            title="少数派热榜"
            items={sspaiItems}
            isLoading={sspaiLoading}
            updateTime={sspaiUpdateTime}
            onRefresh={loadSspaiHotList}
            iconColor="#d71a1b"
          />
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="text-center mt-8 text-sm text-gray-500">
            按 D 键切换诊断工具显示
          </div>
        )}
      </main>
    </div>
  );
}
