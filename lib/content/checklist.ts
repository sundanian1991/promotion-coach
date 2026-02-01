// 检查清单内容数据
import { ChecklistItem, ChecklistPhase } from '@/types';

/** 所有检查清单项 */
export const checklistItems: ChecklistItem[] = [
  // 述职前1天
  {
    id: 'pre-1',
    phase: 'preOneDay',
    text: '完整练习2遍（录音）',
    checked: false,
  },
  {
    id: 'pre-2',
    phase: 'preOneDay',
    text: '准备好PPT翻页笔/遥控器',
    checked: false,
  },
  {
    id: 'pre-3',
    phase: 'preOneDay',
    text: '检查着装（正式、舒适）',
    checked: false,
  },
  {
    id: 'pre-4',
    phase: 'preOneDay',
    text: '早睡（保证精神状态）',
    checked: false,
  },

  // 述职当天提前30分钟
  {
    id: 'day30-1',
    phase: 'pre30min',
    text: '熟悉场地/会议室',
    checked: false,
  },
  {
    id: 'day30-2',
    phase: 'pre30min',
    text: '测试设备（PPT、声音、网络）',
    checked: false,
  },
  {
    id: 'day30-3',
    phase: 'pre30min',
    text: '去洗手间',
    checked: false,
  },
  {
    id: 'day30-4',
    phase: 'pre30min',
    text: '喝适量水（不要太饱也不要太渴）',
    checked: false,
  },

  // 述职当天提前5分钟
  {
    id: 'day5-1',
    phase: 'pre5min',
    text: '深呼吸3次',
    checked: false,
  },
  {
    id: 'day5-2',
    phase: 'pre5min',
    text: '活动肩膀和脖子',
    checked: false,
  },
  {
    id: 'day5-3',
    phase: 'pre5min',
    text: '默念安全词"三次认知升级"',
    checked: false,
  },
  {
    id: 'day5-4',
    phase: 'pre5min',
    text: '心理暗示："我准备好了"',
    checked: false,
  },

  // 述职中 - 8分钟自述
  {
    id: 'dur-self-1',
    phase: 'duringSelf',
    text: '开场微笑，眼神交流',
    checked: false,
  },
  {
    id: 'dur-self-2',
    phase: 'duringSelf',
    text: '语速适中，关键处停顿',
    checked: false,
  },
  {
    id: 'dur-self-3',
    phase: 'duringSelf',
    text: '数据准确，不卡顿',
    checked: false,
  },
  {
    id: 'dur-self-4',
    phase: 'duringSelf',
    text: '"这是我的第X次认知升级"处加重语气并停顿2秒',
    checked: false,
  },
  {
    id: 'dur-self-5',
    phase: 'duringSelf',
    text: '时间控制在7.5-8分钟',
    checked: false,
  },

  // 述职中 - 10分钟问答
  {
    id: 'dur-qa-1',
    phase: 'duringQA',
    text: '每个问题停顿2秒再回答',
    checked: false,
  },
  {
    id: 'dur-qa-2',
    phase: 'duringQA',
    text: '用SARA框架组织答案',
    checked: false,
  },
  {
    id: 'dur-qa-3',
    phase: 'duringQA',
    text: '不懂的问题诚实承认',
    checked: false,
  },
  {
    id: 'dur-qa-4',
    phase: 'duringQA',
    text: '被质疑时先理解再澄清',
    checked: false,
  },
  {
    id: 'dur-qa-5',
    phase: 'duringQA',
    text: '结束时主动问1-2个问题',
    checked: false,
  },

  // 述职后
  {
    id: 'post-1',
    phase: 'post',
    text: '记录评委的问题（能记住的）',
    checked: false,
  },
  {
    id: 'post-2',
    phase: 'post',
    text: '记录自己的感受',
    checked: false,
  },
  {
    id: 'post-3',
    phase: 'post',
    text: '不要立即评判自己（无论好坏）',
    checked: false,
  },
];

/** 按阶段获取清单 */
export function getChecklistByPhase(phase: ChecklistPhase): ChecklistItem[] {
  return checklistItems.filter(item => item.phase === phase);
}

/** 阶段显示名称 */
export const phaseNames: Record<ChecklistPhase, string> = {
  preOneDay: '述职前1天',
  pre30min: '述职当天 - 提前30分钟',
  pre5min: '述职当天 - 提前5分钟',
  duringSelf: '述职中 - 8分钟自述',
  duringQA: '述职中 - 10分钟问答',
  post: '述职后',
};

/** 阶段说明 */
export const phaseDescriptions: Record<ChecklistPhase, string> = {
  preOneDay: '确保准备充分，状态最佳',
  pre30min: '提前到场，熟悉环境，测试设备',
  pre5min: '调整心态，进入状态',
  duringSelf: '自信表达，控制时间',
  duringQA: '从容应对，展现思考',
  post: '记录复盘，持续成长',
};
