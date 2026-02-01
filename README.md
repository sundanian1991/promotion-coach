# 🎯 Promotion Coach

> 帮你轻松搞定晋升述职！结构化练习 + 实战指南

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## ✨ 简介

Promotion Coach 是一个专为晋升述职准备设计的练习与辅导平台。通过结构化的分段练习、实战问答准备、检查清单等功能，帮助你系统化地准备晋升述职，提升成功率。

## 🎯 核心功能

### 📊 首页仪表盘
- **倒计时提醒** - 距离述职还有多少天，时刻保持目标感
- **进度可视化** - 环形图展示各模块完成进度
- **今日任务** - 智能推荐今日练习内容
- **练习统计** - 记录总时长、练习次数等数据

### 🎤 结构化练习
- **分段练习** - 按开场、核心内容、结尾分段练习
- **完整练习** - 8分钟完整串讲模式
- **计时器** - 精确控制每段练习时长
- **练习记录** - 自动记录每次练习数据

### 📋 问答准备
- **常见问题库** - 涵盖各类常见面试问题
- **答题框架** - STAR法则等答题技巧
- **模拟练习** - 限时回答模拟真实场景

### ✅ 检查清单
- **材料准备** - 确保所有材料齐全
- **内容要点** - 不遗漏关键内容
- **注意事项** - 避免常见错误

### 📚 快速参考
- **关键数据** - 一键查看核心指标
- **常用话术** - 精选表达模板
- **应急方案** - 应对突发情况

### 🧠 心态指南
- **焦虑缓解** - 应对紧张情绪的方法
- **自信建立** - 增强表达信心
- **心态调整** - 保持最佳状态

### 📖 领域指南
- **业务理解** - 深入了解业务领域
- **技术深度** - 展现技术能力
- **战略思维** - 体现更高层次思考

### 📄 报告导出
- **PDF导出** - 生成完整的练习报告
- **数据图表** - 可视化练习数据
- **分享功能** - 与导师或同事分享

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm / yarn / pnpm

### 安装

```bash
# 克隆项目
git clone https://github.com/your-username/promotion-coach.git
cd promotion-coach/app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建

```bash
# 生产构建
npm run build

# 启动生产服务器
npm start
```

## 🛠️ 技术栈

| 技术 | 说明 |
|------|------|
| **Next.js 16** | React 框架，App Router |
| **React 19** | UI 库 |
| **TypeScript** | 类型安全 |
| **Tailwind CSS 4** | 样式框架 |
| **Radix UI** | 无障碍组件库 |
| **Zustand** | 轻量状态管理 |
| **React Spring** | 动画库 |
| **Tremor** | 数据可视化 |
| **Vitest** | 单元测试 |

## 📁 项目结构

```
app/
├── app/                    # Next.js App Router 页面
│   ├── checklist/         # 检查清单
│   ├── field-guide/       # 领域指南
│   ├── mindset/           # 心态指南
│   ├── practice/          # 练习模块
│   ├── qa/                # 问答准备
│   ├── quick-ref/         # 快速参考
│   └── page.tsx           # 首页仪表盘
├── components/            # 共享组件
│   ├── dashboard/         # 仪表盘组件
│   ├── practice/          # 练习组件
│   └── ui/                # UI 基础组件
├── lib/                   # 工具函数和状态管理
├── types/                 # TypeScript 类型定义
└── public/                # 静态资源
```

## 🎨 设计理念

- **极简主义** - 界面简洁，专注内容
- **黑白 + 蓝色点缀** - 专业不失活力
- **Bento Grid 布局** - 现代化卡片式设计
- **流畅动画** - 提升用户体验
- **响应式设计** - 完美支持桌面和移动端

## 📝 开发计划

- [ ] 语音练习模式
- [ ] AI 智能评分
- [ ] 多用户支持
- [ ] 数据云同步
- [ ] 移动端 App

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT License

---

**Made with ❤️ for your promotion success**
