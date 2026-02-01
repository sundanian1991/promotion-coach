// 进度环组件 - Minimalist 黑白 + 蓝色点缀
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProgress, useOverallProgress } from '@/lib/store';
import { TrendingUp, Calendar, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProgressRing() {
  const progress = useProgress();
  const actualProgress = useOverallProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const completedDays = progress.completedDays.length;
  const practiceStreak = progress.practiceStreak;

  // 进度条加载动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      // 数字递增动画
      const duration = 1000;
      const steps = 60;
      const increment = actualProgress / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= actualProgress) {
          setDisplayProgress(actualProgress);
          clearInterval(interval);
        } else {
          setDisplayProgress(Math.round(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, 300);

    return () => clearTimeout(timer);
  }, [actualProgress]);

  return (
    <Card className="h-full flex flex-col hover-lift">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          整体进度
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center space-y-4">
        {/* 进度条 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">完成进度</span>
            <span className={cn(
              'font-semibold text-xl tabular-nums transition-all duration-500',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}>
              {displayProgress}%
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground rounded-full transition-all duration-1000 ease-out"
              style={{
                width: isLoaded ? `${displayProgress}%` : '0%',
              }}
            />
          </div>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-2 gap-3">
          {/* 已完成天数 */}
          <div className="text-center p-3 rounded-lg bg-secondary">
            <div className="w-7 h-7 rounded-md bg-background flex items-center justify-center mb-2 mx-auto">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div className={cn(
              'text-2xl font-semibold tabular-nums transition-all duration-700',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}>
              {completedDays}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">已完成天数</div>
          </div>

          {/* 连续练习 */}
          <div className="text-center p-3 rounded-lg bg-secondary">
            <div className="w-7 h-7 rounded-md bg-background flex items-center justify-center mb-2 mx-auto">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div className={cn(
              'text-2xl font-semibold tabular-nums transition-all duration-700 delay-100',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}>
              {practiceStreak}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">连续练习</div>
          </div>
        </div>

        {/* 阶段指示器 */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>当前阶段</span>
            <span className="font-medium text-foreground">
              {completedDays === 0 ? '准备期' : completedDays < 3 ? '起步期' : completedDays < 7 ? '巩固期' : '冲刺期'}
            </span>
          </div>
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  'flex-1 h-1 rounded-full transition-all duration-500',
                  i < completedDays
                    ? 'bg-foreground'
                    : i === completedDays
                    ? 'bg-primary animate-pulse'
                    : 'bg-secondary'
                )}
                style={{
                  transitionDelay: `${i * 50}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
