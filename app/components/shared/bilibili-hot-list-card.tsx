'use client';

import { HotListCard } from '../ui/hot-list-card';
import { useHotList } from '../../lib/service-handle/useHotList';
import { HotItem, HotList } from '../../types/hot';

export function BilibiliHotListCard() {
  const { data, loading, refresh } = useHotList<HotList>('bilibili');

  return (
    <HotListCard
      title="B站热榜"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="text-primary"
        >
          <path
            d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"
            fill="#FF5C7C"
          />
        </svg>
      }
      loading={loading}
      updateTime={data.updateTime}
      onRefresh={refresh}
    >
      {data.list.map((video: HotItem, index: number) => (
        <div
          key={`${video.title}-${index}`}
          className="group rounded-md p-2 hover:bg-accent"
        >
          <a
            href={video.url}
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
                  {video.title}
                </h3>
                <div className="mt-1 flex items-center text-xs text-muted-foreground">
                  {video.author && (
                    <span className="mr-2">UP: {video.author}</span>
                  )}
                  <span className="ml-auto text-xs font-medium text-pink-500">
                    {video.hot}
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
