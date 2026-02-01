/**
 * 练习数据统计 Hook
 * 用于处理练习记录数据，生成统计数据
 */

import { useMemo } from 'react';
import type { PracticeRecord } from '@/types';

// ============================================
// 类型定义
// ============================================

/** 每日统计数据 */
export interface DailyStat {
  date: string;
  duration: number; // 该日总练习时长（秒）
  count: number; // 该日练习次数
}

/** 段落统计数据 */
export interface SegmentStat {
  segmentId: string;
  segmentName: string;
  duration: number; // 该段落总练习时长（秒）
  count: number; // 该段落练习次数
  percentage: number; // 占总时长的百分比
}

// ============================================
// 常量定义
// ============================================

/** 段落 ID 到中文名称的映射 */
const SEGMENT_NAMES: Record<string, string> = {
  opening: '开场',
  upgrade1: '升级一',
  upgrade2: '升级二',
  upgrade3: '升级三',
  summary: '总结',
  future: '未来',
  full: '完整版',
};

// ============================================
// Hook 实现
// ============================================

export function usePracticeStats(records: PracticeRecord[]): {
  dailyStats: DailyStat[];
  segmentDistribution: SegmentStat[];
  totalDuration: number;
} {
  // 使用 useMemo 优化性能，仅在 records 变化时重新计算
  const stats = useMemo(() => {
    // 空记录时返回默认值
    if (records.length === 0) {
      return {
        dailyStats: [],
        segmentDistribution: [],
        totalDuration: 0,
      };
    }

    // ==========================================
    // 1. 计算每日统计
    // ==========================================

    const dailyMap = new Map<string, { duration: number; count: number }>();

    records.forEach((record) => {
      const existing = dailyMap.get(record.date) || { duration: 0, count: 0 };
      dailyMap.set(record.date, {
        duration: existing.duration + record.duration,
        count: existing.count + 1,
      });
    });

    // 转换为数组并按日期升序排序
    const dailyStats: DailyStat[] = Array.from(dailyMap.entries())
      .map(([date, stats]) => ({
        date,
        duration: stats.duration,
        count: stats.count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // ==========================================
    // 2. 计算段落分布
    // ==========================================

    const segmentMap = new Map<string, { duration: number; count: number }>();
    let totalDuration = 0;

    records.forEach((record) => {
      const existing = segmentMap.get(record.segmentId) || {
        duration: 0,
        count: 0,
      };
      segmentMap.set(record.segmentId, {
        duration: existing.duration + record.duration,
        count: existing.count + 1,
      });
      totalDuration += record.duration;
    });

    // 转换为数组并按练习时长降序排序
    const segmentDistribution: SegmentStat[] = Array.from(
      segmentMap.entries()
    )
      .map(([segmentId, stats]) => ({
        segmentId,
        segmentName: SEGMENT_NAMES[segmentId] || segmentId, // 未知段落使用原始 ID
        duration: stats.duration,
        count: stats.count,
        percentage:
          totalDuration > 0
            ? Math.round((stats.duration / totalDuration) * 1000) / 10 // 保留一位小数
            : 0,
      }))
      .sort((a, b) => b.duration - a.duration);

    return {
      dailyStats,
      segmentDistribution,
      totalDuration,
    };
  }, [records]);

  return stats;
}
