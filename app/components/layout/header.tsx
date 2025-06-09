'use client';

import { ThemeToggle } from '../ui/theme-toggle';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, User } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/durian_logo.svg"
              alt="榴莲热榜"
              width={40}
              height={40}
              className="transition-all duration-300 hover:rotate-12"
            />
            <span className="text-xl font-bold">榴莲热榜</span>
          </Link>
        </div>

        <nav className="flex items-center space-x-4">
          <Link
            href="/"
            className={cn(
              'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
              pathname === '/'
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground',
            )}
          >
            <Home className="h-4 w-4" />
            <span>首页</span>
          </Link>
          <Link
            href="/login"
            className={cn(
              'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
              pathname === '/login'
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground',
            )}
          >
            <User className="h-4 w-4" />
            <span>登录</span>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
