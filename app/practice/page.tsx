// 练习主页
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useScriptSegments, useIsCustomScript } from '@/lib/hooks/useScript';
import { ScriptImport } from '@/components/script/script-import';
import { Clock, BookOpen, FileUp, Sparkles } from 'lucide-react';

export default function PracticePage() {
  const segments = useScriptSegments();
  const isCustomScript = useIsCustomScript();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          练习模式
          {isCustomScript && (
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              自定义讲稿
            </Badge>
          )}
        </h1>
        <p className="text-muted-foreground">
          {isCustomScript ? '正在使用您导入的自定义讲稿' : '选择段落开始练习，或导入自己的讲稿'}
        </p>
      </div>

      {/* 讲稿导入 - 当没有自定义讲稿时显示 */}
      <ScriptImport />

      {/* 快速入口 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/practice/script/full">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                完整练习
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                从头到尾完整练习一遍，适合整体串讲
              </p>
              <Button variant="outline" className="w-full">
                开始完整练习
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/practice/plan">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                练习计划
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                查看10-14天详细练习计划，跟踪进度
              </p>
              <Button variant="outline" className="w-full">
                查看计划
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 分段练习 */}
      <Card>
        <CardHeader>
          <CardTitle>分段练习</CardTitle>
          <p className="text-sm text-muted-foreground">
            按段落逐个击破，每个部分都有完整版和骨架版
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {segments.map((segment) => {
              const formatTime = (seconds: number) => {
                const mins = Math.floor(seconds / 60);
                const secs = seconds % 60;
                return `${mins}:${secs.toString().padStart(2, '0')}`;
              };

              return (
                <Link key={segment.id} href={`/practice/script/${segment.id}`}>
                  <div className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{segment.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {formatTime(segment.duration)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {segment.keyPoints[0]}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
