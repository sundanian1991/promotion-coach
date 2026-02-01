// 临场应对页面
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { scenarioCards, coreSkeletonQuick, fieldGuideCopingStrategies as copingStrategies } from '@/lib/content';
import { AlertCircle, Target, Zap } from 'lucide-react';

export default function FieldGuidePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">临场应对手册</h1>
        <p className="text-muted-foreground">
          突发场景应对策略，助你从容应对
        </p>
      </div>

      {/* 五大场景卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarioCards.map((scenario) => (
          <Card key={scenario.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {scenario.title}
                </span>
                <Badge variant="secondary">{scenario.state}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Target className="w-4 h-4 text-primary" />
                  应对策略
                </div>
                <p className="text-sm text-muted-foreground">
                  {scenario.strategy}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  具体行动
                </div>
                <ul className="space-y-1">
                  {scenario.actions.map((action, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {scenario.tips && (
                <div className="p-2 rounded bg-muted/50">
                  <div className="text-xs font-medium mb-1">小贴士</div>
                  <ul className="space-y-1">
                    {scenario.tips.map((tip, index) => (
                      <li key={index} className="text-xs text-muted-foreground">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 核心骨架速查 */}
      <Card>
        <CardHeader>
          <CardTitle>核心骨架速查（脑子空白时用）</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <pre className="whitespace-pre-wrap text-sm font-mono">
              {coreSkeletonQuick.content}
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* 应对策略速查表 */}
      <Card>
        <CardHeader>
          <CardTitle>应对策略速查表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {copingStrategies.strategies.map((item, index) => (
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
    </div>
  );
}
