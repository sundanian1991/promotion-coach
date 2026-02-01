/**
 * 练习报告导出 Hook
 * 用于生成 PDF 格式的练习报告
 */

import { useMemo, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { PracticeRecord } from '@/types';
import { usePracticeStats, type DailyStat, type SegmentStat } from './usePracticeStats';

// ============================================
// 类型定义
// ============================================

/** 报告数据结构 */
export interface ReportData {
  /** 总练习时长（秒） */
  totalDuration: number;
  /** 总练习次数 */
  totalCount: number;
  /** 平均每次时长（秒） */
  averageDuration: number;
  /** 练习天数 */
  practiceDays: number;
  /** 每日统计 */
  dailyStats: DailyStat[];
  /** 段落分布 */
  segmentDistribution: SegmentStat[];
  /** 生成时间 */
  generatedAt: Date;
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

/** PDF 配置 */
const PDF_CONFIG = {
  margin: 20,
  lineHeight: 10,
  fontSize: {
    title: 20,
    heading: 16,
    body: 12,
    small: 10,
  },
  colors: {
    text: [51, 51, 51] as [number, number, number], // #333333
    muted: [128, 128, 128] as [number, number, number], // #808080
    accent: [59, 130, 246] as [number, number, number], // #3B82F6
  },
};

// ============================================
// 工具函数
// ============================================

/**
 * 格式化时长为可读字符串
 * @param seconds 时长（秒）
 * @returns 格式化后的字符串，例如 "2小时30分钟" 或 "45分钟"
 */
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * 格式化日期为可读字符串
 * @param dateString 日期字符串 (YYYY-MM-DD)
 * @returns 格式化后的日期，例如 "2024年01月15日"
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'yyyy年MM月dd日', { locale: zhCN });
}

/**
 * 获取最近7天的统计数据
 * @param dailyStats 每日统计数据
 * @returns 最近7天的统计（按日期降序）
 */
function getLast7DaysStats(dailyStats: DailyStat[]): DailyStat[] {
  return [...dailyStats]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7)
    .sort((a, b) => a.date.localeCompare(b.date)); // 重新按日期升序排序
}

// ============================================
// Hook 实现
// ============================================

