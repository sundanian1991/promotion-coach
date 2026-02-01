// 智能推荐提示组件 - Minimalist 黑白 + 蓝色点缀
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePracticeRecords } from '@/lib/store';
import { useWeaknessAnalysis } from '@/lib/hooks/useWeaknessAnalysis';
import { Lightbulb, TrendingDown, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/** 图标映射 */
const ICON_MAP = {
  segment: TrendingDown,
  frequency: AlertCircle,
  streak: Lightbulb,
} as const;

/** 优先级配置 */
const PRIORITY_CONFIG = {
  high: {
    label: '重要',
    className: 'text-destructive bg-destructive/10',
  },
  medium: {
    label: '建议',
    className: 'text-orange-600 bg-orange-100',
  },
  low: {
    label: '提示',
    className: 'text-primary bg-primary/10',
  },
} as const;

export function WeaknessTips() {
  const practiceRecords = usePracticeRecords();
  const { tips } = useWeaknessAnalysis(practiceRecords);

  // 最多显示 3 条建议
  const displayTips = tips.slice(0, 3);

  // 如果没有建议，显示空状态
  if (displayTips.length === 0) {
    return (
      <Card className="md:col-span-4 border-primary/20 hover-lift">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-primary" />
            </div>
            智能建议
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              暂无改进建议，继续保持！
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-4 border-primary/20 hover-lift">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          智能建议
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayTips.map((tip, index) => {
            const IconComponent = ICON_MAP[tip.type];
            const priorityConfig = PRIORITY_CONFIG[tip.priority];

            return (
              <div
                key={`${tip.type}-${index}`}
                className="group relative p-4 rounded-lg border bg-card hover:bg-secondary/50 transition-all duration-300 hover:shadow-md"
              >
                {/* 优先级徽章 */}
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant="secondary"
                    className={cn('text-xs', priorityConfig.className)}
                  >
                    {priorityConfig.label}
                  </Badge>
                </div>

                {/* 图标 + 标题 */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-4 h-4 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm leading-tight mb-1">
                      {tip.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {tip.description}
                    </p>
                  </div>
                </div>

                {/* 行动按钮 */}
                <Link href={tip.actionLink}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-8 text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  >
                    <span className="flex items-center gap-1.5">
                      {tip.action}
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </span>
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
