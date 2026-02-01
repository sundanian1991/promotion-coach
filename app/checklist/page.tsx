// 检查清单页面
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  checklistItems,
  getChecklistByPhase,
  phaseNames,
  phaseDescriptions,
} from '@/lib/content';
import { useChecklists, useStore } from '@/lib/store';
import type { ChecklistPhase } from '@/types';
import { RotateCcw } from 'lucide-react';

const phases: ChecklistPhase[] = [
  'preOneDay',
  'pre30min',
  'pre5min',
  'duringSelf',
  'duringQA',
  'post',
];

export default function ChecklistPage() {
  const checklists = useChecklists();
  const toggleChecklistItem = useStore((s) => s.toggleChecklistItem);
  const resetChecklistPhase = useStore((s) => s.resetChecklistPhase);
  const [activePhase, setActivePhase] = useState<ChecklistPhase>('preOneDay');

  const currentItems = getChecklistByPhase(activePhase);
  const currentChecks = checklists[activePhase];
  const completedCount = currentChecks.filter((c) => c).length;
  const totalCount = currentChecks.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">述职检查清单</h1>
        <p className="text-muted-foreground">
          述职当天必备检查项，确保万无一失
        </p>
      </div>

      {/* 阶段选择 */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          {phases.map((phase) => {
            const items = getChecklistByPhase(phase);
            const checks = checklists[phase];
            const completed = checks.filter((c) => c).length;
            const total = checks.length;
            const isComplete = completed === total;

            return (
              <button
                key={phase}
                onClick={() => setActivePhase(phase)}
                className={`shrink-0 px-4 py-2 rounded-lg border transition-colors ${
                  activePhase === phase
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card hover:bg-accent'
                }`}
              >
                <div className="text-sm font-medium">{phaseNames[phase]}</div>
                <div className="text-xs opacity-70">
                  {completed}/{total}
                  {isComplete && ' ✓'}
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* 当前阶段清单 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{phaseNames[activePhase]}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {phaseDescriptions[activePhase]}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {completedCount}/{totalCount}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => resetChecklistPhase(activePhase)}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentItems.map((item, index) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  id={item.id}
                  checked={currentChecks[index]}
                  onCheckedChange={() => toggleChecklistItem(activePhase, index)}
                  className="mt-0.5"
                />
                <label
                  htmlFor={item.id}
                  className={`text-sm leading-none cursor-pointer flex-1 ${
                    currentChecks[index]
                      ? 'line-through text-muted-foreground'
                      : ''
                  }`}
                >
                  {item.text}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 全局进度 */}
      <Card>
        <CardHeader>
          <CardTitle>整体完成进度</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {phases.map((phase) => {
              const items = getChecklistByPhase(phase);
              const checks = checklists[phase];
              const completed = checks.filter((c) => c).length;
              const total = checks.length;
              const progress = Math.round((completed / total) * 100);

              return (
                <div
                  key={phase}
                  className="p-3 rounded-lg border bg-card text-center"
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {phaseNames[phase].split(' ')[0]}
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {progress}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {completed}/{total}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
