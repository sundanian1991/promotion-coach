// 快速参考页面
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  coreSkeleton,
  keyData,
  copingStrategies,
  answerFrameworks,
  safeWords,
  elevatorPitch,
} from '@/lib/content';

export default function QuickRefPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">快速参考</h1>
        <p className="text-muted-foreground">
          核心骨架、关键数据、应对策略一览
        </p>
      </div>

      {/* 核心骨架 */}
      <Card>
        <CardHeader>
          <CardTitle>核心骨架（必记）</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4 pr-4">
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Badge>开场</Badge>
                </h3>
                <p className="text-sm">{coreSkeleton.opening}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Badge>背景</Badge>
                </h3>
                <p className="text-sm">{coreSkeleton.background}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-2">三次认知升级</h3>
                <div className="space-y-3">
                  {coreSkeleton.upgrades.map((upgrade) => (
                    <div key={upgrade.order} className="pl-4 border-l-2 border-primary">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">升级 {upgrade.order}</Badge>
                        <span className="text-sm font-medium">
                          {upgrade.from} → {upgrade.to}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {upgrade.story}
                      </p>
                      <p className="text-sm text-primary font-medium">
                        {upgrade.result}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Badge>总结</Badge>
                </h3>
                <p className="text-sm font-medium text-primary">
                  {coreSkeleton.summary}
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Badge>未来</Badge>
                </h3>
                <p className="text-sm">{coreSkeleton.future}</p>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* 关键数据 */}
      <Card>
        <CardHeader>
          <CardTitle>关键数据</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {keyData.map((category) => (
              <div key={category.category}>
                <h3 className="font-semibold mb-2">{category.category}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {category.items.map((item, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded border text-center ${
                        item.highlight
                          ? 'border-primary bg-primary/10 font-bold'
                          : 'bg-muted/30'
                      }`}
                    >
                      <div className="text-xs text-muted-foreground">
                        {item.label}
                      </div>
                      <div className="text-sm">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 应对策略 */}
      <Card>
        <CardHeader>
          <CardTitle>应对策略速查</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {copingStrategies.map((item, index) => (
              <div key={index} className="p-3 rounded-lg border bg-card">
                <div className="font-medium text-sm mb-1">{item.scenario}</div>
                <div className="text-xs text-muted-foreground">
                  {item.strategy}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 问答框架 */}
      <Card>
        <CardHeader>
          <CardTitle>问答框架</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {answerFrameworks.map((framework) => (
              <div key={framework.name} className="p-4 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2">{framework.name}</h3>
                <div className="text-xs text-muted-foreground mb-3">
                  {framework.acronym}
                </div>
                <div className="space-y-2">
                  {framework.steps.map((step, index) => (
                    <div key={index} className="flex gap-2 text-sm">
                      <Badge variant="outline" className="shrink-0">
                        {step.letter}
                      </Badge>
                      <div>
                        <div className="font-medium">{step.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {step.example}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 安全词 */}
      <Card>
        <CardHeader>
          <CardTitle>安全词（紧张时默念）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {safeWords.map((item, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-primary/20 bg-primary/5 text-center"
              >
                <div className="font-bold text-primary mb-1">{item.word}</div>
                <div className="text-xs text-muted-foreground">{item.meaning}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 电梯演讲版 */}
      <Card>
        <CardHeader>
          <CardTitle>电梯演讲版（40秒）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-muted/50 whitespace-pre-wrap leading-relaxed text-sm">
            {elevatorPitch}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
