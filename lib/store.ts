// Zustand 状态管理
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState,
  ProgressState,
  UserSettings,
  PracticeRecord,
  QARecord,
  ChecklistPhase,
  ScriptSegment,
} from '@/types';
import { defaultProgress, defaultSettings, defaultChecklists, defaultCustomContent } from '@/types';

interface StoreActions {
  // 进度相关
  setCurrentDay: (day: number) => void;
  markDayCompleted: (day: number) => void;
  toggleTaskCompletion: (taskId: string) => void;
  updatePracticeStreak: () => void;
  setTotalDays: (days: number) => void;

  // 设置相关
  setInterviewDate: (date: string | null) => void;
  setSafeWords: (words: string[]) => void;
  setPreferredVersion: (version: 'full' | 'skeleton') => void;

  // 练习记录相关
  addPracticeRecord: (record: Omit<PracticeRecord, 'id'>) => void;
  deletePracticeRecord: (id: string) => void;
  deduplicatePracticeRecords: () => void; // 去重练习记录

  // 问答记录相关
  addQARecord: (record: Omit<QARecord, 'id'>) => void;
  deleteQARecord: (id: string) => void;

  // 自定义内容相关
  saveCustomContent: (segmentId: string, version: 'full' | 'skeleton', content: string) => void;
  resetCustomContent: (segmentId: string) => void;

  // 自定义讲稿相关
  importCustomScript: (segments: ScriptSegment[]) => void;
  resetCustomScript: () => void;

  // 检查清单相关
  toggleChecklistItem: (phase: ChecklistPhase, index: number) => void;
  resetChecklistPhase: (phase: ChecklistPhase) => void;

  // 重置
  resetAll: () => void;
  resetProgress: () => void;
}

type AppStore = AppState & StoreActions;

