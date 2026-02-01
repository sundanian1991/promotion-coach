// 练习计划内容数据
import { PracticeStage, PracticeTask } from '@/types';

/** 10-14天练习计划 */
export const practiceStages: PracticeStage[] = [
  {
    id: 'stage-1',
    name: '阶段一：结构记忆期',
    days: [1, 2, 3],
    title: '结构记忆期',
    description: '不记词，记结构。记住"讲什么"和"为什么讲"',
    tasks: [
      // 第1天
      {
        id: 'task-1-1',
        day: 1,
        title: '打印逐字稿，用颜色标注',
        description: '用黄色标核心数据，蓝色标连接词，红色标认知升华句',
        completed: false,
        type: 'memory',
      },
      {
        id: 'task-1-2',
        day: 1,
        title: '阅读记忆框架（三条主线）',
        description: '理解主线一（三次认知升级）、主线二（证据支撑）、主线三（时间线）',
        completed: false,
        type: 'memory',
      },
      {
        id: 'task-1-3',
        day: 1,
        title: '看骨架讲一遍（早晨）',
        description: '只看骨架版，自己讲一遍',
        completed: false,
        type: 'memory',
      },
      {
        id: 'task-1-4',
        day: 1,
        title: '不看骨架讲一遍（中午）',
        description: '尝试不看骨架，自己讲一遍',
        completed: false,
        type: 'memory',
      },
      {
        id: 'task-1-5',
        day: 1,
        title: '睡前不看骨架讲一遍（晚上）',
        description: '睡前复习，不看骨架讲一遍',
        completed: false,
        type: 'memory',
      },
      // 第2天
      {
        id: 'task-2-1',
        day: 2,
        title: '复习骨架版（早晨）',
        description: '只看骨架，讲一遍',
        completed: false,
        type: 'memory',
      },
      {
        id: 'task-2-2',
        day: 2,
        title: '不看骨架讲一遍（中午）',
        description: '尝试不看骨架，自己讲一遍',
        completed: false,
        type: 'memory',
      },
      {
        id: 'task-2-3',
        day: 2,
        title: '睡前不看骨架讲一遍（晚上）',
        description: '睡前复习，不看骨架讲一遍',
        completed: false,
        type: 'memory',
      },
      // 第3天
      {
        id: 'task-3-1',
        day: 3,
        title: '不看骨架完整讲一遍（早晨）',
        description: '尝试不看骨架，完整讲一遍',
        completed: false,
        type: 'memory',
      },
      {
        id: 'task-3-2',
        day: 3,
        title: '记录卡壳的地方（中午）',
        description: '记录哪些地方卡住了，重点记忆',
        completed: false,
        type: 'memory',
      },
      {
        id: 'task-3-3',
        day: 3,
        title: '睡前不看骨架完整讲一遍（晚上）',
        description: '睡前复习，确保流畅',
        completed: false,
        type: 'memory',
      },
    ],
  },
  {
    id: 'stage-2',
    name: '阶段二：自然表达期',
    days: [4, 5, 6],
    title: '自然表达期',
    description: '从"念稿"到"说话"。每天录音2次，听自己的录音',
    tasks: [
      // 第4天
      {
        id: 'task-4-1',
        day: 4,
        title: '练习开场+背景（1.5分钟）',
        description: '练10次以上，形成肌肉记忆',
        completed: false,
        type: 'expression',
      },
      {
        id: 'task-4-2',
        day: 4,
        title: '录音并复盘（早晨）',
        description: '录音后听：像说话吗？听得进去吗？记住什么了？',
        completed: false,
        type: 'expression',
      },
      {
        id: 'task-4-3',
        day: 4,
        title: '修改口语化表达（中午）',
        description: '把书面语改成口语："即"→"就是"，"故而"→"所以"',
        completed: false,
        type: 'expression',
      },
      {
        id: 'task-4-4',
        day: 4,
        title: '再次录音并复盘（晚上）',
        description: '加入停顿、重音、语调变化',
        completed: false,
        type: 'expression',
      },
      // 第5天
      {
        id: 'task-5-1',
        day: 5,
        title: '练习升级一（2.5分钟）',
        description: '这是重头戏，要讲得最有自信',
        completed: false,
        type: 'expression',
      },
      {
        id: 'task-5-2',
        day: 5,
        title: '练10次以上，确保数据准确（中午）',
        description: '每个数据都要准确',
        completed: false,
        type: 'expression',
      },
      {
        id: 'task-5-3',
        day: 5,
        title: '录音并复盘（晚上）',
        description: '关键数据要放慢语速',
        completed: false,
        type: 'expression',
      },
      // 第6天
      {
        id: 'task-6-1',
        day: 6,
        title: '练习升级二+三（3.5分钟）',
        description: '两个故事衔接要自然',
        completed: false,
        type: 'expression',
      },
      {
        id: 'task-6-2',
        day: 6,
        title: '练10次以上，控制时间（中午）',
        description: '时间控制在3.5分钟内',
        completed: false,
        type: 'expression',
      },
      {
        id: 'task-6-3',
        day: 6,
        title: '录音并复盘（晚上）',
        description: '两个故事过渡要自然',
        completed: false,
        type: 'expression',
      },
    ],
  },
  {
    id: 'stage-3',
    name: '阶段三：模拟实战期',
    days: [7, 8, 9, 10],
    title: '模拟实战期',
    description: '适应有人听的感觉。找听众，模拟评委提问',
    tasks: [
      // 第7天
      {
        id: 'task-7-1',
        day: 7,
        title: '完整串联练习',
        description: '完整讲一遍，录音',
        completed: false,
        type: 'simulation',
      },
      {
        id: 'task-7-2',
        day: 7,
        title: '听录音，找出不连贯的地方',
        description: '找出不连贯的地方',
        completed: false,
        type: 'simulation',
      },
      {
        id: 'task-7-3',
        day: 7,
        title: '再讲，再录，直到流畅（晚上）',
        description: '再讲，再录，直到流畅',
        completed: false,
        type: 'simulation',
      },
      // 第8-10天
      {
        id: 'task-8-1',
        day: 8,
        title: '找熟悉的人（家人/朋友）',
        description: '告诉他们不用给反馈，只需要认真听',
        completed: false,
        type: 'simulation',
      },
      {
        id: 'task-9-1',
        day: 9,
        title: '找同事/同行',
        description: '他们能理解业务，能给你专业反馈',
        completed: false,
        type: 'simulation',
      },
      {
        id: 'task-10-1',
        day: 10,
        title: '找不熟悉业务的人',
        description: '模拟评委场景，观察他们什么时候走神',
        completed: false,
        type: 'simulation',
      },
    ],
  },
  {
    id: 'stage-4',
    name: '阶段四：状态调试期',
    days: [11, 12, 13, 14],
    title: '状态调试期',
    description: '找到最佳表达状态。录像复盘，调整眼神、手势、表情、语速',
    tasks: [
      // 第11天
      {
        id: 'task-11-1',
        day: 11,
        title: '用手机录像，完整讲一遍',
        description: '完整讲一遍',
        completed: false,
        type: 'adjustment',
      },
      {
        id: 'task-11-2',
        day: 11,
        title: '看视频，检查眼神',
        description: '是在看镜头（评委），还是在看天上/地下？',
        completed: false,
        type: 'adjustment',
      },
      {
        id: 'task-11-3',
        day: 11,
        title: '检查手势',
        description: '是自然的，还是僵硬的？',
        completed: false,
        type: 'adjustment',
      },
      {
        id: 'task-11-4',
        day: 11,
        title: '检查表情',
        description: '是自信的微笑，还是紧张的面无表情？',
        completed: false,
        type: 'adjustment',
      },
      {
        id: 'task-11-5',
        day: 11,
        title: '检查语速和停顿',
        description: '是正常说话，还是在赶时间？有没有在"这是我的第X次认知升级"后留白？',
        completed: false,
        type: 'adjustment',
      },
      // 第12-14天
      {
        id: 'task-12-1',
        day: 12,
        title: '根据录像反馈调整',
        description: '根据反馈调整：语速太快？表情僵硬？手势不知道放哪？',
        completed: false,
        type: 'adjustment',
      },
      {
        id: 'task-13-1',
        day: 13,
        title: '继续录像练习',
        description: '继续录像练习，确保状态稳定',
        completed: false,
        type: 'adjustment',
      },
      {
        id: 'task-14-1',
        day: 14,
        title: '最后模拟：完整练习2遍',
        description: '确保状态稳定，信心满满',
        completed: false,
        type: 'adjustment',
      },
    ],
  },
];

/** 获取指定天数的任务 */
export function getTasksByDay(day: number): PracticeTask[] {
  const allTasks: PracticeTask[] = [];
  for (const stage of practiceStages) {
    allTasks.push(...stage.tasks.filter(t => t.day === day));
  }
  return allTasks;
}

/** 获取指定阶段的任务 */
export function getTasksByStage(stageId: string): PracticeTask[] {
  const stage = practiceStages.find(s => s.id === stageId);
  return stage?.tasks || [];
}

/** 获取指定天数所在的阶段 */
export function getStageByDay(day: number): PracticeStage | undefined {
  return practiceStages.find(s => s.days.includes(day));
}

/** 阶段类型说明 */
export const stageTypeDescriptions = {
  memory: '重点：记住结构，不记词',
  expression: '重点：从念稿到说话，加入停顿、重音、语调',
  simulation: '重点：适应有人听的感觉',
  adjustment: '重点：调整眼神、手势、表情、语速',
};