export function usePracticeReport(records: PracticeRecord[]): {
  reportData: ReportData;
  generatePDF: () => void;
} {
  // 使用 usePracticeStats 获取基础统计数据
  const { dailyStats, segmentDistribution, totalDuration } = usePracticeStats(records);

  // 计算报告数据
  const reportData = useMemo<ReportData>(() => {
    const totalCount = records.length;
    const practiceDays = dailyStats.length;
    const averageDuration = totalCount > 0 ? Math.round(totalDuration / totalCount) : 0;

    return {
      totalDuration,
      totalCount,
      averageDuration,
      practiceDays,
      dailyStats,
      segmentDistribution,
      generatedAt: new Date(),
    };
  }, [records.length, dailyStats, segmentDistribution, totalDuration]);

  /**
   * 生成 PDF 报告
   */
  const generatePDF = useCallback(() => {
    // 创建 PDF 文档
    const doc = new jsPDF();
    const { margin, lineHeight, fontSize, colors } = PDF_CONFIG;

    let yPosition = margin;

    // ==========================================
    // 1. 标题
    // ==========================================
    doc.setFontSize(fontSize.title);
    doc.setTextColor(...colors.text);
    doc.text('Practice Report', margin, yPosition);
    yPosition += lineHeight * 2;

    // ==========================================
    // 2. 生成时间
    // ==========================================
    doc.setFontSize(fontSize.small);
    doc.setTextColor(...colors.muted);
    const generatedTime = format(reportData.generatedAt, 'yyyy-MM-dd HH:mm');
    doc.text(`Generated: ${generatedTime}`, margin, yPosition);
    yPosition += lineHeight * 2;

    // ==========================================
    // 3. 总体统计
    // ==========================================
    doc.setFontSize(fontSize.heading);
    doc.setTextColor(...colors.text);
    doc.text('Summary', margin, yPosition);
    yPosition += lineHeight;

    doc.setFontSize(fontSize.body);
    doc.setTextColor(...colors.muted);

    const totalHours = Math.floor(reportData.totalDuration / 3600);
    const totalMinutes = Math.floor((reportData.totalDuration % 3600) / 60);
    const avgMinutes = Math.round(reportData.averageDuration / 60);

    doc.text(`Total Time: ${totalHours}h ${totalMinutes}m`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Total Sessions: ${reportData.totalCount}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Avg Duration: ${avgMinutes}m`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Practice Days: ${reportData.practiceDays}`, margin, yPosition);
    yPosition += lineHeight * 2;

    // ==========================================
    // 4. 段落分布
    // ==========================================
    doc.setFontSize(fontSize.heading);
    doc.setTextColor(...colors.text);
    doc.text('Segment Distribution', margin, yPosition);
    yPosition += lineHeight;

    // 表头
    doc.setFontSize(fontSize.small);
    doc.setTextColor(...colors.muted);
    const col1 = margin;
    const col2 = margin + 50;
    const col3 = margin + 90;
    const col4 = margin + 120;

    doc.text('Segment', col1, yPosition);
    doc.text('Time', col2, yPosition);
    doc.text('Count', col3, yPosition);
    doc.text('%', col4, yPosition);
    yPosition += lineHeight;

    // 分隔线
    doc.setDrawColor(...colors.muted);
    doc.line(margin, yPosition, 200 - margin, yPosition);
    yPosition += lineHeight / 2;

    // 数据行
    doc.setTextColor(...colors.text);
    reportData.segmentDistribution.forEach((segment) => {
      // 检查页面是否需要换页
      if (yPosition > 270) {
        doc.addPage();
        yPosition = margin;
      }

      const segmentName = SEGMENT_NAMES[segment.segmentId] || segment.segmentId;
      const timeStr = formatDuration(segment.duration);

      doc.text(segmentName, col1, yPosition);
      doc.text(timeStr, col2, yPosition);
      doc.text(String(segment.count), col3, yPosition);
      doc.text(`${segment.percentage}%`, col4, yPosition);
      yPosition += lineHeight;
    });

    yPosition += lineHeight;

    // ==========================================
    // 5. 最近7天练习
    // ==========================================
    // 检查是否需要新页面
    if (yPosition > 240) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(fontSize.heading);
    doc.setTextColor(...colors.text);
    doc.text('Last 7 Days', margin, yPosition);
    yPosition += lineHeight;

    // 表头
    doc.setFontSize(fontSize.small);
    doc.setTextColor(...colors.muted);
    doc.text('Date', margin, yPosition);
    doc.text('Time', margin + 50, yPosition);
    doc.text('Count', margin + 90, yPosition);
    yPosition += lineHeight;

    // 分隔线
    doc.setDrawColor(...colors.muted);
    doc.line(margin, yPosition, 200 - margin, yPosition);
    yPosition += lineHeight / 2;

    // 数据行
    const last7Days = getLast7DaysStats(reportData.dailyStats);
    doc.setTextColor(...colors.text);

    last7Days.forEach((day) => {
      // 检查页面是否需要换页
      if (yPosition > 270) {
        doc.addPage();
        yPosition = margin;
      }

      const dateStr = formatDate(day.date);
      const timeStr = formatDuration(day.duration);

      doc.text(dateStr, margin, yPosition);
      doc.text(timeStr, margin + 50, yPosition);
      doc.text(String(day.count), margin + 90, yPosition);
      yPosition += lineHeight;
    });

    // ==========================================
    // 6. 保存文件
    // ==========================================
    const fileName = `PracticeReport_${format(reportData.generatedAt, 'yyyyMMdd')}.pdf`;
    doc.save(fileName);
  }, [reportData]);

  return {
    reportData,
    generatePDF,
  };
}
