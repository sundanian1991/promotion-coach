/**
 * 薄弱环节分析 Hook
 * 分析练习记录并提供智能改进建议
 */

import { useMemo } from 'react';
import type { PracticeRecord } from '@/types';

// ============================================
// 类型定义
// ============================================

/** 建议类型 */
export type WeaknessTipType = 'segment' | 'frequency' | 'streak';

/** 优先级 */
export type TipPriority = 'high' | 'medium' | 'low';

/** 改进建议 */
export interface WeaknessTip {
  type: WeaknessTipType;
  priority: TipPriority;
  title: string;
  description: string;
  action: string;
  actionLink: string;
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

/** 优先级权重（用于排序） */
const PRIORITY_WEIGHT: Record<TipPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

// ============================================
// 辅助函数
// ============================================

/**
 * 获取今天的日期字符串（YYYY-MM-DD）
 */
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * 获取昨天的日期字符串（YYYY-MM-DD）
 */
function getYesterdayDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
}

/**
 * 获取过去7天的日期列表
 */
function getLast7Days(): string[] {
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

// ============================================
// 分析函数
// ============================================

/**
 * 分析1: 练习最少的段落
 * 找出练习次数最少的段落，如果少于3次，生成建议
 */
function analyzeSegmentPractice(records: PracticeRecord[]): WeaknessTip | null {
  // 统计每个段落的练习次数
  const segmentCountMap = new Map<string, number>();
  records.forEach((record) => {
    const count = segmentCountMap.get(record.segmentId) || 0;
    segmentCountMap.set(record.segmentId, count + 1);
  });

  // 找出练习次数最少的段落
  let minSegmentId: string | null = null;
  let minCount = Infinity;

  segmentCountMap.forEach((count, segmentId) => {
    if (count < minCount) {
      minCount = count;
      minSegmentId = segmentId;
    }
  });

  // 如果没有记录或最少练习次数 >= 3，不生成建议
  if (!minSegmentId || minCount >= 3) {
    return null;
  }

  const segmentName = SEGMENT_NAMES[minSegmentId] || minSegmentId;

  return {
    type: 'segment',
    priority: 'high',
    title: `加强${segmentName}练习`,
    description: `你练习"${segmentName}"仅${minCount}次，建议增加到3次以上以熟悉内容`,
    action: `前往练习${segmentName}`,
    actionLink: `/practice/script/${minSegmentId}`,
  };
}

/**
 * 分析2: 练习频率不足
 * 检查过去7天的练习天数，如果少于4天，生成建议
 */
function analyzePracticeFrequency(records: PracticeRecord[]): WeaknessTip | null {
  // 获取过去7天的日期集合
  const last7Days = getLast7Days();
  const last7DaysSet = new Set(last7Days);

  // 统计过去7天的练习天数
  const practiceDays = new Set<string>();
  records.forEach((record) => {
    if (last7DaysSet.has(record.date)) {
      practiceDays.add(record.date);
    }
  });

  // 如果练习天数 >= 4，不生成建议
  if (practiceDays.size >= 4) {
    return null;
  }

  return {
    type: 'frequency',
    priority: 'high',
    title: '增加练习频率',
    description: `过去7天仅练习${practiceDays.size}天，建议每周至少练习4天保持手感`,
    action: '开始今日练习',
    actionLink: '/practice',
  };
}

/**
 * 分析3: 连续练习中断
 * 昨天练习了，今天还没练习
 */
function analyzeStreak(records: PracticeRecord[]): WeaknessTip | null {
  const today = getTodayDate();
  const yesterday = getYesterdayDate();

  // 检查昨天是否练习
  const hasYesterdayPractice = records.some((r) => r.date === yesterday);

  // 如果昨天没练习，不生成建议
  if (!hasYesterdayPractice) {
    return null;
  }

  // 检查今天是否已练习
  const hasTodayPractice = records.some((r) => r.date === today);

  // 如果今天已练习，不生成建议
  if (hasTodayPractice) {
    return null;
  }

  return {
    type: 'streak',
    priority: 'medium',
    title: '保持练习连续性',
    description: '你昨天练习了，今天也来继续吧！连续练习效果更好',
    action: '继续练习',
    actionLink: '/practice',
  };
}

/**
 * 分析4: 单次练习时长不足
 * 最近5次练习平均时长少于3分钟
 */
function analyzePracticeDuration(records: PracticeRecord[]): WeaknessTip | null {
  // 练习记录少于5次，不分析
  if (records.length < 5) {
    return null;
  }

  // 获取最近5次练习记录（按日期排序，假设记录本身是按时间顺序的）
  const recent5Records = records.slice(-5);

  // 计算平均时长（秒）
  const totalDuration = recent5Records.reduce((sum, r) => sum + r.duration, 0);
  const avgDuration = totalDuration / recent5Records.length;

  // 如果平均时长 >= 3分钟（180秒），不生成建议
  if (avgDuration >= 180) {
    return null;
  }

  const avgMinutes = Math.round(avgDuration / 60);

  return {
    type: 'frequency',
    priority: 'medium',
    title: '延长单次练习时长',
    description: `最近5次练习平均时长${avgMinutes}分钟，建议每次练习至少3分钟以进入状态`,
    action: '开始练习',
    actionLink: '/practice',
  };
}

// ============================================
// Hook 实现
// ============================================

export function useWeaknessAnalysis(records: PracticeRecord[]): {
  tips: WeaknessTip[];
  topTip: WeaknessTip | undefined;
} {
  const analysis = useMemo(() => {
    // 空记录时返回默认值
    if (records.length === 0) {
      return {
        tips: [],
        topTip: undefined,
      };
    }

    // ==========================================
    // 执行所有分析
    // ==========================================

    const allTips: WeaknessTip[] = [
      analyzeSegmentPractice(records),
      analyzePracticeFrequency(records),
      analyzeStreak(records),
      analyzePracticeDuration(records),
    ].filter((tip): tip is WeaknessTip => tip !== null);

    // ==========================================
    // 按 priority 排序（high > medium > low）
    // ==========================================

    allTips.sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]);

    // ==========================================
    // 最多返回5条建议
    // ==========================================

    const tips = allTips.slice(0, 5);
    const topTip = tips[0];

    return {
      tips,
      topTip,
    };
  }, [records]);

  return analysis;
}
