// 逐字稿查看器组件
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, BookOpen, Lightbulb, Edit3, Save, RotateCcw } from 'lucide-react';
import { ScriptSegment } from '@/types';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ScriptViewerProps {
  segment: ScriptSegment;
  version: 'full' | 'skeleton';
  onVersionChange: (version: 'full' | 'skeleton') => void;
  prevSegment?: ScriptSegment;
  nextSegment?: ScriptSegment;
}

export function ScriptViewer({
  segment,
  version,
  onVersionChange,
  prevSegment,
  nextSegment,
}: ScriptViewerProps) {
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // 获取自定义内容相关
  const customContent = useStore((s) => s.customContent);
  const saveCustomContent = useStore((s) => s.saveCustomContent);
  const resetCustomContent = useStore((s) => s.resetCustomContent);

  // 获取当前内容（优先使用自定义内容）
  const content = useMemo(() => {
    const custom = customContent[segment.id];
    if (custom && custom[version]) {
      return custom[version];
    }
    return version === 'full' ? segment.fullContent : segment.skeletonContent;
  }, [segment.id, segment.fullContent, segment.skeletonContent, version, customContent]);

  const hasCustomContent = customContent[segment.id]?.[version] !== undefined;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveContent = (newContent: string) => {
    saveCustomContent(segment.id, version, newContent);
  };

  const handleResetContent = () => {
    resetCustomContent(segment.id);
  };

  return (
    <div className="space-y-4">
      {/* 版本切换和工具栏 */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <ToggleGroup
            type="single"
            value={version}
            onValueChange={(v) => onVersionChange(v as 'full' | 'skeleton')}
          >
            <ToggleGroupItem value="full" aria-label="完整版">
              <BookOpen className="w-4 h-4 mr-2" />
              完整版
            </ToggleGroupItem>
            <ToggleGroupItem value="skeleton" aria-label="骨架版">
              <Lightbulb className="w-4 h-4 mr-2" />
              骨架版
            </ToggleGroupItem>
          </ToggleGroup>
          <Badge variant="outline">建议时长: {formatTime(segment.duration)}</Badge>
          {hasCustomContent && !isEditMode && (
            <Badge variant="secondary" className="text-xs">已自定义</Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isEditMode ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetContent}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                恢复原版
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsEditMode(false)}
              >
                <Save className="w-4 h-4 mr-1" />
                完成
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotes(!showNotes)}
              >
                {showNotes ? '隐藏' : '显示'}笔记
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditMode(true)}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                编辑内容
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 笔记输入 */}
      {showNotes && !isEditMode && (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-2">
              <Label htmlFor="notes">练习笔记</Label>
              <Textarea
                id="notes"
                placeholder="记录你的练习心得、需要注意的地方..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 逐字稿内容 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{segment.title}</span>
            {segment.transition && !isEditMode && (
              <Badge variant="secondary" className="text-xs">
                {segment.transition}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditMode ? (
            <Textarea
              value={content}
              onChange={(e) => handleSaveContent(e.target.value)}
              className="min-h-[500px] font-mono text-sm leading-relaxed whitespace-pre-wrap"
              placeholder="在这里编辑内容..."
            />
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="whitespace-pre-wrap leading-relaxed text-lg">
                {content}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* 关键点提示 - 编辑模式下隐藏 */}
      {!isEditMode && segment.keyPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              关键点提示
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {segment.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 关键数据 - 编辑模式下隐藏 */}
      {!isEditMode && segment.dataPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">关键数据</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {segment.dataPoints.map((data, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-3 rounded-lg border bg-card',
                    data.highlight && 'border-primary bg-primary/5'
                  )}
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {data.label}
                  </div>
                  <div className={cn(
                    'font-bold',
                    data.highlight && 'text-primary text-lg'
                  )}>
                    {data.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 导航按钮 */}
      <div className="flex items-center justify-between">
        {prevSegment ? (
          <Link href={`/practice/script/${prevSegment.id}`}>
            <Button variant="outline" disabled={isEditMode}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              {prevSegment.title}
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {nextSegment ? (
          <Link href={`/practice/script/${nextSegment.id}`}>
            <Button disabled={isEditMode}>
              {nextSegment.title}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        ) : (
          <Link href="/practice">
            <Button disabled={isEditMode}>返回练习主页</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
