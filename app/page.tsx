// 首页仪表盘 - Minimalist 黑白 + 蓝色点缀
'use client';

import { CountdownCard } from '@/components/dashboard/countdown-card';
import { TodayTaskCard } from '@/components/dashboard/today-task-card';
import { ProgressRing } from '@/components/dashboard/progress-ring';
import { QuickLinks } from '@/components/dashboard/quick-links';
import { PracticeCharts } from '@/components/dashboard/practice-charts';
import { WeaknessTips } from '@/components/dashboard/weakness-tips';
import { ReportExport } from '@/components/dashboard/report-export';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePracticeRecords } from '@/lib/store';
import {
  Clock,
  ArrowRight,
  Play,
  Target,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const practiceRecords = usePracticeRecords();

  // 获取最近的练习记录
  const recentRecords = [...practiceRecords]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // 计算总练习时长
  const totalPracticeTime = practiceRecords.reduce((acc, r) => acc + r.duration, 0);
  const totalMinutes = Math.floor(totalPracticeTime / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const displayMinutes = totalHours > 0 ? `${totalHours}小时${totalMinutes % 60}分` : `${totalMinutes}分钟`;

  return (
    <div className="space-y-6">
      {/* Bento Grid 布局 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 倒计时 - 大卡片 */}
        <div className="md:col-span-2">
          <CountdownCard />
        </div>

        {/* 进度 */}
        <div className="md:col-span-1">
          <ProgressRing />
        </div>

        {/* 今日任务 */}
        <div className="md:col-span-1">
          <TodayTaskCard />
        </div>

        {/* 快速开始 - 大卡片 */}
        <div className="md:col-span-2">
          <Card className="h-full hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between h-full">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">快速开始</span>
                  </div>
                  <h3 className="text-xl font-semibold">开始完整练习</h3>
                  <p className="text-sm text-muted-foreground">
                    建议时长 8 分钟，从头到尾完整串讲
                  </p>
                </div>
                <Link href="/practice/script/full">
                  <Button size="lg" className="gap-2">
                    开始练习
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 练习统计 */}
        <div className="md:col-span-1">
          <Card className="h-full hover-lift group">
            <CardContent className="p-6 flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-6 h-6 text-foreground" />
              </div>
              <div className="text-2xl font-semibold">
                {displayMinutes}
              </div>
              <div className="text-sm text-muted-foreground mt-1">总练习时长</div>
            </CardContent>
          </Card>
        </div>

        {/* 练习次数 */}
        <div className="md:col-span-1">
          <Card className="h-full hover-lift group">
            <CardContent className="p-6 flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Target className="w-6 h-6 text-foreground" />
              </div>
              <div className="text-2xl font-semibold">
                {practiceRecords.length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">练习次数</div>
            </CardContent>
          </Card>
        </div>

        {/* 智能建议 - 占据整行 */}
        <div className="md:col-span-4">
          <WeaknessTips />
        </div>

        {/* 功能入口网格 */}
        <div className="md:col-span-4">
          <QuickLinks />
        </div>

        {/* 最近练习记录 + PDF导出 - 同一行对齐 */}
        <div className="md:col-span-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 最近练习记录 */}
            {recentRecords.length > 0 && (
              <Card className="h-[160px] hover-lift">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    最近练习
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {recentRecords.slice(0, 2).map((record, index) => (
                      <div
                        key={record.id}
                        className={cn(
                          'flex items-center justify-between py-2 px-3 rounded-lg border hover:bg-secondary/50 transition-colors'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center">
                            <span className="text-xs font-medium">
                              {record.segmentId === 'opening' && '开'}
                              {record.segmentId === 'upgrade1' && '一'}
                              {record.segmentId === 'upgrade2' && '二'}
                              {record.segmentId === 'upgrade3' && '三'}
                              {record.segmentId === 'summary' && '总'}
                              {record.segmentId === 'future' && '未'}
                              {record.segmentId === 'full' && '全'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {record.segmentId === 'opening' && '开场'}
                              {record.segmentId === 'upgrade1' && '升级一'}
                              {record.segmentId === 'upgrade2' && '升级二'}
                              {record.segmentId === 'upgrade3' && '升级三'}
                              {record.segmentId === 'summary' && '总结'}
                              {record.segmentId === 'future' && '未来'}
                              {record.segmentId === 'full' && '完整版'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(record.date).toLocaleDateString('zh-CN')}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">
                          {Math.floor(record.duration / 60)}:
                          {(record.duration % 60).toString().padStart(2, '0')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PDF 导出按钮 */}
            <ReportExport />
          </div>
        </div>

        {/* 练习统计图表 - 占据整个宽度 */}
        <div className="md:col-span-4">
          <PracticeCharts />
        </div>

      </div>
    </div>
  );
}
