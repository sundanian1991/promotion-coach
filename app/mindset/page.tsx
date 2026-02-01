// 心理建设页面 - Minimalist 黑白 + 蓝色点缀
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  mindsetChallenges,
  safeWordsInfo,
  judgeMindset,
} from '@/lib/content';
import { Wind, Brain, MessageSquare, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

// 呼吸阶段类型
type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale';

export default function MindsetPage() {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('idle');
  const [breathCount, setBreathCount] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  // 呼吸练习控制
  const startBreathing = useCallback(() => {
    setBreathingActive(true);
    setBreathPhase('inhale');
    setBreathCount(1);
    setCycleCount(1);
  }, []);

  const stopBreathing = useCallback(() => {
    setBreathingActive(false);
    setBreathPhase('idle');
    setBreathCount(0);
    setCycleCount(0);
  }, []);

  // 呼吸循环逻辑
  useEffect(() => {
    if (!breathingActive) return;

    const runBreathCycle = () => {
      // 吸气 4秒
      setBreathPhase('inhale');
      let count = 1;
      setBreathCount(count);

      const inhaleInterval = setInterval(() => {
        count++;
        setBreathCount(count);
        if (count >= 4) {
          clearInterval(inhaleInterval);
          // 屏息 2秒
          setBreathPhase('hold');
          setBreathCount(0);

          setTimeout(() => {
            // 呼气 6秒
            setBreathPhase('exhale');
            let exhaleCount = 1;
            setBreathCount(exhaleCount);

            const exhaleInterval = setInterval(() => {
              exhaleCount++;
              setBreathCount(exhaleCount);
              if (exhaleCount >= 6) {
                clearInterval(exhaleInterval);
                // 一个周期完成
                setCycleCount((prev) => {
                  const next = prev + 1;
                  if (next > 3) {
                    // 完成3个周期
                    stopBreathing();
                    return 0;
                  }
                  // 继续下一个周期
                  setTimeout(runBreathCycle, 500);
                  return next;
                });
              }
            }, 1000);
          }, 2000);
        }
      }, 1000);
    };

    runBreathCycle();
  }, [breathingActive, stopBreathing]);

  // 呼吸圈大小
  const getBreathScale = () => {
    switch (breathPhase) {
      case 'inhale':
        return 1 + (breathCount / 4) * 0.5;
      case 'hold':
        return 1.5;
      case 'exhale':
        return 1.5 - (breathCount / 6) * 0.5;
      default:
        return 1;
    }
  };

  // 阶段文字
  const getPhaseText = () => {
    switch (breathPhase) {
      case 'inhale':
        return { text: '吸气', subtext: `${breathCount} / 4` };
      case 'hold':
        return { text: '屏息', subtext: '保持' };
      case 'exhale':
        return { text: '呼气', subtext: `${breathCount} / 6` };
      default:
        return { text: '准备', subtext: '点击开始' };
    }
  };

  const phaseInfo = getPhaseText();
  const breathScale = getBreathScale();

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">心理建设</h1>
        <p className="text-sm text-muted-foreground">应对紧张、评委心态、质疑反应</p>
      </div>

      {/* 呼吸练习 */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-base">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <div>4-7-8 呼吸法</div>
              <p className="text-xs font-normal text-muted-foreground">
                科学验证的快速减压技巧
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* 呼吸可视化区域 */}
          <div className="relative flex flex-col items-center justify-center py-10">
            {/* 外圈波纹 */}
            {breathingActive && (
              <>
                <div
                  className={cn(
                    'absolute w-48 h-48 rounded-full border border-primary/20 transition-all duration-1000',
                    breathPhase === 'inhale' && 'scale-150 opacity-0',
                    breathPhase === 'hold' && 'scale-125 opacity-50',
                    breathPhase === 'exhale' && 'scale-100 opacity-0'
                  )}
                />
              </>
            )}

            {/* 主呼吸圈 */}
            <div
              className={cn(
                'relative w-48 h-48 rounded-full bg-secondary flex items-center justify-center',
                'transition-all duration-1000 ease-out'
              )}
              style={{
                transform: `scale(${breathScale})`,
              }}
            >
              {/* 内圈 */}
              <div className="absolute inset-4 rounded-full bg-background" />

              {/* 中心文字 */}
              <div className="relative z-10 text-center">
                <div className="text-2xl font-semibold mb-0.5">{phaseInfo.text}</div>
                <div className="text-sm text-muted-foreground">{phaseInfo.subtext}</div>
              </div>
            </div>

            {/* 周期指示器 */}
            {breathingActive && (
              <div className="mt-6 flex items-center gap-2">
                {[1, 2, 3].map((cycle) => (
                  <div
                    key={cycle}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all duration-500',
                      cycleCount >= cycle ? 'bg-foreground' : 'bg-secondary'
                    )}
                  />
                ))}
                <span className="ml-2 text-xs text-muted-foreground">
                  第 {cycleCount} / 3 轮
                </span>
              </div>
            )}

            {/* 控制按钮 */}
            <div className="mt-6">
              {!breathingActive ? (
                <Button size="lg" onClick={startBreathing} className="gap-2 px-6">
                  <Play className="w-4 h-4" />
                  开始呼吸练习
                </Button>
              ) : (
                <Button size="lg" variant="outline" onClick={stopBreathing} className="gap-2 px-6">
                  <Pause className="w-4 h-4" />
                  停止练习
                </Button>
              )}
            </div>
          </div>

          {/* 说明文字 */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-lg font-semibold mb-0.5">4秒</div>
              <div className="text-xs text-muted-foreground">深吸气</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold mb-0.5">2秒</div>
              <div className="text-xs text-muted-foreground">屏住呼吸</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold mb-0.5">6秒</div>
              <div className="text-xs text-muted-foreground">缓慢呼气</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 四大心理挑战 */}
      <Tabs defaultValue="challenge-1">
        <TabsList className="grid w-full grid-cols-4">
          {mindsetChallenges.map((challenge) => (
            <TabsTrigger key={challenge.id} value={challenge.id} className="text-xs">
              {challenge.title.split(' ')[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {mindsetChallenges.map((challenge) => (
          <TabsContent key={challenge.id} value={challenge.id}>
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  {challenge.title}
                  <Badge variant="outline" className="text-xs">
                    {challenge.description}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 真相 */}
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="font-medium mb-1.5 flex items-center gap-2 text-sm">
                    <Brain className="w-4 h-4" />
                    真相
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{challenge.truth}</p>
                </div>

                {/* 认知重构 */}
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    认知重构
                  </h3>
                  <div className="space-y-2">
                    {challenge.reframing.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-sm p-3 rounded-lg bg-secondary/30"
                      >
                        <span className="text-muted-foreground line-through flex-1">
                          {item.negative}
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-medium flex-1">{item.positive}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 应对方法 */}
                <div>
                  <h3 className="font-medium mb-2 text-sm">应对方法</h3>
                  <ul className="space-y-2">
                    {challenge.methods.map((method, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm p-3 rounded-lg bg-secondary/30"
                      >
                        <span className="w-5 h-5 rounded-full bg-background border flex items-center justify-center text-xs font-medium shrink-0 mt-0">
                          {index + 1}
                        </span>
                        <span>{method}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* 评委心态 */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            评委在想什么？
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {judgeMindset.thoughts.map((item, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border hover:bg-secondary/30 transition-colors"
              >
                <div className="font-medium text-sm mb-1">"{item.thought}"</div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  {item.explanation}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 安全词 */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Wind className="w-4 h-4" />
            </div>
            安全词（紧张时默念）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{safeWordsInfo.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {safeWordsInfo.defaultSafeWords.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border bg-secondary/30 text-center hover:border-primary/30 transition-colors"
              >
                <div className="font-semibold text-lg mb-1">{item.word}</div>
                <div className="text-xs text-muted-foreground">{item.meaning}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
