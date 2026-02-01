// 逐字稿练习页面
'use client';

import { useParams, useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { ScriptViewer } from '@/components/practice/script-viewer';
import { TimerDisplay } from '@/components/practice/timer-display';
import { useSettings, useStore } from '@/lib/store';
import { useSegment, useNextSegment, usePrevSegment, useScriptSegments } from '@/lib/hooks/useScript';
import { useState, useCallback } from 'react';
import { usePracticeRecords } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ScriptPracticePage() {
  const params = useParams();
  const router = useRouter();
  const segmentId = params.id as string;
  const settings = useSettings();
  const preferredVersion = settings.preferredVersion || 'full';
  const [version, setVersion] = useState<'full' | 'skeleton'>(preferredVersion);
  const addPracticeRecord = useStore((s) => s.addPracticeRecord);

  const segment = useSegment(segmentId);
  const nextSegment = useNextSegment(segmentId);
  const prevSegment = usePrevSegment(segmentId);
  const allSegments = useScriptSegments();

  if (!segment) {
    notFound();
  }

  // 用 useCallback 包裹，避免每次渲染创建新函数导致无限循环
  const handleComplete = useCallback(() => {
    // 记录练习
    addPracticeRecord({
      date: new Date().toISOString(),
      segmentId: segment.id,
      duration: segment.duration,
      notes: '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment.id, segment.duration, addPracticeRecord]);

  // 完整练习特殊处理
  if (segmentId === 'full') {
    return (
      <div className="space-y-6">
        <div>
          <button
            onClick={() => router.back()}
            className="text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            ← 返回
          </button>
          <h1 className="text-3xl font-bold tracking-tight">完整练习</h1>
          <p className="text-muted-foreground">
            从头到尾完整练习一遍，建议时长 8 分钟
          </p>
        </div>

        <TimerDisplay targetDuration={480} onComplete={handleComplete} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>完整版</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed">
                {allSegments.map(s => s.fullContent).join('\n\n---\n\n')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>骨架版</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed">
                {allSegments.map(s => s.skeletonContent).join('\n\n---\n\n')}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => router.push('/practice')}
          className="text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          ← 返回练习
        </button>
        <h1 className="text-3xl font-bold tracking-tight">{segment.title}</h1>
      </div>

      <TimerDisplay targetDuration={segment.duration} onComplete={handleComplete} />

      <ScriptViewer
        segment={segment}
        version={version}
        onVersionChange={setVersion}
        prevSegment={prevSegment}
        nextSegment={nextSegment}
      />
    </div>
  );
}
