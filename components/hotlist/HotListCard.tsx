'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { HotItem } from '@/types/hot';
import { IconType } from 'react-icons';
import { AiFillFire } from 'react-icons/ai';
import { BsGithub } from 'react-icons/bs';
import { SiJuejin } from 'react-icons/si';
import { ImSinaWeibo } from 'react-icons/im';
import { FaBilibili } from 'react-icons/fa6';
import { RiInformationFill } from 'react-icons/ri';
import { MdOutlineSmartToy } from 'react-icons/md';

const PLATFORM_ICONS: Record<string, IconType> = {
  GitHub: BsGithub,
  掘金热榜: SiJuejin,
  微博热榜: ImSinaWeibo,
  B站热榜: FaBilibili,
  IT之家热榜: RiInformationFill,
  少数派热榜: MdOutlineSmartToy,
};

export interface HotListCardProps {
  title: string;
  items: HotItem[];
  isLoading: boolean;
  updateTime: number;
  onRefresh?: () => void;
  iconColor?: string;
}

export function HotListCard({
  title,
  items = [],
  isLoading = false,
  updateTime = 0,
  onRefresh,
  iconColor = '#4a9eff',
}: HotListCardProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (refreshing || !onRefresh) return;

    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
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

  const PlatformIcon = PLATFORM_ICONS[title] || AiFillFire;

  return (
    <Card className="w-full rounded-md overflow-hidden border-gray-800 bg-card">
      <CardHeader className="flex flex-row items-center justify-between bg-card py-3 px-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div style={{ color: iconColor }}>
            <PlatformIcon size={22} />
          </div>
          <CardTitle className="text-base font-medium text-white">
            {title}
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
      <CardContent className="px-4 py-3">
        {isLoading ? (
          <div className="space-y-3">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-full bg-gray-800" />
                  <Skeleton className="h-3 w-4/5 bg-gray-800" />
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="space-y-1">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2"
                >
                  <span className="flex-shrink-0 text-sm font-medium text-orange-500">
                    {index + 1}
                  </span>
                  <span className="font-medium text-sm text-gray-200 hover:text-blue-400 line-clamp-1">
                    {item.title}
                  </span>
                </a>
                {item.desc && (
                  <p className="ml-6 text-xs text-gray-400 line-clamp-2">
                    {item.desc}
                  </p>
                )}
                <div className="ml-6 flex flex-wrap items-center gap-2 text-xs">
                  {item.hot && (
                    <span className="text-orange-500 flex items-center gap-1">
                      <AiFillFire size={12} />
                      {item.hot}
                    </span>
                  )}
                  {item.author && (
                    <span className="text-gray-400">作者: {item.author}</span>
                  )}
                  {item.tag && (
                    <span className="text-gray-400">标签: {item.tag}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
