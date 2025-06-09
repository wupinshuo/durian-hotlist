'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import Image from 'next/image';
import Lunar from 'lunar-javascript';

// 获取日期时间信息
function getDateInfo() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekDay = weekDays[now.getDay()];

  // 农历计算
  const lunar = Lunar.Lunar.fromDate(now);
  const lunarMonth = lunar.getMonthInChinese();
  const lunarDay = lunar.getDayInChinese();

  return {
    dateStr: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
    weekDay: `星期${weekDay}`,
    lunarDay: `农历${lunarMonth}月${lunarDay}`,
  };
}

export function Header() {
  const [dateInfo, setDateInfo] = useState(getDateInfo());

  // 每秒更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setDateInfo(getDateInfo());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-10 w-full border-b border-gray-800 bg-card text-card-foreground py-2">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 relative mr-2">
            <Image
              src="/durian_logo.svg"
              alt="榴莲热榜"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <Link href="/" className="text-xl font-bold text-yellow-400">
              榴莲热榜
            </Link>
            <div className="text-xs text-gray-400">技术与资讯热榜聚合平台</div>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-400">
          {dateInfo.dateStr} {dateInfo.weekDay} {dateInfo.lunarDay}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
