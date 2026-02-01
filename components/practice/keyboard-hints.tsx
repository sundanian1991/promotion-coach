'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 快捷键项
 */
export interface ShortcutHint {
  /** 快捷键显示文本 */
  key: string;
  /** 快捷键描述 */
  description: string;
}

/**
 * KeyboardHints 组件属性
 */
interface KeyboardHintsProps {
  /** 快捷键列表 */
  shortcuts: ShortcutHint[];
  /** 自定义类名 */
  className?: string;
}

/**
 * 快捷键提示组件
 *
 * 以卡片形式展示快捷键列表，帮助用户了解可用的快捷键操作。
 *
 * @example
 * ```tsx
 * <KeyboardHints
 *   shortcuts={[
 *     { key: 'Space', description: '播放/暂停' },
 *     { key: 'Ctrl+R', description: '重置' }
 *   ]}
 * />
 * ```
 */
export function KeyboardHints({ shortcuts, className }: KeyboardHintsProps) {
  return (
    <Card className={cn('w-fit', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Keyboard className="w-4 h-4" />
          快捷键
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              {/* 快捷键徽章 */}
              <kbd className="min-w-[60px] px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded-md text-center">
                {shortcut.key}
              </kbd>
              {/* 描述文字 */}
              <span className="text-muted-foreground">
                {shortcut.description}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
