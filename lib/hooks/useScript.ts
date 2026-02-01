/**
 * 讲稿数据 Hook
 * 统一处理默认讲稿和自定义讲稿的获取
 */

import { useCustomScript } from '@/lib/store';
import { scriptSegments } from '@/lib/content';
import type { ScriptSegment } from '@/types';

/**
 * 获取当前使用的讲稿段落
 * 如果用户导入了自定义讲稿，则返回自定义讲稿；否则返回默认讲稿
 */
export function useScriptSegments(): ScriptSegment[] {
  const customScript = useCustomScript();
  return customScript && customScript.length > 0 ? customScript : scriptSegments;
}

/**
 * 获取指定段落
 */
export function useSegment(id: string): ScriptSegment | undefined {
  const segments = useScriptSegments();

  if (id === 'full') {
    const fullContent = segments.map(s => s.fullContent).join('\n\n---\n\n');
    const skeletonContent = segments.map(s => s.skeletonContent).join('\n\n---\n\n');
    return {
      id: 'full',
      title: '完整练习',
      duration: segments.reduce((acc, s) => acc + s.duration, 0),
      fullContent,
      skeletonContent,
      keyPoints: ['完整版逐字稿', '骨架版速查'],
      dataPoints: [{ label: '建议时长', value: `${Math.round(segments.reduce((acc, s) => acc + s.duration, 0) / 60)}分钟` }],
      transition: '',
    };
  }

  return segments.find(s => s.id === id);
}

/**
 * 获取下一段
 */
export function useNextSegment(currentId: string): ScriptSegment | undefined {
  const segments = useScriptSegments();
  const index = segments.findIndex(s => s.id === currentId);
  if (index >= 0 && index < segments.length - 1) {
    return segments[index + 1];
  }
  return undefined;
}

/**
 * 获取上一段
 */
export function usePrevSegment(currentId: string): ScriptSegment | undefined {
  const segments = useScriptSegments();
  const index = segments.findIndex(s => s.id === currentId);
  if (index > 0) {
    return segments[index - 1];
  }
  return undefined;
}

/**
 * 是否正在使用自定义讲稿
 */
export function useIsCustomScript(): boolean {
  const customScript = useCustomScript();
  return customScript !== null && customScript.length > 0;
}
