'use client';

import { HotListCard } from '../ui/hot-list-card';
import { useHotList } from '../../lib/service-handle/useHotList';
import { HotItem, HotList } from '../../types/hot';

export function IthomeHotListCard() {
  const { data, loading, refresh } = useHotList<HotList>('ithome');

  return (
    <HotListCard
      title="IT之家热榜"
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
          className="text-green-600"
        >
          <path d="M18 8a6 6 0 0 0-6-6" />
          <path d="M18 8a6 6 0 0 1-6 6 6 6 0 0 1-6-6 6 6 0 0 1 6-6" />
          <path d="M6 8h12" />
          <path d="M12 14v8" />
          <path d="M9 18h6" />
        </svg>
      }
      loading={loading}
      updateTime={data.updateTime}
      onRefresh={refresh}
    >
      {data.list.map((article: HotItem, index: number) => (
        <div
          key={`${article.title}-${index}`}
          className="group rounded-md p-2 hover:bg-accent"
        >
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="flex items-start">
              <span className="mr-2 text-sm font-medium text-primary">
                {index + 1}.
              </span>
              <div>
                <h3 className="font-medium text-primary group-hover:text-primary-hover group-hover:underline">
                  {article.title}
                </h3>
                {article.desc && (
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {article.desc}
                  </p>
                )}
                <div className="mt-1 flex items-center text-xs text-muted-foreground">
                  <span className="ml-auto text-xs font-medium text-green-600">
                    {article.hot}
                  </span>
                </div>
              </div>
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
