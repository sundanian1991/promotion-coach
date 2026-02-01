// 倒计时卡片 - Minimalist 黑白 + 蓝色点缀
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDaysRemaining, useSettings, useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

// 格式化日期为 YYYY-MM-DD
function formatDatePicker(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 格式化日期字符串
function formatDateCN(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

export function CountdownCard() {
  const daysRemaining = useDaysRemaining();
  const settings = useSettings();
  const setInterviewDate = useStore((s) => s.setInterviewDate);
  const interviewDate = settings.interviewDate;
  const [displayDays, setDisplayDays] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (daysRemaining !== null && daysRemaining !== displayDays) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayDays(daysRemaining);
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [daysRemaining, displayDays]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterviewDate(e.target.value || null);
  };

  if (!interviewDate) {
    return (
      <Card className="h-full flex flex-col border-dashed border-2 hover:border-primary/50 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            设置述职日期
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              选择日期开始倒计时
            </p>
            <input
              type="date"
              onChange={handleDateChange}
              className="w-full px-4 py-3 border rounded-lg bg-background hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
              min={formatDatePicker(new Date())}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  const daysLeft = daysRemaining ?? 0;
  const urgencyLevel = daysLeft <= 3 ? 'urgent' : daysLeft <= 7 ? 'warning' : 'normal';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <span>述职倒计时</span>
          </CardTitle>
          <Badge
            variant={urgencyLevel === 'urgent' ? 'destructive' : 'secondary'}
            className={cn(
              'text-xs',
              urgencyLevel === 'warning' && 'bg-black text-white hover:bg-black'
            )}
          >
            {urgencyLevel === 'urgent' && <AlertCircle className="w-3 h-3 mr-1" />}
            {urgencyLevel === 'urgent' ? '紧急' : urgencyLevel === 'warning' ? '冲刺' : '准备中'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-center">
        <div className="text-center">
          {/* 天数数字 */}
          <div
            className={cn(
              'text-6xl font-semibold mb-1 tabular-nums tracking-tight transition-all duration-300',
              urgencyLevel === 'urgent' && 'text-destructive animate-heartbeat',
              isAnimating && 'scale-110 opacity-50'
            )}
          >
            {displayDays}
          </div>
          <div className="text-muted-foreground text-sm mb-4">天</div>

          {/* 日期标签 */}
          {interviewDate && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{formatDateCN(interviewDate)}</span>
            </div>
          )}

          {/* 状态提示 */}
          {urgencyLevel === 'urgent' && (
            <p className="mt-4 text-sm text-destructive font-medium">
              关键时刻，稳住心态
            </p>
          )}
          {urgencyLevel === 'warning' && (
            <p className="mt-4 text-sm text-muted-foreground font-medium">
              最后冲刺，全力以赴
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
