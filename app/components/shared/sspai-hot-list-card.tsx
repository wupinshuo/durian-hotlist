'use client';

import { HotListCard } from '../ui/hot-list-card';
import { useHotList } from '../../lib/service-handle/useHotList';
import { HotItem, HotList } from '../../types/hot';

export function SspaiHotListCard() {
  const { data, loading, refresh } = useHotList<HotList>('sspai');

  return (
    <HotListCard
      title="少数派热榜"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 1024 1024"
          fill="none"
        >
          <path
            d="M512 0C229.2 0 0 229.2 0 512s229.2 512 512 512 512-229.2 512-512S794.8 0 512 0zm295.4 414.8H561.9v56.7h169.9c-27 92.3-112.4 159.6-214.5 159.6-123 0-222.6-99.6-222.6-222.6S394.3 186 517.3 186c82.7 0 154.9 45.2 193.3 112.2L778 255.5C724.9 159.3 628.1 96.1 517.3 96.1c-172.4 0-312.5 140.1-312.5 312.5S344.9 721.1 517.3 721.1c144.6 0 266.1-98.7 301.1-232.4 4.1-15.7 6.6-31.9 7.5-48.2.5-8.4.8-16.9.8-25.6h-19.3v-.1z"
            fill="#ca4b3c"
          />
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
                <div className="mt-1 flex items-center text-xs text-muted-foreground">
                  {article.author && (
                    <span className="mr-2">{article.author}</span>
                  )}
                  <span className="ml-auto text-xs font-medium text-red-500">
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
