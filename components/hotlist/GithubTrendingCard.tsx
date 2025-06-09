'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { GithubHostItem, GithubPeriod } from '@/types/hot';
import { GITHUB_PERIOD, GITHUB_PERIOD_TEXT } from '@/constants/hotlist';
import { BsGithub } from 'react-icons/bs';
import { AiFillFire, AiOutlineStar, AiOutlineFork } from 'react-icons/ai';
import { FaCode } from 'react-icons/fa';

export interface GithubTrendingCardProps {
  repos: GithubHostItem[];
  isLoading: boolean;
  updateTime: number;
  onRefresh?: (period: GithubPeriod) => void;
  onPeriodChange?: (period: GithubPeriod) => void;
}

export function GithubTrendingCard({
  repos = [],
  isLoading = false,
  updateTime = 0,
  onRefresh,
  onPeriodChange,
}: GithubTrendingCardProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<GithubPeriod>(
    GITHUB_PERIOD.WEEKLY,
  );

  const handleRefresh = async () => {
    if (refreshing || !onRefresh) return;

    setRefreshing(true);
    try {
      await onRefresh(currentPeriod);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePeriodChange = (period: GithubPeriod) => {
    setCurrentPeriod(period);
    onPeriodChange?.(period);
  };

  const formatUpdateTime = (timestamp: number) => {
    if (!timestamp) return '暂无数据';

    try {
      return `${formatDistanceToNow(timestamp, {
        locale: zhCN,
        addSuffix: true,
      })}更新`;
    } catch (error) {
      return '时间格式错误';
    }
  };

  // 处理星星数据，提取数字部分
  const extractStarCount = (starsText: string) => {
    if (!starsText) return '';

    // 如果包含"stars this week"，直接显示原始文本
    if (starsText.includes('stars this')) {
      return starsText;
    }

    // 否则只保留数字部分
    return starsText;
  };

  return (
    <Card className="w-full rounded-md overflow-hidden border-gray-800 bg-card">
      <CardHeader className="flex flex-row items-center justify-between bg-card py-3 px-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="text-blue-500">
            <BsGithub size={22} />
          </div>
          <CardTitle className="text-base font-medium text-white">
            GitHub
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {formatUpdateTime(updateTime)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing || isLoading}
            className="h-6 w-6 hover:bg-gray-700"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 text-gray-400 ${
                refreshing ? 'animate-spin' : ''
              }`}
            />
          </Button>
        </div>
      </CardHeader>

      <div className="flex px-4 py-2 gap-2 bg-card border-b border-gray-800">
        {Object.values(GITHUB_PERIOD).map((period) => (
          <Button
            key={period}
            variant={currentPeriod === period ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePeriodChange(period)}
            className={`text-xs h-7 px-3 ${
              currentPeriod === period
                ? 'bg-blue-600 hover:bg-blue-700 text-white border-none'
                : 'bg-transparent text-gray-400 hover:bg-gray-800 border-gray-700'
            }`}
          >
            {GITHUB_PERIOD_TEXT[period]}
          </Button>
        ))}
      </div>

      <CardContent className="px-4 py-3">
        {isLoading ? (
          <div className="space-y-3">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-full bg-gray-800" />
                  <Skeleton className="h-3 w-4/5 bg-gray-800" />
                  <Skeleton className="h-3 w-2/3 bg-gray-800" />
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-3">
            {repos.map((repo, index) => (
              <div key={index} className="space-y-1">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2"
                >
                  <span className="flex-shrink-0 text-sm font-medium text-orange-500">
                    {index + 1}
                  </span>
                  <span className="font-medium text-sm text-gray-200 hover:text-blue-400 line-clamp-1">
                    {repo.name}
                  </span>
                </a>
                {repo.desc && (
                  <p className="ml-6 text-xs text-gray-400 line-clamp-2">
                    {repo.desc}
                  </p>
                )}
                <div className="ml-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span className="text-yellow-500 flex items-center gap-1">
                    <AiOutlineStar size={12} />
                    {repo.stars}
                  </span>
                  <span className="text-gray-400 flex items-center gap-1">
                    <AiOutlineFork size={12} />
                    {repo.forks}
                  </span>
                  <span className="text-green-500 flex items-center gap-1">
                    <FaCode size={10} />
                    {repo.language}
                  </span>
                  <span className="text-orange-500 flex items-center gap-1">
                    <AiFillFire size={12} />本
                    {GITHUB_PERIOD_TEXT[currentPeriod].replace('榜', '')}: +
                    {currentPeriod === 'daily'
                      ? extractStarCount(repo.starsToday)
                      : currentPeriod === 'weekly'
                      ? extractStarCount(repo.starsThisWeek)
                      : extractStarCount(repo.starsThisMonth)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
