// 快速参考内容数据
import { CoreSkeleton, KeyData, CopingStrategy, AnswerFramework } from '@/types';

/** 核心骨架 */
export const coreSkeleton: CoreSkeleton = {
  opening: '三次认知升级',
  background: '7家→33家供应商，1条线→4条线，几百人→3239人',
  upgrades: [
    {
      order: 1,
      from: '解决问题',
      to: '预防问题',
      story: '去年4个业务合并后，建体系、编手册、推线上、促共识',
      result: '效率+2小时/天，上线集团制度中心',
    },
    {
      order: 2,
      from: '完美规划',
      to: '快速试错',
      story: '去年5月宿迁职场，借机捡漏、借力破局、并行加速',
      result: '19人、120%业绩、拿到40人HC',
    },
    {
      order: 3,
      from: '被动执行',
      to: '主动服务',
      story: '6月底7月初线路应急，广寻源、快判断、超配储',
      result: '3周恢复，避免37亿GMV/周损失',
    },
  ],
  summary: '我不是管33家供应商，是构建持续运转的供应链体系',
  future: 'BPO联盟 + AI Agents + 传帮带',
};

/** 关键数据 */
export const keyData: KeyData[] = [
  {
    category: '规模跨越',
    items: [
      { label: '供应商跨越', value: '7家 → 33家', highlight: true },
      { label: '业务线跨越', value: '1条 → 4条' },
      { label: '团队规模', value: '几百人 → 3239人' },
      { label: 'GMV贡献', value: '1970亿', highlight: true },
    ],
  },
  {
    category: '绩效成绩',
    items: [
      { label: '绩效', value: 'Q3/Q4/年度 A', highlight: true },
      { label: '奖项', value: '两次匠心独运奖' },
      { label: '跨部门', value: '2个C2部门、3个C3部门' },
    ],
  },
  {
    category: '三次升级数据',
    items: [
      { label: '供应商数量', value: '33家' },
      { label: '效率提升', value: '+2小时/天' },
      { label: '宿迁职场周期', value: '3个月' },
      { label: '宿迁业绩', value: '120%', highlight: true },
      { label: '宿迁HC', value: '40人' },
      { label: '线路恢复周期', value: '3周' },
      { label: '避免损失', value: '37亿GMV/周', highlight: true },
    ],
  },
  {
    category: '未来规划',
    items: [
      { label: 'BPO联盟', value: '2026年Q2启动' },
      { label: 'AI Agents', value: '探索中' },
    ],
  },
];

/** 应对策略 */
export const copingStrategies: CopingStrategy[] = [
  { scenario: '紧张', strategy: '深呼吸 + 默念"三次认知升级"' },
  { scenario: '脑子空白', strategy: '跳过细节，只讲核心骨架' },
  { scenario: '被打断', strategy: '停顿2秒，用PREP框架回答' },
  { scenario: '不会的问题', strategy: '承认 + 关联已知 + 学习意愿' },
  { scenario: '时间不够', strategy: '跳到电梯演讲版（40秒）' },
  { scenario: '被质疑', strategy: '用SARA框架：承认-回答-理由-升华' },
];

/** 问答框架 */
export const answerFrameworks: AnswerFramework[] = [
  {
    name: 'PREP框架',
    acronym: 'PREP',
    steps: [
      {
        letter: 'P',
        description: '结论',
        example: '我认为自己达到P7的核心理由是：从7家到33家的跨越中，完成了三次认知升级',
      },
      {
        letter: 'R',
        description: '理由',
        example: '这个跨越倒逼我必须从"把事做成"进化到"做成体系"',
      },
      {
        letter: 'E',
        description: '例子',
        example: '比如全生命周期管理，我建体系、编手册、推线上',
      },
      {
        letter: 'P',
        description: '重申结论',
        example: '所以从执行到体系设计，这就是P6到P7的差别',
      },
    ],
  },
  {
    name: 'SARA框架',
    acronym: 'SARA',
    steps: [
      {
        letter: 'S',
        description: '承认/复述',
        example: '"我理解您的疑问，您是说您觉得这些项目更像是执行层面的工作？"',
      },
      {
        letter: 'A',
        description: '回答',
        example: '"但我想说的是，P6和P7的差别不在于做了什么，而在于为什么做"',
      },
      {
        letter: 'R',
        description: '理由',
        example: '"比如全生命周期管理，我本可以继续人工管理，但我选择花时间建体系"',
      },
      {
        letter: 'A',
        description: '升华',
        example: '"这个"为什么做"的思考，就是P7的思维"',
      },
    ],
  },
];

/** 安全词列表 */
export const safeWords = [
  { word: '三次认知升级', meaning: '开场主线，最熟悉' },
  { word: '从...到...', meaning: '认知跃升的核心框架' },
  { word: '7家到33家', meaning: '数字对比，清晰明确' },
];

/** 电梯演讲版（40秒版本） */
export const elevatorPitch = `【电梯演讲版 - 40秒】

从7家供应商到33家，这个跨越倒逼我完成了三次认知升级：

第一次，从解决问题到预防问题——我搭建了全生命周期管理体系，让组织不依赖我也能运转。

第二次，从完美规划到快速试错——宿迁职场我快速试错找到最优解，3个月达成120%业绩。

第三次，从被动执行到主动服务——线路应急我主动补位，3周恢复业务。

我认为自己达到P7的核心理由是：我不是在管33家供应商，而是为金科电销业务，构建一个能持续运转的供应链体系。

未来我会推动BPO联盟机制，从价格压降转向价值共创。

谢谢。`;

/** 时间分配 */
export const timeAllocation = {
  total: 480, // 8分钟 = 480秒
  segments: [
    { part: '开场', duration: 40, percentage: 8 },
    { part: '背景', duration: 50, percentage: 10 },
    { part: '升级一', duration: 150, percentage: 31 },
    { part: '升级二', duration: 120, percentage: 25 },
    { part: '升级三', duration: 90, percentage: 19 },
    { part: '总结', duration: 60, percentage: 13 },
  ],
};
