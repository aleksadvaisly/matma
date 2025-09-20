'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { ProgressDisplay } from '@/components/ui/progress-display';
import { InfoBox } from '@/components/ui/info-box';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useExerciseStore } from '@/lib/store';
import { ArrowRight, RefreshCw, Lightbulb } from 'lucide-react';

interface OppositeVisualizationProps {
  number: number;
  showOpposite: boolean;
  highlightAnswer?: boolean;
}

function OppositeVisualization({ number, showOpposite, highlightAnswer = false }: OppositeVisualizationProps) {
  const width = 600;
  const height = 120;
  const padding = 40;
  const lineY = height / 2;
  
  const absValue = Math.abs(number);
  const min = -Math.max(absValue + 2, 5);
  const max = Math.max(absValue + 2, 5);
  const range = max - min;
  
  const getX = (value: number) => padding + ((value - min) / range) * (width - 2 * padding);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <svg width={width} height={height} className="border rounded-lg bg-background">
          <line
            x1={padding}
            y1={lineY}
            x2={width - padding}
            y2={lineY}
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
          />
          
          <polygon
            points={`${width - padding},${lineY} ${width - padding - 10},${lineY - 5} ${width - padding - 10},${lineY + 5}`}
            fill="hsl(var(--foreground))"
          />
          
          {Array.from({ length: Math.ceil(range) + 1 }, (_, i) => {
            const value = Math.round(min + i);
            if (value < min || value > max) return null;
            
            const x = getX(value);
            const isOriginal = value === number;
            const isOpposite = value === -number;
            const isZero = value === 0;
            
            return (
              <g key={value}>
                <line
                  x1={x}
                  y1={lineY - (isZero ? 15 : 10)}
                  x2={x}
                  y2={lineY + (isZero ? 15 : 10)}
                  stroke="hsl(var(--foreground))"
                  strokeWidth={isZero ? "3" : "1"}
                />
                
                {isOriginal && (
                  <circle
                    cx={x}
                    cy={lineY}
                    r="8"
                    fill="hsl(var(--primary))"
                    className={highlightAnswer && !showOpposite ? "animate-pulse" : ""}
                  />
                )}
                
                {isOpposite && showOpposite && (
                  <circle
                    cx={x}
                    cy={lineY}
                    r="8"
                    fill={highlightAnswer ? "rgb(250 204 21)" : "hsl(var(--destructive))"}
                    className={highlightAnswer ? "animate-pulse" : ""}
                  />
                )}
                
                <text
                  x={x}
                  y={lineY + 35}
                  textAnchor="middle"
                  fontSize="14"
                  fill={(isOriginal || (isOpposite && showOpposite)) ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))"}
                  fontWeight={(isOriginal || (isOpposite && showOpposite)) ? "bold" : "normal"}
                >
                  {value}
                </text>
              </g>
            );
          })}
          
          {showOpposite && number !== 0 && (
            <path
              d={`M ${getX(number)} ${lineY - 20} Q ${getX(0)} ${lineY - 40} ${getX(-number)} ${lineY - 20}`}
              stroke="hsl(var(--destructive))"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              markerEnd="url(#arrowhead)"
            />
          )}
          
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="hsl(var(--destructive))"
              />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
}

const exercises = [
  { id: '1-3-1', question: 'Znajdź liczbę przeciwną do 5', answer: '-5', number: 5 },
  { id: '1-3-2', question: 'Znajdź liczbę przeciwną do -3', answer: '3', number: -3 },
  { id: '1-3-3', question: 'Znajdź liczbę przeciwną do -8', answer: '8', number: -8 },
  { id: '1-3-4', question: 'Znajdź liczbę przeciwną do 12', answer: '-12', number: 12 },
  { id: '1-3-5', question: 'Znajdź liczbę przeciwną do 0', answer: '0', number: 0 },
  { id: '1-3-6', question: 'Znajdź liczbę odwrotną do 2', answer: '1/2', number: 2, isReciprocal: true },
  { id: '1-3-7', question: 'Znajdź liczbę odwrotną do 1/3', answer: '3', number: 1/3, isReciprocal: true },
];

