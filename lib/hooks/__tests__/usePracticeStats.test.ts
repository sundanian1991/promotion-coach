/**
 * usePracticeStats Hook 测试
 * 遵循 TDD 红绿重构流程
 */

import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePracticeStats } from '../usePracticeStats';
import type { PracticeRecord } from '@/types';

describe('usePracticeStats', () => {
  // 测试 1: 空记录时返回空数组和零值
  it('应返回空数组和零总时长（当没有练习记录时）', () => {
    const { result } = renderHook(() => usePracticeStats([]));

    expect(result.current.dailyStats).toEqual([]);
    expect(result.current.segmentDistribution).toEqual([]);
    expect(result.current.totalDuration).toBe(0);
  });

  // 测试 2: 正确计算每日统计
  it('应正确计算每日练习时长和次数', () => {
    const records: PracticeRecord[] = [
      {
        id: '1',
        date: '2026-02-01',
        segmentId: 'opening',
        duration: 120,
      },
      {
        id: '2',
        date: '2026-02-01',
        segmentId: 'upgrade1',
        duration: 180,
      },
      {
        id: '3',
        date: '2026-02-02',
        segmentId: 'opening',
        duration: 150,
      },
    ];

    const { result } = renderHook(() => usePracticeStats(records));

    expect(result.current.dailyStats).toHaveLength(2);
    expect(result.current.dailyStats[0]).toEqual({
      date: '2026-02-01',
      duration: 300, // 120 + 180
      count: 2,
    });
    expect(result.current.dailyStats[1]).toEqual({
      date: '2026-02-02',
      duration: 150,
      count: 1,
    });
  });

  // 测试 3: 正确计算段落分布
  it('应正确计算段落练习时长、次数和百分比', () => {
    const records: PracticeRecord[] = [
      {
        id: '1',
        date: '2026-02-01',
        segmentId: 'opening',
        duration: 120,
      },
      {
        id: '2',
        date: '2026-02-01',
        segmentId: 'opening',
        duration: 180,
      },
      {
        id: '3',
        date: '2026-02-01',
        segmentId: 'upgrade1',
        duration: 300,
      },
      {
        id: '4',
        date: '2026-02-02',
        segmentId: 'upgrade2',
        duration: 200,
      },
    ];

    const { result } = renderHook(() => usePracticeStats(records));

    expect(result.current.segmentDistribution).toHaveLength(3);

    // 开场段落
    const openingStat = result.current.segmentDistribution.find(
      (s) => s.segmentId === 'opening'
    );
    expect(openingStat).toEqual({
      segmentId: 'opening',
      segmentName: '开场',
      duration: 300, // 120 + 180
      count: 2,
      percentage: 37.5, // 300 / 800 * 100
    });

    // 升级一段落
    const upgrade1Stat = result.current.segmentDistribution.find(
      (s) => s.segmentId === 'upgrade1'
    );
    expect(upgrade1Stat).toEqual({
      segmentId: 'upgrade1',
      segmentName: '升级一',
      duration: 300,
      count: 1,
      percentage: 37.5, // 300 / 800 * 100
    });

    // 升级二段落
    const upgrade2Stat = result.current.segmentDistribution.find(
      (s) => s.segmentId === 'upgrade2'
    );
    expect(upgrade2Stat).toEqual({
      segmentId: 'upgrade2',
      segmentName: '升级二',
      duration: 200,
      count: 1,
      percentage: 25, // 200 / 800 * 100
    });
  });

  // 测试 4: 正确计算总时长
  it('应正确计算总练习时长', () => {
    const records: PracticeRecord[] = [
      {
        id: '1',
        date: '2026-02-01',
        segmentId: 'opening',
        duration: 120,
      },
      {
        id: '2',
        date: '2026-02-01',
        segmentId: 'upgrade1',
        duration: 180,
      },
      {
        id: '3',
        date: '2026-02-02',
        segmentId: 'upgrade2',
        duration: 300,
      },
    ];

    const { result } = renderHook(() => usePracticeStats(records));

    expect(result.current.totalDuration).toBe(600); // 120 + 180 + 300
  });

  // 测试 5: 按日期排序每日统计
  it('应按日期升序排列每日统计', () => {
    const records: PracticeRecord[] = [
      {
        id: '1',
        date: '2026-02-03',
        segmentId: 'opening',
        duration: 100,
      },
      {
        id: '2',
        date: '2026-02-01',
        segmentId: 'opening',
        duration: 200,
      },
      {
        id: '3',
        date: '2026-02-02',
        segmentId: 'opening',
        duration: 150,
      },
    ];

    const { result } = renderHook(() => usePracticeStats(records));

    expect(result.current.dailyStats).toHaveLength(3);
    expect(result.current.dailyStats[0].date).toBe('2026-02-01');
    expect(result.current.dailyStats[1].date).toBe('2026-02-02');
    expect(result.current.dailyStats[2].date).toBe('2026-02-03');
  });

  // 测试 6: 段落按练习时长降序排列
  it('应按练习时长降序排列段落分布', () => {
    const records: PracticeRecord[] = [
      {
        id: '1',
        date: '2026-02-01',
        segmentId: 'opening',
        duration: 100,
      },
      {
        id: '2',
        date: '2026-02-01',
        segmentId: 'upgrade1',
        duration: 300,
      },
      {
        id: '3',
        date: '2026-02-01',
        segmentId: 'upgrade2',
        duration: 200,
      },
    ];

    const { result } = renderHook(() => usePracticeStats(records));

    expect(result.current.segmentDistribution).toHaveLength(3);
    expect(result.current.segmentDistribution[0].segmentId).toBe('upgrade1');
    expect(result.current.segmentDistribution[1].segmentId).toBe('upgrade2');
    expect(result.current.segmentDistribution[2].segmentId).toBe('opening');
  });

  // 测试 7: 处理未知段落ID
  it('应处理未知段落ID，使用原始ID作为名称', () => {
    const records: PracticeRecord[] = [
      {
        id: '1',
        date: '2026-02-01',
        segmentId: 'unknown_segment',
        duration: 100,
      },
    ];

    const { result } = renderHook(() => usePracticeStats(records));

    expect(result.current.segmentDistribution).toHaveLength(1);
    expect(result.current.segmentDistribution[0].segmentName).toBe(
      'unknown_segment'
    );
  });

  // 测试 8: 百分比计算精度
  it('应正确处理百分比计算精度（保留一位小数）', () => {
    const records: PracticeRecord[] = [
      {
        id: '1',
        date: '2026-02-01',
        segmentId: 'opening',
        duration: 100,
      },
      {
        id: '2',
        date: '2026-02-01',
        segmentId: 'upgrade1',
        duration: 100,
      },
      {
        id: '3',
        date: '2026-02-01',
        segmentId: 'upgrade2',
        duration: 100,
      },
    ];

    const { result } = renderHook(() => usePracticeStats(records));

    // 总时长 300，每个段落 100，应为 33.3%
    result.current.segmentDistribution.forEach((stat) => {
      expect(stat.percentage).toBe(33.3);
    });
  });
});
