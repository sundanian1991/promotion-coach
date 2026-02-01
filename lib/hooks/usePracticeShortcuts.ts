'use client';

import { useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

/**
 * 练习页面快捷键配置
 */
export interface PracticeShortcutsConfig {
  /** 播放/暂停回调 */
  onTogglePlay: () => void;
  /** 重置回调 */
  onReset: () => void;
  /** 下一段落回调（可选） */
  onNextSegment?: () => void;
  /** 上一段落回调（可选） */
  onPrevSegment?: () => void;
  /** 全屏切换回调（可选） */
  onToggleFullscreen?: () => void;
}

/**
 * 练习页面专用快捷键 Hook
 *
 * 支持的快捷键：
 * - `空格` - 播放/暂停
 * - `Ctrl/Cmd + R` - 重置
 * - `Ctrl/Cmd + →` - 下一段落
 * - `Ctrl/Cmd + ←` - 上一段落
 * - `F` - 全屏模式
 * - `Esc` - 退出全屏
 *
 * @example
 * ```tsx
 * usePracticeShortcuts({
 *   onTogglePlay: () => togglePlay(),
 *   onReset: () => reset(),
 *   onNextSegment: () => nextSegment(),
 *   onPrevSegment: () => prevSegment(),
 *   onToggleFullscreen: () => toggleFullscreen()
 * });
 * ```
 */
export function usePracticeShortcuts(config: PracticeShortcutsConfig) {
  const {
    onTogglePlay,
    onReset,
    onNextSegment,
    onPrevSegment,
    onToggleFullscreen,
  } = config;

  // 播放/暂停: 空格键
  useHotkeys(
    'space',
    (event) => {
      event.preventDefault();
      onTogglePlay();
    },
    { enableOnFormTags: true },
    [onTogglePlay]
  );

  // 重置: Ctrl/Cmd + R
  useHotkeys(
    'mod+r',
    (event) => {
      event.preventDefault();
      onReset();
    },
    {},
    [onReset]
  );

  // 下一段落: Ctrl/Cmd + →
  useHotkeys(
    'mod+right',
    (event) => {
      event.preventDefault();
      onNextSegment?.();
    },
    { enabled: !!onNextSegment },
    [onNextSegment]
  );

  // 上一段落: Ctrl/Cmd + ←
  useHotkeys(
    'mod+left',
    (event) => {
      event.preventDefault();
      onPrevSegment?.();
    },
    { enabled: !!onPrevSegment },
    [onPrevSegment]
  );

  // 全屏模式: F 键
  useHotkeys(
    'f',
    (event) => {
      event.preventDefault();
      onToggleFullscreen?.();
    },
    { enabled: !!onToggleFullscreen },
    [onToggleFullscreen]
  );

  // 退出全屏: Esc 键
  useHotkeys(
    'escape',
    (event) => {
      // Esc 键不阻止默认行为，允许浏览器处理其他 Esc 操作
      onToggleFullscreen?.();
    },
    { enabled: !!onToggleFullscreen },
    [onToggleFullscreen]
  );

  // 返回快捷键列表（用于 KeyboardHints 组件）
  const shortcuts = useCallback(() => {
    const list = [
      { key: 'Space', description: '播放/暂停' },
      { key: 'Ctrl/Cmd + R', description: '重置' },
    ];

    if (onNextSegment) {
      list.push({ key: 'Ctrl/Cmd + →', description: '下一段落' });
    }

    if (onPrevSegment) {
      list.push({ key: 'Ctrl/Cmd + ←', description: '上一段落' });
    }

    if (onToggleFullscreen) {
      list.push(
        { key: 'F', description: '全屏模式' },
        { key: 'Esc', description: '退出全屏' }
      );
    }

    return list;
  }, [onTogglePlay, onReset, onNextSegment, onPrevSegment, onToggleFullscreen]);

  return {
    shortcuts: shortcuts(),
  };
}
