// 移动端底部导航
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, MessageCircle, Brain, CheckSquare } from 'lucide-react';

const mobileNavItems = [
  { href: '/', label: '首页', icon: LayoutDashboard },
  { href: '/practice', label: '练习', icon: FileText },
  { href: '/qa', label: '问答', icon: MessageCircle },
  { href: '/mindset', label: '心态', icon: Brain },
  { href: '/checklist', label: '清单', icon: CheckSquare },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden z-50">
      <div className="flex items-center justify-around h-16">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
                pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
