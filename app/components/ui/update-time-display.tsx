'use client';

import { useEffect, useState } from 'react';
import { formatUpdateTime } from '../../tools/format';

interface UpdateTimeDisplayProps {
  updateTime?: number;
  className?: string;
}

export function UpdateTimeDisplay({
  updateTime,
  className = '',
}: UpdateTimeDisplayProps) {
  const [formattedTime, setFormattedTime] = useState<string>(() =>
    formatUpdateTime(updateTime),
  );
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  // 每分钟更新一次显示的时间
  useEffect(() => {
    const timer = setInterval(() => {
      setForceUpdate((prev) => prev + 1);
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // 当updateTime或forceUpdate变化时重新格式化时间
  useEffect(() => {
    setFormattedTime(formatUpdateTime(updateTime));
  }, [updateTime, forceUpdate]);

  return (
    <span className={`text-muted-foreground text-sm ${className}`}>
      （{formattedTime}）
    </span>
  );
}
