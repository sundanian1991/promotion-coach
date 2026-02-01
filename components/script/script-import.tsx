'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import type { ScriptSegment } from '@/types';
import { Upload, FileText, X, Check, AlertCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 讲稿导入组件
 * 支持导入MD/TXT格式的讲稿，自动拆分段落
 */
export function ScriptImport() {
  const [fileContent, setFileContent] = useState<string>('');
  const [segments, setSegments] = useState<ScriptSegment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<'upload' | 'preview'>('upload');

  const importCustomScript = useStore((state) => state.importCustomScript);
  const customScript = useStore((state) => state.customScript);

  // 处理文件上传
  const handleFileUpload = useCallback((file: File) => {
    setError('');

    // 验证文件类型
    if (!file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
      setError('请上传 .md 或 .txt 格式的文件');
      return;
    }

    // 验证文件大小（最大 5MB）
    if (file.size > 5 * 1024 * 1024) {
      setError('文件大小不能超过 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      autoParseSegments(content);
    };
    reader.onerror = () => {
      setError('读取文件失败，请重试');
    };
    reader.readAsText(file, 'UTF-8');
  }, []);

  // 拖拽事件处理
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  // 自动解析段落
  const autoParseSegments = (content: string) => {
    // 尝试多种分隔符
    const separators = [
      /#{2,3}\s+/gm,              // ## 或 ### 标题
      /^---+$|^===+$/gm,         // --- 或 === 分隔线
      /^\[第[一二三四五六七八九十\d]+部分?\]/gm, // 【第一部分】
      /^\d+[\.、]\s*/gm,         // 1. 或 1、
    ];

    let bestSegments: string[] = [];
    let bestSeparator: RegExp | null = null;

    // 找到能产生合理段落数量的分隔符
    for (const separator of separators) {
      const parts = content.split(separator).filter(p => p.trim().length > 50);
      if (parts.length >= 3 && parts.length <= 15) {
        if (parts.length > bestSegments.length) {
          bestSegments = parts;
          bestSeparator = separator;
        }
      }
    }

    // 如果没找到合适的分隔符，尝试按空行分段
    if (bestSegments.length === 0) {
      const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 100);
      if (paragraphs.length >= 3) {
        // 每2-3个段落合并成一个segment
        for (let i = 0; i < paragraphs.length; i += 2) {
          const segment = paragraphs.slice(i, i + 2).join('\n\n');
          if (segment.trim().length > 0) {
            bestSegments.push(segment);
          }
        }
      } else {
        // 如果段落太少，整体作为一个segment
        bestSegments = [content];
      }
    }

    // 转换为ScriptSegment格式
    const parsedSegments: ScriptSegment[] = bestSegments.map((content, index) => {
      const lines = content.trim().split('\n');
      const firstLine = lines[0].trim();

      // 提取标题（第一行或前20字）
      let title = firstLine;
      if (title.length > 20) {
        title = title.slice(0, 20) + '...';
      }
      if (!title || title.length < 2) {
        title = `段落 ${index + 1}`;
      }

      // 提取关键要点（前3个非空行）
      const keyPoints = lines
        .filter(l => l.trim().length > 5 && l.trim().length < 100)
        .slice(0, 3)
        .map(l => l.trim());

      // 估算时长（按每分钟150字计算）
      const charCount = content.length;
      const duration = Math.max(30, Math.round(charCount / 150 * 60));

      return {
        id: `custom-${index}`,
        title,
        duration,
        fullContent: content.trim(),
        skeletonContent: lines.slice(0, 5).join('\n'), // 简化版取前5行
        keyPoints: keyPoints.length > 0 ? keyPoints : [title],
        dataPoints: [],
        transition: index < bestSegments.length - 1 ? '下一部分...' : '',
      };
    });

    setSegments(parsedSegments);
    setStep('preview');
  };

  // 更新段落
  const updateSegment = (index: number, field: keyof ScriptSegment, value: string | number | string[]) => {
    const newSegments = [...segments];
    newSegments[index] = { ...newSegments[index], [field]: value };
    setSegments(newSegments);
  };

  // 删除段落
  const removeSegment = (index: number) => {
    const newSegments = segments.filter((_, i) => i !== index);
    setSegments(newSegments);
  };

  // 确认导入
  const handleImport = () => {
    if (segments.length === 0) return;

    // 为每个段落生成唯一ID
    const finalSegments = segments.map((seg, index) => ({
      ...seg,
      id: `custom-${Date.now()}-${index}`,
    }));

    importCustomScript(finalSegments);
    setStep('upload');
    setFileContent('');
    setSegments([]);
  };

  // 重置自定义讲稿
  const handleReset = () => {
    if (confirm('确定要清空自定义讲稿并恢复默认吗？')) {
      useStore.getState().resetCustomScript();
    }
  };

  // 上传步骤
  if (step === 'upload') {
    return (
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="w-4 h-4 text-primary" />
            导入讲稿
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 拖拽区域 */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            )}
          >
            <input
              type="file"
              accept=".md,.txt"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
              id="script-file-input"
            />
            <label htmlFor="script-file-input" className="cursor-pointer">
              <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">
                {isDragging ? '松开以上传文件' : '拖拽文件到此处，或点击选择'}
              </p>
              <p className="text-xs text-muted-foreground">
                支持 .md 和 .txt 格式，最大 5MB
              </p>
            </label>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* 手动粘贴区域 */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">或直接粘贴讲稿内容：</p>
            <Textarea
              placeholder="在此粘贴讲稿内容，系统会自动识别段落分隔..."
              value={fileContent}
              onChange={(e) => {
                setFileContent(e.target.value);
                if (e.target.value.length > 100) {
                  autoParseSegments(e.target.value);
                }
              }}
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* 使用自定义讲稿的提示 */}
          {customScript && customScript.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm">正在使用自定义讲稿（{customScript.length} 个段落）</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // 预览步骤
  return (
    <Card className="hover-lift">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          预览讲稿段落
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setStep('upload')}>
            重新上传
          </Button>
          <Button size="sm" onClick={handleImport} disabled={segments.length === 0}>
            <Check className="w-4 h-4 mr-1" />
            确认导入
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          系统已自动识别 {segments.length} 个段落，您可以编辑标题、时长和关键要点
        </p>

        <div className="space-y-3 max-h-[400px] overflow-auto">
          {segments.map((segment, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between gap-4">
                <Badge variant="secondary">段落 {index + 1}</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSegment(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">标题</label>
                  <Input
                    value={segment.title}
                    onChange={(e) => updateSegment(index, 'title', e.target.value)}
                    placeholder="段落标题"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">建议时长（秒）</label>
                  <Input
                    type="number"
                    value={segment.duration}
                    onChange={(e) => updateSegment(index, 'duration', parseInt(e.target.value) || 60)}
                    placeholder="60"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">关键要点（用逗号分隔）</label>
                <Input
                  value={segment.keyPoints.join('，')}
                  onChange={(e) => updateSegment(index, 'keyPoints', e.target.value.split(/[,，]/).map(s => s.trim()).filter(Boolean))}
                  placeholder="要点1，要点2，要点3"
                />
              </div>

              <details className="text-sm">
                <summary className="text-muted-foreground cursor-pointer hover:text-foreground">
                  查看内容预览 ({segment.fullContent.length} 字)
                </summary>
                <div className="mt-2 p-3 bg-secondary rounded text-xs text-muted-foreground max-h-[150px] overflow-auto whitespace-pre-wrap">
                  {segment.fullContent}
                </div>
              </details>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
