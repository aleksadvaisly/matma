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

interface AbsoluteValueVisualizationProps {
  number: number;
  showAnswer: boolean;
  highlightAnswer?: boolean;
}

function AbsoluteValueVisualization({ number, showAnswer, highlightAnswer = false }: AbsoluteValueVisualizationProps) {
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
            const isNumber = value === number;
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
                
                {isNumber && (
                  <circle
                    cx={x}
                    cy={lineY}
                    r="8"
                    fill="hsl(var(--primary))"
                    className={highlightAnswer && !showAnswer ? "animate-pulse" : ""}
                  />
                )}
                
                <text
                  x={x}
                  y={lineY + 35}
                  textAnchor="middle"
                  fontSize="14"
                  fill={isNumber ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                  fontWeight={isNumber ? "bold" : "normal"}
                >
                  {value}
                </text>
              </g>
            );
          })}
          
          {showAnswer && number !== 0 && (
            <>
              <line
                x1={getX(number)}
                y1={lineY - 20}
                x2={getX(number)}
                y2={lineY - 35}
                stroke="hsl(var(--destructive))"
                strokeWidth="2"
              />
              <line
                x1={getX(0)}
                y1={lineY - 35}
                x2={getX(number)}
                y2={lineY - 35}
                stroke="hsl(var(--destructive))"
                strokeWidth="2"
                strokeDasharray="none"
                markerEnd="url(#distance-arrow)"
                markerStart="url(#distance-arrow-start)"
              />
              <text
                x={(getX(0) + getX(number)) / 2}
                y={lineY - 40}
                textAnchor="middle"
                fontSize="14"
                fill={highlightAnswer ? "rgb(250 204 21)" : "hsl(var(--destructive))"}
                fontWeight="bold"
                className={highlightAnswer ? "animate-pulse" : ""}
              >
                |{number}| = {absValue}
              </text>
            </>
          )}
          
          <defs>
            <marker
              id="distance-arrow"
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
            <marker
              id="distance-arrow-start"
              markerWidth="10"
              markerHeight="7"
              refX="1"
              refY="3.5"
              orient="auto-start-reverse"
            >
              <polygon
                points="10 0, 0 3.5, 10 7"
                fill="hsl(var(--destructive))"
              />
            </marker>
          </defs>
        </svg>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold">
          |{number}| = {showAnswer ? <span className={highlightAnswer ? "text-yellow-500" : "text-destructive"}>{absValue}</span> : '?'}
        </div>
      </div>
    </div>
  );
}

const exercises = [
  { id: '1-4-1', question: 'Oblicz wartość bezwzględną: |7|', answer: '7', number: 7 },
  { id: '1-4-2', question: 'Oblicz wartość bezwzględną: |-5|', answer: '5', number: -5 },
  { id: '1-4-3', question: 'Oblicz wartość bezwzględną: |-12|', answer: '12', number: -12 },
  { id: '1-4-4', question: 'Oblicz wartość bezwzględną: |0|', answer: '0', number: 0 },
  { id: '1-4-5', question: 'Oblicz wartość bezwzględną: |15|', answer: '15', number: 15 },
  { id: '1-4-6', question: 'Oblicz wartość bezwzględną: |-3|', answer: '3', number: -3 },
  { id: '1-4-7', question: 'Oblicz wartość bezwzględną: |-20|', answer: '20', number: -20 },
];

export function AbsoluteValueSection() {
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
    updateSectionProgress('1-4', { 
      completed: completedCount,
      total: exercises.length 
    });
  }, [completedCount, updateSectionProgress]);

  const checkAnswer = () => {
    if (!userAnswer.trim()) return;
    
    const correct = userAnswer.trim() === currentExercise.answer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      completeExercise(currentExercise.id);
      updateSectionProgress('1-4', { 
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
    updateSectionProgress('1-4', { completed: 0, total: exercises.length });
  };

  const properties = [
    'Wartość bezwzględna liczby to jej odległość od zera na osi liczbowej',
    'Wartość bezwzględna jest zawsze nieujemna (≥ 0)',
    'Dla liczb dodatnich: |a| = a',
    'Dla liczb ujemnych: |a| = -a (zmiana znaku)',
    'Dla zera: |0| = 0',
    'Przykład: |-5| = 5, bo odległość -5 od zera wynosi 5'
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>1.4 Wartość bezwzględna</CardTitle>
            <CardDescription>
              Naucz się obliczać wartość bezwzględną liczb całkowitych
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

        <AbsoluteValueVisualization
          number={currentExercise.number}
          showAnswer={showFeedback && isCorrect}
          highlightAnswer={showHints}
        />

        <div className="flex gap-2">
          <Input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Wpisz wartość bezwzględną"
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
                : `Nieprawidłowo. |${currentExercise.number}| = ${currentExercise.answer}`}
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

        <InfoBox title="Własności wartości bezwzględnej" items={properties} />
      </CardContent>
    </Card>
  );
}