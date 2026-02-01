// 问答练习页面
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  qaItems,
  getQuestionsByCategory,
  QACategoryNames,
  getRandomQuestion,
  saraFramework,
  prepFramework,
} from '@/lib/content';
import type { QACategory } from '@/types';
import { Shuffle, Lightbulb } from 'lucide-react';

export default function QAPage() {
  const [selectedQuestion, setSelectedQuestion] = useState(qaItems[0]);
  const [userAnswer, setUserAnswer] = useState('');
  const [showReference, setShowReference] = useState(false);
  const [activeCategory, setActiveCategory] = useState<QACategory>('ability');

  const categories: QACategory[] = ['ability', 'detail', 'challenge', 'future', 'pressure'];
  const categoryQuestions = getQuestionsByCategory(activeCategory);

  const handleRandomQuestion = () => {
    setSelectedQuestion(getRandomQuestion());
    setUserAnswer('');
    setShowReference(false);
  };

  const currentQuestion = selectedQuestion;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">问答练习</h1>
        <p className="text-muted-foreground">
          模拟评委提问，使用SARA框架回答
        </p>
      </div>

      {/* 问答框架提示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SARA框架</CardTitle>
            <p className="text-xs text-muted-foreground">
              应对评委质疑，特别是被质疑"只是执行"时
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {saraFramework.steps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <Badge variant="outline" className="shrink-0">
                    {step.letter}
                  </Badge>
                  <div>
                    <div className="font-medium">{step.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {step.example}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">PREP框架</CardTitle>
            <p className="text-xs text-muted-foreground">
              结构化回答问题，特别适合被打断时快速表达
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {prepFramework.steps.map((step, index) => (
                <div key={index} className="flex gap-2">
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
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as QACategory)}>
        <TabsList className="grid w-full grid-cols-5">
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat} className="text-sm">
              {QACategoryNames[cat]}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {QACategoryNames[category]} ({categoryQuestions.length}题)
              </h3>
              <Button size="sm" variant="outline" onClick={handleRandomQuestion}>
                <Shuffle className="w-4 h-4 mr-2" />
                随机抽题
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 问题列表 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">问题列表</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categoryQuestions.map((question) => (
                      <button
                        key={question.id}
                        onClick={() => {
                          setSelectedQuestion(question);
                          setUserAnswer('');
                          setShowReference(false);
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedQuestion.id === question.id
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card hover:bg-accent/50'
                        }`}
                      >
                        <div className="text-sm font-medium line-clamp-2">
                          {question.question}
                        </div>
                        <div className="flex gap-1 mt-1">
                          {Array.from({ length: question.difficulty }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${
                                selectedQuestion.id === question.id
                                  ? 'text-primary-foreground/70'
                                  : 'text-yellow-500'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 练习区域 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">练习回答</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">
                        {QACategoryNames[currentQuestion.category]}
                      </Badge>
                      <div className="flex gap-0.5">
                        {Array.from({ length: currentQuestion.difficulty }).map((_, i) => (
                          <span key={i} className="text-xs text-yellow-500">
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 className="font-medium">{currentQuestion.question}</h3>
                  </div>

                  {currentQuestion.coreAnswer && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Lightbulb className="w-3 h-3" />
                        一句话核心回答
                      </div>
                      <p className="text-sm">{currentQuestion.coreAnswer}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">你的回答</label>
                    <Textarea
                      placeholder="使用SARA或PREP框架组织你的回答..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>

                  {currentQuestion.framework && (
                    <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                      <div className="text-xs font-medium mb-2">
                        {currentQuestion.framework.type}框架提示
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {currentQuestion.framework.steps.map((step, index) => (
                          <div key={index}>{step}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowReference(!showReference)}
                    >
                      {showReference ? '隐藏' : '显示'}参考答案
                    </Button>
                  </div>

                  {showReference && currentQuestion.referenceAnswer && (
                    <div className="p-3 rounded-lg bg-muted/50 text-sm">
                      <div className="font-medium mb-2">参考答案：</div>
                      <p className="whitespace-pre-wrap">{currentQuestion.referenceAnswer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