export function OppositeSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHints, setShowHints] = useState(false);
  
  const { 
    sectionProgress, 
    updateSectionProgress,
    completeExercise 
  } = useExerciseStore();

  const currentExercise = exercises[currentIndex];
  const completedCount = exercises.filter((_, idx) => idx < currentIndex).length;

  useEffect(() => {
    updateSectionProgress('1-3', { 
      completed: completedCount,
      total: exercises.length 
    });
  }, [completedCount, updateSectionProgress]);

  const checkAnswer = () => {
    if (!userAnswer.trim()) return;
    
    const normalizedAnswer = userAnswer.replace(/\s/g, '').toLowerCase();
    const normalizedCorrect = currentExercise.answer.replace(/\s/g, '').toLowerCase();
    
    const correct = normalizedAnswer === normalizedCorrect || 
                   (normalizedAnswer === '0.5' && normalizedCorrect === '1/2') ||
                   (normalizedAnswer === '0,5' && normalizedCorrect === '1/2');
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      completeExercise(currentExercise.id);
      updateSectionProgress('1-3', { 
        completed: completedCount + 1,
        total: exercises.length 
      });
    }
  };

  const nextExercise = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setShowFeedback(false);
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    setUserAnswer('');
    setShowFeedback(false);
    updateSectionProgress('1-3', { completed: 0, total: exercises.length });
  };

  const definitions = [
    'Liczby przeciwne to liczby równo oddalone od zera, ale po przeciwnych stronach',
    'Liczba przeciwna do a to -a (zmiana znaku)',
    'Suma liczby i liczby do niej przeciwnej wynosi 0: a + (-a) = 0',
    'Liczby odwrotne to liczby, których iloczyn wynosi 1',
    'Liczba odwrotna do a to 1/a (dla a ≠ 0)',
    'Zero nie ma liczby odwrotnej'
  ];

  const isReciprocal = currentExercise.isReciprocal || false;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>1.3 Liczby przeciwne i odwrotne</CardTitle>
            <CardDescription>
              Naucz się znajdować liczby przeciwne i odwrotne
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <ProgressDisplay current={completedCount} total={exercises.length} />
            <div className="flex items-center gap-2">
              <Label htmlFor="show-hints" className="text-sm">
                <Lightbulb className="h-4 w-4" />
              </Label>
              <Switch
                id="show-hints"
                checked={showHints}
                onCheckedChange={setShowHints}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-medium text-center">
          {currentExercise.question}
        </div>

        {!isReciprocal && (
          <OppositeVisualization
            number={currentExercise.number}
            showOpposite={showFeedback && isCorrect}
            highlightAnswer={showHints}
          />
        )}

        {isReciprocal && (
          <div className="text-center p-8 bg-muted/30 rounded-lg">
            <div className="text-3xl font-bold mb-4">
              {currentExercise.number === 1/3 ? '1/3' : currentExercise.number}
            </div>
            <div className="text-lg text-muted-foreground">
              {currentExercise.number} × ? = 1
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder={isReciprocal ? "Wpisz odpowiedź (np. 1/2 lub 0.5)" : "Wpisz liczbę przeciwną"}
            className={`flex-1 text-center text-lg ${
              showHints && !showFeedback ? "bg-yellow-50 border-yellow-300" : ""
            }`}
            onKeyPress={(e) => e.key === 'Enter' && !showFeedback && checkAnswer()}
          />
        </div>

        {showFeedback && (
          <Alert className={isCorrect ? "border-green-500" : "border-red-500"}>
            <AlertDescription>
              {isCorrect 
                ? "Świetnie! Prawidłowa odpowiedź!" 
                : `Nieprawidłowo. Prawidłowa odpowiedź to ${currentExercise.answer}.`}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          {!showFeedback ? (
            <Button 
              onClick={checkAnswer}
              disabled={!userAnswer.trim()}
              className="flex-1"
            >
              Sprawdź odpowiedź
            </Button>
          ) : (
            <>
              {currentIndex < exercises.length - 1 ? (
                <Button onClick={nextExercise} className="flex-1 gap-2">
                  Następne zadanie
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={reset} className="flex-1 gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Rozpocznij od nowa
                </Button>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {exercises.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full ${
                index < completedCount
                  ? 'bg-green-500'
                  : index === currentIndex
                  ? 'bg-blue-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <InfoBox title="Definicje" items={definitions} />
      </CardContent>
    </Card>
  );
}