// 去重标记，确保只执行一次
let hasDeduplicated = false;

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      progress: defaultProgress,
      settings: defaultSettings,
      practiceRecords: [],
      qaRecords: [],
      checklists: defaultChecklists,
      customContent: defaultCustomContent,
      customScript: null,

      // 进度相关
      setCurrentDay: (day) =>
        set((state) => ({
          progress: { ...state.progress, currentDay: day },
        })),

      markDayCompleted: (day) =>
        set((state) => {
          const completedDays = state.progress.completedDays.includes(day)
            ? state.progress.completedDays
            : [...state.progress.completedDays, day];
          const currentDay = Math.min(day + 1, state.progress.totalDays);
          return {
            progress: {
              ...state.progress,
              completedDays,
              currentDay,
              lastPracticeDate: new Date().toISOString(),
            },
          };
        }),

      toggleTaskCompletion: (taskId) =>
        set((state) => {
          const currentCompletedTasks = state.progress.completedTasks || [];
          const isCompleted = currentCompletedTasks.includes(taskId);
          const completedTasks = isCompleted
            ? currentCompletedTasks.filter((id) => id !== taskId)
            : [...currentCompletedTasks, taskId];
          return {
            progress: {
              ...state.progress,
              completedTasks,
            },
          };
        }),

      updatePracticeStreak: () =>
        set((state) => {
          const lastDate = state.progress.lastPracticeDate
            ? new Date(state.progress.lastPracticeDate)
            : null;
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          let newStreak = 1;
          if (lastDate) {
            const isConsecutive =
              lastDate.toDateString() === yesterday.toDateString() ||
              lastDate.toDateString() === today.toDateString();
            if (isConsecutive) {
              newStreak = state.progress.practiceStreak + 1;
            } else if (lastDate.toDateString() !== today.toDateString()) {
              newStreak = 1;
            } else {
              newStreak = state.progress.practiceStreak;
            }
          }

          return {
            progress: {
              ...state.progress,
              practiceStreak: newStreak,
              lastPracticeDate: today.toISOString(),
            },
          };
        }),

      setTotalDays: (days) =>
        set((state) => ({
          progress: { ...state.progress, totalDays: days },
        })),

      // 设置相关
      setInterviewDate: (date) =>
        set((state) => ({
          settings: { ...state.settings, interviewDate: date },
        })),

      setSafeWords: (words) =>
        set((state) => ({
          settings: { ...state.settings, safeWords: words },
        })),

      setPreferredVersion: (version) =>
        set((state) => ({
          settings: { ...state.settings, preferredVersion: version },
        })),

      // 练习记录相关
      addPracticeRecord: (record) =>
        set((state) => {
          // 生成唯一ID，使用时间戳 + 随机数避免重复
          const id = `practice-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          return {
            practiceRecords: [
              ...state.practiceRecords,
              { ...record, id },
            ],
          };
        }),

      deletePracticeRecord: (id) =>
        set((state) => ({
          practiceRecords: state.practiceRecords.filter((r) => r.id !== id),
        })),

      deduplicatePracticeRecords: () =>
        set((state) => {
          // 按日期去重，保留最新的记录
          const seen = new Map<string, PracticeRecord>();
          state.practiceRecords.forEach((record) => {
            const key = `${record.segmentId}-${record.date}`;
            const existing = seen.get(key);
            if (!existing || new Date(record.date).getTime() > new Date(existing.date).getTime()) {
              seen.set(key, record);
            }
          });
          return {
            practiceRecords: Array.from(seen.values()),
          };
        }),

      // 问答记录相关
      addQARecord: (record) =>
        set((state) => {
          const id = `qa-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          return {
            qaRecords: [
              ...state.qaRecords,
              { ...record, id },
            ],
          };
        }),

      deleteQARecord: (id) =>
        set((state) => ({
          qaRecords: state.qaRecords.filter((r) => r.id !== id),
        })),

      // 自定义内容相关
      saveCustomContent: (segmentId, version, content) =>
        set((state) => {
          const existing = state.customContent[segmentId] || { full: '', skeleton: '' };
          return {
            customContent: {
              ...state.customContent,
              [segmentId]: {
                ...existing,
                [version]: content,
              },
            },
          };
        }),

      resetCustomContent: (segmentId) =>
        set((state) => {
          const newCustomContent = { ...state.customContent };
          delete newCustomContent[segmentId];
          return {
            customContent: newCustomContent,
          };
        }),

      // 自定义讲稿相关
      importCustomScript: (segments) =>
        set(() => ({
          customScript: segments,
        })),

      resetCustomScript: () =>
        set(() => ({
          customScript: null,
        })),

      // 检查清单相关
      toggleChecklistItem: (phase, index) =>
        set((state) => {
          const newChecklist = [...state.checklists[phase]];
          newChecklist[index] = !newChecklist[index];
          return {
            checklists: {
              ...state.checklists,
              [phase]: newChecklist,
            },
          };
        }),

      resetChecklistPhase: (phase) =>
        set((state) => ({
          checklists: {
            ...state.checklists,
            [phase]: defaultChecklists[phase],
          },
        })),

      // 重置
      resetAll: () =>
        set({
          progress: defaultProgress,
          settings: defaultSettings,
          practiceRecords: [],
          qaRecords: [],
          checklists: defaultChecklists,
          customContent: defaultCustomContent,
        }),

      resetProgress: () =>
        set((state) => ({
          progress: defaultProgress,
          practiceRecords: [],
          qaRecords: [],
          customContent: defaultCustomContent,
        })),
    }),
    {
      name: 'promotion-coach-storage',
      partialize: (state) => ({
        progress: state.progress,
        settings: state.settings,
        practiceRecords: state.practiceRecords,
        qaRecords: state.qaRecords,
        checklists: state.checklists,
        customContent: state.customContent,
        customScript: state.customScript,
      }),
      onRehydrateStorage: () => (state) => {
        // 数据恢复后自动去重一次
        if (state && !hasDeduplicated) {
          hasDeduplicated = true;
          // 检查是否有重复记录（通过检测ID格式）
          const hasDuplicates = state.practiceRecords.some((r, i, arr) =>
            arr.some((other, j) => i !== j && r.id === other.id)
          );
          if (hasDuplicates) {
            // 使用 Map 按日期去重
            const seen = new Map<string, typeof state.practiceRecords[0]>();
            state.practiceRecords.forEach((record) => {
              const key = `${record.segmentId}-${record.date}`;
              const existing = seen.get(key);
              if (!existing || new Date(record.date).getTime() > new Date(existing.date).getTime()) {
                seen.set(key, record);
              }
            });
            state.practiceRecords = Array.from(seen.values());
          }
        }
      },
    }
  )
);

// 选择器 hooks
export const useProgress = () => useStore((state) => state.progress);
export const useSettings = () => useStore((state) => state.settings);
export const usePracticeRecords = () => useStore((state) => state.practiceRecords);
export const useQARecords = () => useStore((state) => state.qaRecords);
export const useChecklists = () => useStore((state) => state.checklists);
export const useCustomContent = () => useStore((state) => state.customContent);
export const useCustomScript = () => useStore((state) => state.customScript);

// 计算剩余天数的 hook
export const useDaysRemaining = (): number | null => {
  const settings = useSettings();
  const interviewDate = settings.interviewDate;
  if (!interviewDate) return null;
  const now = new Date();
  const target = new Date(interviewDate);
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

// 计算整体进度的 hook
export const useOverallProgress = (): number => {
  const progress = useProgress();
  const completedCount = progress.completedDays.length;
  return Math.round((completedCount / progress.totalDays) * 100);
};
