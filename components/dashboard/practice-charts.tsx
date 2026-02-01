// 练习统计图表组件 - 使用 Tremor 图表库
'use client';

import { useMemo } from 'react';
import { AreaChart, BarList } from '@tremor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePracticeRecords } from '@/lib/store';
import { usePracticeStats } from '@/lib/hooks/usePracticeStats';
import { Calendar, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/**
 * PracticeCharts 组件 - 展示练习数据可视化
 * 包含三个图表：
 * 1. 14天练习趋势图 (AreaChart)
 * 2. 段落分布图 (BarList)
 * 3. 30天练习热力图
 */
export function PracticeCharts() {
  const practiceRecords = usePracticeRecords();
  const { dailyStats, segmentDistribution, totalDuration } =
    usePracticeStats(practiceRecords);

  // ============================================
  // 1. 14天练习趋势数据准备
  // ============================================

  const trendData = useMemo(() => {
    // 生成最近14天的日期数组
    const today = new Date();
    const last14Days: Array<{ date: string; 练习时长: number }> = [];

    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

      // 查找当天的练习记录，转换为分钟
      const dayRecord = dailyStats.find((d) => d.date === dateStr);
      const minutes = dayRecord ? Math.round(dayRecord.duration / 60) : 0;

      // 格式化日期为 "M月d日"
      const formattedDate = `${date.getMonth() + 1}月${date.getDate()}日`;

      last14Days.push({
        date: formattedDate,
        练习时长: minutes,
      });
    }

    return last14Days;
  }, [dailyStats]);

  // ============================================
  // 2. 段落分布数据准备
  // ============================================

  const barListData = useMemo(() => {
    return segmentDistribution.map((segment) => ({
      name: segment.segmentName,
      value: Math.round(segment.duration / 60), // 转换为分钟
    }));
  }, [segmentDistribution]);

  // ============================================
  // 3. 35天热力图数据准备
  // ============================================

  const heatmapData = useMemo(() => {
    // 生成最近35天的数据（7列 x 5行）
    const today = new Date();
    const days: Array<
      Array<{
        date: string;
        duration: number;
        hasPractice: boolean;
        intensity: 'none' | 'low' | 'medium' | 'high';
      }>
    > = [];

    // 按行生成，每行7天（从右到左，符合日历习惯）
    for (let row = 0; row < 5; row++) {
      const weekData: typeof days[0] = [];
      for (let col = 6; col >= 0; col--) {
        const index = row * 7 + col;
        const date = new Date(today);
        date.setDate(date.getDate() - (34 - index));
        const dateStr = date.toISOString().split('T')[0];

        const dayRecord = dailyStats.find((d) => d.date === dateStr);
        const duration = dayRecord ? dayRecord.duration : 0;
        const minutes = Math.round(duration / 60);

        // 计算练习强度
        let intensity: 'none' | 'low' | 'medium' | 'high' = 'none';
        if (minutes > 0) {
          if (minutes < 2) intensity = 'low';
          else if (minutes < 5) intensity = 'medium';
          else intensity = 'high';
        }

        weekData.push({
          date: dateStr,
          duration: minutes,
          hasPractice: minutes > 0,
          intensity,
        });
      }
      days.push(weekData);
    }

    return days;
  }, [dailyStats]);

  // ============================================
  // 4. 空状态判断 + Y轴自适应计算
  // ============================================

  const hasData = practiceRecords.length > 0;

  // 计算Y轴最大值，确保至少有5分钟的显示范围，同时根据数据动态调整
  const maxDuration = useMemo(() => {
    const max = Math.max(...trendData.map(d => d.练习时长));
    // 如果最大值为0，默认显示5分钟
    if (max === 0) return 5;
    // 向上取整到最近的5的倍数，并增加一些留白
    return Math.ceil((max * 1.2) / 5) * 5;
  }, [trendData]);

  // 热力图颜色映射
  const getHeatmapColor = (intensity: typeof heatmapData[0][0]['intensity']) => {
    switch (intensity) {
      case 'none':
        return 'bg-secondary/30';
      case 'low':
        return 'bg-primary/30';
      case 'medium':
        return 'bg-primary/60';
      case 'high':
        return 'bg-primary';
      default:
        return 'bg-secondary/30';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* ==========================================
          14天练习趋势图
          ========================================== */}
      <div className="md:col-span-2">
        <Card className="h-full hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="w-4 h-4 text-primary" />
              14天练习趋势
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {hasData ? (
              <div className="h-[200px]">
                <AreaChart
                  data={trendData}
                  categories={['练习时长']}
                  index="date"
                  valueFormatter={(value: number) => `${value} 分钟`}
                  colors={['#0066FF']}
                  showLegend={false}
                  showGridLines={true}
                  showAnimation={true}
                  curveType="monotone"
                  yAxisWidth={60}
                  minValue={0}
                  maxValue={maxDuration}
                  className="h-full"
                />
              </div>
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>
      </div>

      {/* ==========================================
          段落分布图
          ========================================== */}
      <div className="md:col-span-1">
        <Card className="h-full hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              段落分布
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {hasData ? (
              <div className="h-[200px] overflow-auto">
                <BarList
                  data={barListData}
                  valueFormatter={(value: number) => `${value} 分钟`}
                  color="#0066FF"
                  showAnimation={true}
                  className="tremor-barlist"
                />
              </div>
            ) : (
              <EmptyState compact />
            )}
          </CardContent>
        </Card>
      </div>

      {/* ==========================================
          35天练习热力图
          ========================================== */}
      <div className="md:col-span-3">
        <Card className="hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="w-4 h-4 text-primary" />
              35天练习热力图
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasData ? (
              <div className="space-y-3">
                {/* 热力图网格 */}
                <div className="flex gap-1">
                  {heatmapData.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.map((day, dayIndex) => (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className={cn(
                            'w-8 h-8 rounded-md transition-all duration-200 hover:scale-110 cursor-pointer',
                            getHeatmapColor(day.intensity)
                          )}
                          title={`${day.date}: ${day.duration} 分钟`}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* 图例 */}
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span>少</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-sm bg-secondary/30" />
                    <div className="w-4 h-4 rounded-sm bg-primary/30" />
                    <div className="w-4 h-4 rounded-sm bg-primary/60" />
                    <div className="w-4 h-4 rounded-sm bg-primary" />
                  </div>
                  <span>多</span>
                </div>
              </div>
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * 空状态组件 - 当没有练习记录时显示
 */
function EmptyState({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'h-[200px]' : 'h-[200px]'
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-3">
        <Calendar className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium mb-1">还没有练习记录</p>
      <p className="text-xs text-muted-foreground mb-3">
        开始练习后，这里会显示你的进度
      </p>
      <Link href="/practice/script/full">
        <button className="text-xs text-primary hover:underline">
          开始练习 →
        </button>
      </Link>
    </div>
  );
}
