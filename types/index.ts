// 述职辅导应用 - 类型定义

// ============================================
// 核心数据类型
// ============================================

/** 逐字稿段落 */
export interface ScriptSegment {
  id: string;
  title: string;
  duration: number; // 建议时长（秒）
  fullContent: string;
  skeletonContent: string;
  keyPoints: string[];
  dataPoints: Array<{ label: string; value: string; highlight?: boolean }>;
  transition?: string; // 串场词
}

/** 练习阶段 */
export interface PracticeStage {
  id: string;
  name: string;
  days: number[]; // 第几天到第几天
  title: string;
  description: string;
  tasks: PracticeTask[];
}

/** 练习任务 */
export interface PracticeTask {
  id: string;
  day: number;
  title: string;
  description: string;
  completed: boolean;
  type: 'memory' | 'expression' | 'simulation' | 'adjustment';
}

/** 问答问题 */
export interface QAItem {
  id: string;
  category: QACategory;
  question: string;
  coreAnswer: string; // 一句话核心回答
  framework?: {
    type: 'SARA' | 'PREP';
    steps: string[];
  };
  referenceAnswer?: string;
  difficulty: 1 | 2 | 3;
  practiced?: boolean;
}

export type QACategory = 'ability' | 'detail' | 'challenge' | 'future' | 'pressure';

/** 问答分类显示名称 */
export const QACategoryNames: Record<QACategory, string> = {
  ability: '能力判断',
  detail: '项目细节',
  challenge: '失败与挑战',
  future: '未来规划',
  pressure: '压力测试'
};

// ============================================
// 心理建设类型
// ============================================

/** 心理挑战 */
export interface MindsetChallenge {
  id: string;
  title: string;
  description: string;
  truth: string; // 真相
  reframing: ReframingCard[];
  methods: string[];
}

/** 认知重构卡片 */
export interface ReframingCard {
  negative: string; // 消极想法
  positive: string; // 积极重构
}

// ============================================
// 临场应对类型
// ============================================

/** 应对场景 */
export interface ScenarioCard {
  id: string;
  title: string;
  state: string; // 当前状态
  strategy: string; // 应对策略
  actions: string[]; // 具体行动
  tips?: string[];
}

// ============================================
// 检查清单类型
// ============================================

/** 检查清单阶段 */
export type ChecklistPhase = 'preOneDay' | 'pre30min' | 'pre5min' | 'duringSelf' | 'duringQA' | 'post';

/** 检查清单项 */
export interface ChecklistItem {
  id: string;
  phase: ChecklistPhase;
  text: string;
  checked: boolean;
}

// ============================================
// 快速参考类型
// ============================================

/** 核心骨架 */
export interface CoreSkeleton {
  opening: string;
  background: string;
  upgrades: Array<{
    order: number;
    from: string;
    to: string;
    story: string;
    result: string;
  }>;
  summary: string;
  future: string;
}

/** 关键数据 */
export interface KeyData {
  category: string;
  items: Array<{ label: string; value: string; highlight?: boolean }>;
}

/** 应对策略 */
export interface CopingStrategy {
  scenario: string;
  strategy: string;
}

/** 问答框架 */
export interface AnswerFramework {
  name: string;
  acronym: string;
  steps: Array<{ letter: string; description: string; example: string }>;
}

// ============================================
// 用户状态类型
// ============================================

/** 练习进度 */
export interface ProgressState {
  currentDay: number;
  completedDays: number[];
  completedTasks: string[]; // 已完成的任务ID列表
  lastPracticeDate: string | null;
  practiceStreak: number;
  totalDays: number; // 总计划天数，默认10天
}

/** 用户设置 */
export interface UserSettings {
  interviewDate: string | null; // 述职日期
  safeWords: string[]; // 自定义安全词
  preferredVersion: 'full' | 'skeleton'; // 首选版本
}

/** 练习记录 */
export interface PracticeRecord {
  id: string;
  date: string;
  segmentId: string;
  duration: number; // 练习时长（秒）
  notes?: string;
}

/** 问答记录 */
export interface QARecord {
  id: string;
  questionId: string;
  answer: string;
  rating: 'good' | 'need_improvement';
  timestamp: string;
}

/** 应用状态 */
export interface AppState {
  // 进度
  progress: ProgressState;

  // 设置
  settings: UserSettings;

  // 练习记录
  practiceRecords: PracticeRecord[];

  // 问答记录
  qaRecords: QARecord[];

  // 检查清单
  checklists: Record<ChecklistPhase, boolean[]>;

  // 自定义内容（用户编辑后的逐字稿内容）
  customContent: Record<string, { full: string; skeleton: string }>;

  // 用户导入的自定义讲稿
  customScript: ScriptSegment[] | null;
}

// ============================================
// 默认值
// ============================================

export const defaultProgress: ProgressState = {
  currentDay: 1,
  completedDays: [],
  completedTasks: [],
  lastPracticeDate: null,
  practiceStreak: 0,
  totalDays: 10,
};

export const defaultSettings: UserSettings = {
  interviewDate: null,
  safeWords: ['三次认知升级', '从...到...', '7家到33家'],
  preferredVersion: 'full',
};

export const defaultChecklists: Record<ChecklistPhase, boolean[]> = {
  preOneDay: [false, false, false, false],
  pre30min: [false, false, false, false],
  pre5min: [false, false, false, false],
  duringSelf: [false, false, false, false, false],
  duringQA: [false, false, false, false, false],
  post: [false, false, false],
};

export const defaultCustomContent: Record<string, { full: string; skeleton: string }> = {};
