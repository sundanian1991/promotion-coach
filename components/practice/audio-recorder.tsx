// 录音播放器组件
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Download, Trash2, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudioRecorder } from '@/lib/hooks/useAudioRecorder';

export function AudioRecorder() {
  const {
    isRecording,
    recordings,
    duration,
    startRecording,
    stopRecording,
    deleteRecording,
    clearAllRecordings,
  } = useAudioRecorder();

  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const audioRefs = useRef<HTMLAudioElement[]>([]);

  // 初始化音频元素
  useEffect(() => {
    // 清理旧的音频元素
    audioRefs.current.forEach((audio) => {
      audio.pause();
      audio.src = '';
    });
    audioRefs.current = [];

    // 为每个录音创建新的音频元素
    recordings.forEach((recording) => {
      const audio = new Audio(recording.url);
      audio.onended = () => setPlayingIndex(null);
      audioRefs.current.push(audio);
    });

    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
      audioRefs.current = [];
    };
  }, [recordings]);

  // 播放/暂停
  const togglePlayback = (index: number) => {
    const audio = audioRefs.current[index];
    if (!audio) return;

    if (playingIndex === index) {
      audio.pause();
      setPlayingIndex(null);
    } else {
      // 停止其他正在播放的音频
      if (playingIndex !== null && audioRefs.current[playingIndex]) {
        audioRefs.current[playingIndex].pause();
      }
      audio.play();
      setPlayingIndex(index);
    }
  };

  // 格式化时长
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 下载录音
  const downloadRecording = (recording: { url: string; timestamp: string }, index: number) => {
    const a = document.createElement('a');
    a.href = recording.url;
    a.download = `recording-${index + 1}-${recording.timestamp}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 切换录音状态
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          {/* 录音按钮 */}
          <Button
            size="lg"
            onClick={toggleRecording}
            className={cn(
              'transition-all duration-300',
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-blue-500 hover:bg-blue-600'
            )}
          >
            {isRecording ? (
              <>
                <MicOff className="w-5 h-5 mr-2" />
                停止
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 mr-2" />
                录音
              </>
            )}
          </Button>

          {/* 时长显示 */}
          <div className="flex flex-col items-center min-w-[80px]">
            <div className="text-2xl font-mono font-bold tabular-nums">
              {formatDuration(duration)}
            </div>
            {isRecording && (
              <div className="text-xs text-muted-foreground mt-1">录制中...</div>
            )}
          </div>

          {/* 录音列表 */}
          <div className="flex-1 flex items-center gap-2 overflow-x-auto">
            {recordings.length === 0 ? (
              <div className="text-sm text-muted-foreground">暂无录音</div>
            ) : (
              recordings.map((recording, index) => (
                <div
                  key={`${recording.timestamp}-${index}`}
                  className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg shrink-0"
                >
                  {/* 播放/暂停按钮 */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => togglePlayback(index)}
                    className="h-8 w-8 p-0"
                  >
                    {playingIndex === index ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>

                  {/* 时长 */}
                  <span className="text-sm font-mono min-w-[40px]">
                    {formatDuration(recording.duration)}
                  </span>

                  {/* 下载按钮 */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => downloadRecording(recording, index)}
                    className="h-8 w-8 p-0 hover:text-blue-500"
                  >
                    <Download className="w-4 h-4" />
                  </Button>

                  {/* 删除按钮 */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteRecording(index)}
                    className="h-8 w-8 p-0 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* 清空按钮 */}
          {recordings.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={clearAllRecordings}
              className="shrink-0"
            >
              清空
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
