'use client';

import { HotListCard } from '../ui/hot-list-card';
import { useHotList } from '../../lib/service-handle/useHotList';
import { GithubHostItem, GithubHostList } from '../../types/hot';
import { GITHUB_PERIOD, GITHUB_PERIOD_TEXT } from '../../constants/hotlist';
import { GithubIcon } from 'lucide-react';
import { Button } from '../ui/button';

export function GithubTrendingCard() {
  const { data, loading, period, refresh, changePeriod } =
    useHotList<GithubHostList>('github');

  // GitHub 热榜的筛选按钮
  const PeriodSwitcher = () => (
    <div className="ml-auto mr-1 flex space-x-1">
      <Button
        variant={period === GITHUB_PERIOD.DAILY ? 'default' : 'outline'}
        size="sm"
        className="h-7 text-xs"
        onClick={() => changePeriod(GITHUB_PERIOD.DAILY)}
      >
        {GITHUB_PERIOD_TEXT[GITHUB_PERIOD.DAILY]}
      </Button>
      <Button
        variant={period === GITHUB_PERIOD.WEEKLY ? 'default' : 'outline'}
        size="sm"
        className="h-7 text-xs"
        onClick={() => changePeriod(GITHUB_PERIOD.WEEKLY)}
      >
        {GITHUB_PERIOD_TEXT[GITHUB_PERIOD.WEEKLY]}
      </Button>
      <Button
        variant={period === GITHUB_PERIOD.MONTHLY ? 'default' : 'outline'}
        size="sm"
        className="h-7 text-xs"
        onClick={() => changePeriod(GITHUB_PERIOD.MONTHLY)}
      >
        {GITHUB_PERIOD_TEXT[GITHUB_PERIOD.MONTHLY]}
      </Button>
    </div>
  );

  return (
    <HotListCard
      title="GitHub 热榜"
      icon={<GithubIcon className="h-5 w-5 text-primary" />}
      headerAddon={<PeriodSwitcher />}
      loading={loading}
      updateTime={data.updateTime}
      onRefresh={refresh}
    >
      {data.list.map((repo: GithubHostItem, index: number) => (
        <div
          key={`${repo.name}-${index}`}
          className="group rounded-md p-2 hover:bg-accent"
        >
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2 text-sm font-medium text-primary">
                  {index + 1}.
                </span>
                <span className="font-medium text-primary group-hover:text-primary-hover group-hover:underline">
                  {repo.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  ★ {repo.stars}
                </span>
                {period === GITHUB_PERIOD.DAILY && (
                  <span className="text-xs text-green-500">
                    +{repo.starsToday}
                  </span>
                )}
                {period === GITHUB_PERIOD.WEEKLY && (
                  <span className="text-xs text-green-500">
                    +{repo.starsThisWeek}
                  </span>
                )}
                {period === GITHUB_PERIOD.MONTHLY && (
                  <span className="text-xs text-green-500">
                    +{repo.starsThisMonth}
                  </span>
                )}
              </div>
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {repo.desc}
            </p>
            <div className="mt-1 flex items-center">
              {repo.language && (
                <span className="mr-3 text-xs text-muted-foreground">
                  {repo.language}
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                Forks: {repo.forks}
              </span>
            </div>
          </a>
        </div>
      ))}
      {data.list.length === 0 && !loading && (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">暂无数据</p>
        </div>
      )}
    </HotListCard>
  );
}
