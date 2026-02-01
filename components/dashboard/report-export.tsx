// PDF 导出按钮组件
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePracticeRecords } from '@/lib/store';
import { FileText, Download } from 'lucide-react';
import { useState } from 'react';

export function ReportExport() {
  const practiceRecords = usePracticeRecords();
  const [isGenerating, setIsGenerating] = useState(false);

  // 空状态：没有练习记录时不显示组件
  if (practiceRecords.length === 0) {
    return null;
  }

  const handleExport = async () => {
    setIsGenerating(true);

    // TODO: 实现 PDF 生成逻辑
    // 这里将调用 Task 10 的 PDF 生成服务

    // 模拟异步操作
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsGenerating(false);
  };

  return (
    <Card className="h-[160px] hover-lift">
      <CardContent className="p-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* 左侧：图标容器 + 标题 + 描述 */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <FileText className="w-5 h-5 text-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">导出练习报告</h3>
              <p className="text-sm text-muted-foreground">
                生成包含所有练习数据的 PDF 报告
              </p>
            </div>
          </div>

          {/* 右侧：导出按钮 */}
          <Button
            onClick={handleExport}
            disabled={isGenerating}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            {isGenerating ? '生成中...' : '导出 PDF'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
