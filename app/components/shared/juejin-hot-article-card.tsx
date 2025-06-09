'use client';

import { HotListCard } from '../ui/hot-list-card';
import { useHotList } from '../../lib/service-handle/useHotList';
import { HotItem, HotList } from '../../types/hot';

export function JuejinHotArticleCard() {
  const { data, loading, refresh } = useHotList<HotList>('juejin');

  return (
    <HotListCard
      title="掘金热榜"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 28 28"
          fill="none"
          className="text-primary"
          stroke="currentColor"
          style={{ color: '#1E80FF' }}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.9933 0L27.9867 8V20L13.9933 28L0 20V8L13.9933 0Z"
            fill="currentColor"
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
            <div className="flex items-start justify-between">
              <div className="flex">
                <span className="mr-2 text-sm font-medium text-primary">
                  {index + 1}.
                </span>
                <div className="flex-1">
                  <h3 className="font-medium text-primary group-hover:text-primary-hover group-hover:underline">
                    {article.title}
                  </h3>
                  {article.desc && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {article.desc}
                    </p>
                  )}
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    {article.author && (
                      <span className="mr-2">{article.author}</span>
                    )}
                    <span className="ml-auto text-xs font-medium text-orange-500">
                      {article.hot}
                    </span>
                  </div>
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
