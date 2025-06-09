'use client';

import { ReactNode, useState } from 'react';
import { Card, CardHeader, CardContent } from './card';
import { Button } from './button';
import { Skeleton } from './skeleton';
import { RefreshCw } from 'lucide-react';
import { UpdateTimeDisplay } from './update-time-display';

export interface HotListCardProps {
  title: string;
  icon?: ReactNode;
  headerAddon?: ReactNode;
  loading?: boolean;
  updateTime?: number;
  onRefresh?: () => void;
  children: ReactNode;
  className?: string;
}

export function HotListCard({
  title,
  icon,
  headerAddon,
  loading = false,
  updateTime,
  onRefresh,
  children,
  className = '',
}: HotListCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  return (
    <Card
      className={`w-full max-w-xs overflow-hidden transition-all duration-300 hover:shadow-md dark:hover:shadow-gray-800 ${className}`}
    >
      <CardHeader className="flex flex-row items-center space-x-2 pb-2 pt-4">
        {icon && <span className="flex items-center">{icon}</span>}
        <h3 className="text-lg font-bold text-primary">{title}</h3>
        <UpdateTimeDisplay updateTime={updateTime} />
        {headerAddon}
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${
              isRefreshing ? 'animate-spin' : 'hover:bg-muted'
            }`}
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="刷新"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[320px] overflow-y-auto px-4 pb-4 pt-0">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <div className="space-y-1">{children}</div>
        )}
      </CardContent>
    </Card>
  );
}
