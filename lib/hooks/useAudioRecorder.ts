/**
 * 语音录音 Hook
 * 使用 Web Audio API 实现录音功能，支持录制、播放、删除和管理录音
 */

import { useCallback, useRef, useState } from 'react';

// ============================================
// 类型定义
// ============================================

/** 录音记录 */
export interface AudioRecording {
  blob: Blob;
  url: string;
  duration: number;
  timestamp: string;
}

/** 录音错误类型 */
export type RecorderError = 'permission-denied' | 'not-supported' | 'unknown';

// ============================================
// 常量定义
// ============================================

/** 音频 MIME 类型 */
const AUDIO_MIME_TYPE = 'audio/webm';

/** 定时器更新间隔（毫秒） */
const TIMER_INTERVAL = 1000;

// ============================================
// Hook 实现
// ============================================

export function useAudioRecorder(): {
  isRecording: boolean;
  recordings: AudioRecording[];
  duration: number;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  deleteRecording: (index: number) => void;
  clearAllRecordings: () => void;
} {
  // ==========================================
  // 状态管理
  // ==========================================

  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<AudioRecording[]>([]);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // Refs（避免闭包问题）
  // ==========================================

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // ==========================================
  // 辅助函数
  // ==========================================

  /**
   * 清理定时器
   */
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /**
   * 清理媒体流
   */
  const clearStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  /**
   * 获取当前时间戳字符串
   */
  const getTimestamp = useCallback(() => {
    return new Date().toISOString();
  }, []);

  // ==========================================
  // 开始录音
  // ==========================================

  const startRecording = useCallback(async () => {
    try {
      // 清除之前的错误信息
      setError(null);

      // 检查浏览器是否支持
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('浏览器不支持录音功能');
        return;
      }

      // 获取麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 创建 MediaRecorder 实例
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: AUDIO_MIME_TYPE,
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // 设置数据收集回调
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // 设置录音停止回调
      mediaRecorder.onstop = () => {
        // 创建 Blob
        const blob = new Blob(audioChunksRef.current, {
          type: AUDIO_MIME_TYPE,
        });

        // 创建 URL
        const url = URL.createObjectURL(blob);

        // 创建录音记录
        const recording: AudioRecording = {
          blob,
          url,
          duration,
          timestamp: getTimestamp(),
        };

        // 添加到列表
        setRecordings((prev) => [...prev, recording]);

        // 重置时长
        setDuration(0);
      };

      // 开始录音
      mediaRecorder.start();
      setIsRecording(true);

      // 启动定时器（每秒更新时长）
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, TIMER_INTERVAL);
    } catch (err) {
      // 处理各种错误情况
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('麦克风权限被拒绝，请在浏览器设置中允许访问麦克风');
        } else if (err.name === 'NotFoundError') {
          setError('未检测到麦克风设备');
        } else {
          setError(`录音失败: ${err.message}`);
        }
      } else {
        setError('录音失败，请重试');
      }

      // 清理资源
      clearTimer();
      clearStream();
      setIsRecording(false);
    }
  }, [duration, clearTimer, clearStream, getTimestamp]);

  // ==========================================
  // 停止录音
  // ==========================================

  const stopRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      // 停止 MediaRecorder
      mediaRecorder.stop();

      // 清理资源
      clearTimer();
      clearStream();

      // 更新状态
      setIsRecording(false);
      mediaRecorderRef.current = null;
    }
  }, [clearTimer, clearStream]);

  // ==========================================
  // 删除指定录音
  // ==========================================

  const deleteRecording = useCallback((index: number) => {
    setRecordings((prev) => {
      // 释放 URL 内存
      if (prev[index]?.url) {
        URL.revokeObjectURL(prev[index].url);
      }

      // 删除指定索引的录音
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  // ==========================================
  // 清空所有录音
  // ==========================================

  const clearAllRecordings = useCallback(() => {
    // 使用函数式更新，避免依赖 recordings 导致的闭包问题
    setRecordings((prevRecordings) => {
      // 释放所有 URL 内存
      prevRecordings.forEach((recording) => {
        if (recording.url) {
          URL.revokeObjectURL(recording.url);
        }
      });

      // 返回空数组
      return [];
    });
  }, []);

  // ==========================================
  // 返回接口
  // ==========================================

  return {
    isRecording,
    recordings,
    duration,
    error,
    startRecording,
    stopRecording,
    deleteRecording,
    clearAllRecordings,
  };
}
