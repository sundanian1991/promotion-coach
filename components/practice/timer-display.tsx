// 计时器组件
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AudioRecorder } from './audio-recorder';
import { KeyboardHints } from './keyboard-hints';
import { usePracticeShortcuts } from '@/lib/hooks/usePracticeShortcuts';

interface TimerDisplayProps {
  targetDuration?: number; // 目标时长（秒）
  onComplete?: () => void;
}

export function TimerDisplay({ targetDuration, onComplete }: TimerDisplayProps) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  // 用 ref 保存 onComplete，避免依赖变化导致 effect 重复执行
  const onCompleteRef = useRef(onComplete);

  // 同步最新的 onComplete 到 ref
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // 注册快捷键
  const { shortcuts } = usePracticeShortcuts({
    onTogglePlay: () => setIsRunning((prev) => !prev),
    onReset: () => {
      setIsRunning(false);
      setTime(0);
    },
    onNextSegment: undefined, // 可选：如果有下一段落功能
    onPrevSegment: undefined, // 可选：如果有上一段落功能
    onToggleFullscreen: undefined, // 可选：如果有全屏功能
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((t) => {
          const newTime = t + 1;
          if (targetDuration && newTime >= targetDuration) {
            setIsRunning(false);
            // 使用 ref 中的最新回调
            onCompleteRef.current?.();
            return newTime;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, targetDuration]); // 移除 onComplete 依赖

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggle = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTime(0);
  }, []);

  const isOverTime = targetDuration && time > targetDuration;
  const progress = targetDuration ? Math.min((time / targetDuration) * 100, 100) : 0;

  return (
    <div className="space-y-4">
      <Card className="w-fit">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* 时间显示 */}
            <div className="text-center min-w-[100px]">
              <div
                className={cn(
                  'text-4xl font-mono font-bold tabular-nums',
                  isOverTime && 'text-red-500'
                )}
              >
                {formatTime(time)}
              </div>
              {targetDuration && (
                <div className="text-xs text-muted-foreground mt-1">
                  目标: {formatTime(targetDuration)}
                </div>
              )}
            </div>

            {/* 进度条 */}
            {targetDuration && (
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-300',
                    isOverTime ? 'bg-red-500' : 'bg-primary'
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {/* 控制按钮 */}
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant={isRunning ? 'secondary' : 'default'}
                onClick={toggle}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button size="icon" variant="outline" onClick={reset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 录音组件 */}
      <AudioRecorder />

      {/* 快捷键提示 */}
      <KeyboardHints shortcuts={shortcuts} className="w-fit" />
    </div>
  );
}
