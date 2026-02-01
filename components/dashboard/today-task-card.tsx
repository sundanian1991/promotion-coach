// 今日任务卡片 - Minimalist 黑白 + 蓝色点缀
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useProgress, useStore } from '@/lib/store';
import { getTasksByDay, getStageByDay } from '@/lib/content';
import { CheckCircle2, ClipboardList, ArrowRight, Target } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

export function TodayTaskCard() {
  const progress = useProgress();
  const markDayCompleted = useStore((s) => s.markDayCompleted);
  const toggleTaskCompletion = useStore((s) => s.toggleTaskCompletion);
  const currentDay = progress.currentDay;
  const rawTasks = getTasksByDay(currentDay);
  const stage = getStageByDay(currentDay);

  // 直接从 progress 获取，避免 selector 创建新引用
  const completedTasks = progress.completedTasks ?? [];

  // 根据store中的completedTasks更新任务的完成状态
  const tasks = useMemo(() => {
    return rawTasks.map((task) => ({
      ...task,
      completed: completedTasks.includes(task.id),
    }));
  }, [rawTasks, completedTasks]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const allCompleted = completedCount === totalCount && totalCount > 0;
  const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleToggleTask = (taskId: string) => {
    toggleTaskCompletion(taskId);
  };

  const handleCompleteDay = () => {
    markDayCompleted(currentDay);
  };

  if (!stage) {
    return null;
  }

  return (
    <Card className="h-full flex flex-col hover-lift">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
            今日任务
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            第 {currentDay} 天
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{stage.description}</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-3">
        {/* 进度指示器 - 圆形 */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              {/* 背景圆 */}
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-background"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className={cn(
                    'transition-all duration-1000',
                    allCompleted ? 'text-foreground' : 'text-primary'
                  )}
                  strokeDasharray={`${completionRate}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              {/* 中心图标 */}
              <div className="absolute inset-0 flex items-center justify-center">
                {allCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Target className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </div>
            </div>
            <div>
              <div className="font-medium text-sm">{completedCount}/{totalCount}</div>
              <div className="text-xs text-muted-foreground">已完成</div>
            </div>
          </div>
        </div>

        {/* 任务列表 */}
        <div className="space-y-2 flex-1">
          {tasks.length > 0 ? (
            tasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg border transition-all duration-200',
                  task.completed
                    ? 'bg-secondary/50 border-transparent'
                    : 'bg-card border-border hover:border-primary/30'
                )}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => handleToggleTask(task.id)}
                  className={cn(
                    'mt-0.5',
                    task.completed && 'border-foreground bg-foreground'
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-sm font-medium leading-tight truncate',
                      task.completed && 'line-through text-muted-foreground'
                    )}
                  >
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {task.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">今日没有安排任务</p>
            </div>
          )}
          {tasks.length > 3 && (
            <p className="text-xs text-center text-muted-foreground">
              还有 {tasks.length - 3} 个任务...
            </p>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 pt-1">
          <Link href="/practice" className="flex-1">
            <Button variant="outline" className="w-full group text-sm h-9">
              开始练习
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
          {allCompleted && (
            <Button onClick={handleCompleteDay} className="flex-1 text-sm h-9">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              完成打卡
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
