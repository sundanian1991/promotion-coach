// 快速入口 - Minimalist 黑白 + 蓝色点缀
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FileText, MessageSquare, CheckSquare, BookOpen, Brain, Zap, ArrowUpRight } from 'lucide-react';

const quickLinks = [
  {
    href: '/practice',
    label: '逐字稿',
    icon: FileText,
    desc: '分段练习',
  },
  {
    href: '/qa',
    label: '问答库',
    icon: MessageSquare,
    desc: '模拟评委',
  },
  {
    href: '/mindset',
    label: '心理建设',
    icon: Brain,
    desc: '呼吸放松',
  },
  {
    href: '/checklist',
    label: '检查清单',
    icon: CheckSquare,
    desc: '准备事项',
  },
  {
    href: '/field-guide',
    label: '应对指南',
    icon: Zap,
    desc: '场景策略',
  },
  {
    href: '/quick-ref',
    label: '快速参考',
    icon: BookOpen,
    desc: '模板话术',
  },
];

export function QuickLinks() {
  return (
    <Card className="hover-lift">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">快速入口</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'group flex flex-col items-center p-3 rounded-xl',
                  'border bg-card hover:border-primary/30 hover:bg-secondary/30',
                  'transition-all duration-200 hover:-translate-y-0.5'
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-0.5">
                  <span className="font-medium text-xs">{link.label}</span>
                  <ArrowUpRight className="w-2.5 h-2.5 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </div>
                <span className="text-[10px] text-muted-foreground">{link.desc}</span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
