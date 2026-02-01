// 顶部导航组件 - Minimalist 黑白 + 蓝色点缀
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useDaysRemaining, useSettings } from '@/lib/store';
import { LayoutDashboard, FileText, MessageCircle, Brain, Zap, CheckSquare, BookOpen, Award, Clock } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/theme-toggle';

const navItems = [
  { href: '/', label: '首页', icon: LayoutDashboard },
  { href: '/practice', label: '练习', icon: FileText },
  { href: '/qa', label: '问答', icon: MessageCircle },
  { href: '/mindset', label: '心态', icon: Brain },
  { href: '/field-guide', label: '应对', icon: Zap },
  { href: '/checklist', label: '清单', icon: CheckSquare },
  { href: '/quick-ref', label: '参考', icon: BookOpen },
];

export function Header() {
  const pathname = usePathname();
  const daysRemaining = useDaysRemaining();
  const settings = useSettings();
  const interviewDate = settings.interviewDate;

  // 计算 urgency 级别
  const urgencyLevel =
    daysRemaining !== null
      ? daysRemaining <= 3
        ? 'urgent'
        : daysRemaining <= 7
        ? 'warning'
        : 'normal'
      : null;

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <span>述职辅导</span>
          </Link>

          {/* 导航 */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors',
                    isActive
                      ? 'bg-secondary text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 右侧信息 */}
        <div className="flex items-center gap-4">
          {daysRemaining !== null && (
            <div
              className={cn(
                'hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm',
                urgencyLevel === 'urgent' && 'bg-destructive/10 text-destructive',
                urgencyLevel === 'warning' && 'bg-secondary text-foreground',
                urgencyLevel === 'normal' && 'bg-secondary text-muted-foreground'
              )}
            >
              <Clock className="w-3.5 h-3.5" />
              <span className={cn(
                'font-medium tabular-nums',
                urgencyLevel === 'urgent' && 'animate-heartbeat'
              )}>
                {daysRemaining}
              </span>
              <span>天</span>
            </div>
          )}
          {!interviewDate && (
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              设置日期
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
