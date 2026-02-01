/**
 * 主题管理 Hook
 * 管理应用主题（浅色/深色/系统跟随）
 */

import { useEffect, useState } from 'react';

// ============================================
// 类型定义
// ============================================

/** 主题类型 */
export type Theme = 'light' | 'dark' | 'system';

/** 解析后的实际主题（仅 light 或 dark） */
type ResolvedTheme = 'light' | 'dark';

// ============================================
// 常量定义
// ============================================

/** localStorage 键名 */
const THEME_STORAGE_KEY = 'theme';

/** 媒体查询：系统深色模式偏好 */
const DARK_MODE_QUERY = '(prefers-color-scheme: dark)';

// ============================================
// 工具函数
// ============================================

/**
 * 从 localStorage 获取主题偏好
 * @returns 主题偏好，默认为 'system'
 */
function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && (stored === 'light' || stored === 'dark' || stored === 'system')) {
      return stored as Theme;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }

  return 'system';
}

/**
 * 保存主题偏好到 localStorage
 * @param theme 要保存的主题
 */
function setStoredTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
}

/**
 * 解析主题为实际的 light/dark
 * @param theme 主题偏好
 * @param systemTheme 系统主题偏好（可选）
 * @returns 解析后的实际主题
 */
function resolveTheme(theme: Theme, systemTheme?: ResolvedTheme): ResolvedTheme {
  if (theme === 'system') {
    return systemTheme || 'light';
  }
  return theme;
}

/**
 * 应用主题到 DOM
 * @param theme 要应用的主题
 */
function applyTheme(theme: ResolvedTheme): void {
  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

/**
 * 获取系统主题偏好
 * @returns 系统主题偏好
 */
function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia(DARK_MODE_QUERY).matches ? 'dark' : 'light';
}

// ============================================
// Hook 实现
// ============================================

export function useTheme(): {
  /** 解析后的实际主题（light 或 dark） */
  theme: ResolvedTheme;
  /** 设置主题偏好 */
  setTheme: (theme: Theme) => void;
  /** 用户主题偏好设置 */
  themePreference: Theme;
} {
  // ==========================================
  // 状态管理
  // ==========================================

  // 用户主题偏好
  const [themePreference, setThemePreferenceState] = useState<Theme>(() => {
    return getStoredTheme();
  });

  // 解析后的实际主题
  const [theme, setThemeState] = useState<ResolvedTheme>(() => {
    const systemTheme = getSystemTheme();
    return resolveTheme(getStoredTheme(), systemTheme);
  });

  // ==========================================
  // 主题设置函数
  // ==========================================

  /**
   * 设置主题偏好
   * @param newTheme 新的主题偏好
   */
  const setTheme = (newTheme: Theme): void => {
    setThemePreferenceState(newTheme);
    setStoredTheme(newTheme);

    // 立即应用主题
    const systemTheme = getSystemTheme();
    const resolved = resolveTheme(newTheme, systemTheme);
    setThemeState(resolved);
    applyTheme(resolved);
  };

  // ==========================================
  // 副作用处理
  // ==========================================

  useEffect(() => {
    // ------------------------------------------
    // 1. 初始化应用主题
    // ------------------------------------------
    const systemTheme = getSystemTheme();
    const resolved = resolveTheme(themePreference, systemTheme);
    setThemeState(resolved);
    applyTheme(resolved);

    // ------------------------------------------
    // 2. 监听系统主题变化
    // ------------------------------------------
    const mediaQuery = window.matchMedia(DARK_MODE_QUERY);

    const handleSystemThemeChange = (e: MediaQueryListEvent | MediaQueryList): void => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      const newResolved = resolveTheme(themePreference, newSystemTheme);
      setThemeState(newResolved);
      applyTheme(newResolved);
    };

    // 现代浏览器使用 addEventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    }
    // 旧浏览器兼容（使用 addListener）
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemThemeChange);
      return () => {
        mediaQuery.removeListener(handleSystemThemeChange);
      };
    }
  }, [themePreference]);

  // ==========================================
  // 返回值
  // ==========================================

  return {
    theme,
    setTheme,
    themePreference,
  };
}
