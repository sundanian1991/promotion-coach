// 练习计划页面
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { practiceStages, getStageByDay, stageTypeDescriptions } from '@/lib/content';
import { useProgress, useStore } from '@/lib/store';
import { CheckCircle2, Circle, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';

export default function PracticePlanPage() {
  const progress = useProgress();
  const markDayCompleted = useStore((s) => s.markDayCompleted);
  const toggleTaskCompletion = useStore((s) => s.toggleTaskCompletion);
  // 直接从 progress 获取，避免 selector 创建新引用
  const completedTasks = progress.completedTasks ?? [];
  const [expandedStage, setExpandedStage] = useState('stage-1');

  // 计算每个阶段的进度
  const getStageProgress = (stageId: string) => {
    const stage = practiceStages.find((s) => s.id === stageId);
    if (!stage) return 0;

    const stageDays = stage.days;
    const completedInStage = stage.days.filter((day) =>
      progress.completedDays.includes(day)
    ).length;

    return Math.round((completedInStage / stageDays.length) * 100);
  };

  const totalCompleted = progress.completedDays.length;
  const totalDays = progress.totalDays;
  const overallProgress = Math.round((totalCompleted / totalDays) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">10-14天练习计划</h1>
        <p className="text-muted-foreground">
          系统化的练习计划，助你稳步提升
        </p>
      </div>

      {/* 整体进度 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              整体进度
            </CardTitle>
            <Badge variant="outline">
              第 {progress.currentDay} / {totalDays} 天
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>完成进度</span>
              <span className="font-semibold">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-4 gap-4 pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalCompleted}</div>
              <div className="text-xs text-muted-foreground">已完成</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">
                {totalDays - totalCompleted}
              </div>
              <div className="text-xs text-muted-foreground">剩余</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {progress.practiceStreak}
              </div>
              <div className="text-xs text-muted-foreground">连续天数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {progress.completedDays.length > 0 ? '✓' : '—'}
              </div>
              <div className="text-xs text-muted-foreground">开始状态</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 四个阶段 */}
      <div className="space-y-4">
        {practiceStages.map((stage) => {
          const stageProgress = getStageProgress(stage.id);
          const isExpanded = expandedStage === stage.id;

          return (
            <Card key={stage.id}>
              <CardHeader
                className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                  !isExpanded && 'pb-3'
                }`}
                onClick={() => setExpandedStage(isExpanded ? '' : stage.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{stage.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {stage.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">第 {stage.days[0]}-{stage.days[stage.days.length - 1]} 天</Badge>
                      <Badge variant="secondary">{stage.name}</Badge>
                    </div>
                  </div>
                  <div className="text-center min-w-[80px]">
                    <div className="text-2xl font-bold text-primary">
                      {stageProgress}%
                    </div>
                    <Progress value={stageProgress} className="h-1.5 mt-1" />
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted/50 text-sm">
                    <div className="font-medium mb-1">阶段重点</div>
                    <div className="text-muted-foreground">
                      {stageTypeDescriptions[stage.tasks[0].type]}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {stage.tasks.map((task) => {
                      const isTaskCompleted = completedTasks.includes(task.id);
                      const isCurrentDay = task.day === progress.currentDay;

                      return (
                        <div
                          key={task.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                            isCurrentDay
                              ? 'border-primary bg-primary/5'
                              : 'bg-card hover:bg-accent/50'
                          }`}
                        >
                          <Checkbox
                            id={task.id}
                            checked={isTaskCompleted}
                            onCheckedChange={() => toggleTaskCompletion(task.id)}
                            className="mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <label
                                htmlFor={task.id}
                                className={`font-medium text-sm cursor-pointer ${
                                  isTaskCompleted ? 'line-through text-muted-foreground' : ''
                                }`}
                              >
                                第{task.day}天：{task.title}
                              </label>
                              {isCurrentDay && (
                                <Badge variant="default" className="text-xs">
                                  当前
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {task.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {stage.id === 'stage-1' && (
                    <Link href="/practice/script/opening">
                      <Button variant="outline" className="w-full">
                        开始练习第1天内容
                      </Button>
                    </Link>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
