'use client';

import { useHotkeys } from 'react-hotkeys-hook';

/**
 * 快捷键配置
 */
export interface ShortcutConfig {
  /** 快捷键组合，例如: "space", "ctrl+r", "f" */
  key: string;
  /** 快捷键描述，用于提示组件显示 */
  description: string;
  /** 触发的动作 */
  action: () => void;
  /** 是否启用，默认为 true */
  enabled?: boolean;
}

/**
 * 通用快捷键 Hook
 *
 * @example
 * ```tsx
 * useKeyboardShortcuts([
 *   {
 *     key: 'space',
 *     description: '播放/暂停',
 *     action: () => console.log('toggle')
 *   }
 * ]);
 * ```
 */
export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]): void {
  shortcuts.forEach((shortcut) => {
    // 如果禁用则跳过
    if (shortcut.enabled === false) return;

    // 使用 react-hotkeys-hook 注册快捷键
    useHotkeys(
      shortcut.key,
      (event) => {
        // 阻止默认行为（例如空格键滚动页面）
        event.preventDefault();
        shortcut.action();
      },
      // 当 enabled 为 true 或 undefined 时启用快捷键
      { enabled: shortcut.enabled ?? true },
      [shortcut.action]
    );
  });
}
