'use client';

import { HotListCard } from '../ui/hot-list-card';
import { useHotList } from '../../lib/service-handle/useHotList';
import { HotItem, HotList } from '../../types/hot';

export function WeiboHotListCard() {
  const { data, loading, refresh } = useHotList<HotList>('weibo');

  return (
    <HotListCard
      title="微博热搜"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-500"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      }
      loading={loading}
      updateTime={data.updateTime}
      onRefresh={refresh}
    >
      {data.list.map((topic: HotItem, index: number) => (
        <div
          key={`${topic.title}-${index}`}
          className="group rounded-md p-2 hover:bg-accent"
        >
          <a
            href={topic.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span
                  className={`mr-2 text-sm font-medium ${
                    index < 3 ? 'text-red-500' : 'text-primary'
                  }`}
                >
                  {index + 1}.
                </span>
                <span className="font-medium text-primary group-hover:text-primary-hover group-hover:underline">
                  {topic.title}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs font-medium text-orange-500">
                  {topic.hot}
                </span>
              </div>
            </div>
            {topic.desc && (
              <p className="mt-1 pl-5 text-xs text-muted-foreground line-clamp-1">
                {topic.desc}
              </p>
            )}
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
