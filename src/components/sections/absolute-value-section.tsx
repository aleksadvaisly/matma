'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useExerciseStore, Exercise } from '@/lib/store';
import { CheckCircle, Circle, ArrowRight, RefreshCw } from 'lucide-react';

interface AbsoluteValueVisualizationProps {
  number: number;
  showDistance?: boolean;
}

function AbsoluteValueVisualization({ number, showDistance = false }: AbsoluteValueVisualizationProps) {
  const width = 600;
  const height = 150;
  const padding = 40;
  const lineY = height / 2 + 10;
  
  const min = Math.min(-Math.abs(number) - 2, number - 2, -10);
  const max = Math.max(Math.abs(number) + 2, number + 2, 10);
  const range = max - min;
  
  const getX = (value: number) => padding + ((value - min) / range) * (width - 2 * padding);
  
  const absoluteValue = Math.abs(number);
  
  return (
    <div className="flex justify-center my-6">
      <svg width={width} height={height} className="border rounded-lg bg-background">
        {/* Main line */}
        <line
          x1={padding}
          y1={lineY}
          x2={width - padding}
          y2={lineY}
          stroke="hsl(var(--foreground))"
          strokeWidth="2"
        />
        
        {/* Arrow */}
        <polygon
          points={`${width - padding},${lineY} ${width - padding - 10},${lineY - 5} ${width - padding - 10},${lineY + 5}`}
          fill="hsl(var(--foreground))"
        />
        
        {/* Zero line */}
        <line
          x1={getX(0)}
          y1={lineY - 15}
          x2={getX(0)}
          y2={lineY + 15}
          stroke="hsl(var(--foreground))"
          strokeWidth="3"
        />
        
        {/* Distance lines (if showing) */}
        {showDistance && (
          <>
            {/* Distance line from 0 to number */}
            <line
              x1={getX(0)}
              y1={lineY - 30}
              x2={getX(number)}
              y2={lineY - 30}
              stroke="hsl(var(--primary))"
              strokeWidth="3"
            />
            
            {/* Distance markers */}
            <line
              x1={getX(0)}
              y1={lineY - 35}
              x2={getX(0)}
              y2={lineY - 25}
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
            <line
              x1={getX(number)}
              y1={lineY - 35}
              x2={getX(number)}
              y2={lineY - 25}
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
            
            {/* Distance label */}
            <text
              x={(getX(0) + getX(number)) / 2}
              y={lineY - 40}
              textAnchor="middle"
              fontSize="14"
              fill="hsl(var(--primary))"
              fontWeight="bold"
            >
              |{number}| = {absoluteValue}
            </text>
          </>
        )}
        
        {/* Numbers on axis */}
        {Array.from({ length: range + 1 }, (_, i) => {
          const value = min + i;
          const x = getX(value);
          const isTargetNumber = value === number;
          const isZero = value === 0;
          
          // Only show relevant numbers
          if (Math.abs(value) <= Math.max(Math.abs(number) + 2, 10) && value % 1 === 0) {
            return (
              <g key={value}>
                {/* Tick mark */}
                <line
                  x1={x}
                  y1={lineY - (isZero ? 15 : 10)}
                  x2={x}
                  y2={lineY + (isZero ? 15 : 10)}
                  stroke="hsl(var(--foreground))"
                  strokeWidth={isZero ? "3" : "1"}
                />
                
                {/* Highlighted point */}
                {isTargetNumber && (
                  <circle
                    cx={x}
                    cy={lineY}
                    r="8"
                    fill="hsl(var(--destructive))"
                  />
                )}
                
                {/* Number label */}
                <text
                  x={x}
                  y={lineY + 35}
                  textAnchor="middle"
                  fontSize="14"
                  fill={isTargetNumber ? "hsl(var(--destructive))" : "hsl(var(--foreground))"}
                  fontWeight={isTargetNumber || isZero ? "bold" : "normal"}
                >
                  {value}
                </text>
              </g>
            );
          }
          return null;
        })}
        
        {/* Zero label */}
        <text
          x={getX(0)}
          y={lineY - 50}
          textAnchor="middle"
          fontSize="12"
          fill="hsl(var(--muted-foreground))"
          fontWeight="bold"
        >
          0
        </text>
      </svg>
    </div>
  );
}

const generateExercises = (): Exercise[] => [
  {
    id: '1-4-1',
    question: 'Oblicz |5|',
    correctAnswer: 5,
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-4-2',
    question: 'Oblicz |-7|',
    correctAnswer: 7,
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-4-3',
    question: 'Oblicz |0|',
    correctAnswer: 0,
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-4-4',
    question: 'Oblicz |-12|',
    correctAnswer: 12,
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-4-5',
    question: 'Jaką odległość od zera ma liczba -8?',
    correctAnswer: 8,
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-4-6',
    question: 'Które liczby mają wartość bezwzględną równą 6? (Wpisz dwie liczby oddzielone przecinkiem)',
    correctAnswer: '6,-6',
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
];

export function AbsoluteValueSection() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const {
    initializeSection,
    getSectionProgress,
    submitAnswer,
    completeExercise,
    completeSection,
    updateTimeSpent,
    resetSection,
  } = useExerciseStore();

  const sectionId = '1-4';
  const exercises = generateExercises();
  const sectionProgress = getSectionProgress(sectionId);
  const currentExercise = exercises[currentExerciseIndex];

  // Parse number from exercise question
  const parseExercise = (question: string) => {
    const match = question.match(/\|(-?\d+)\|/) || question.match(/liczba (-?\d+)/);
    if (match) {
      return parseInt(match[1]);
    }
    return 0;
  };

  const number = parseExercise(currentExercise.question);
  const isMultipleAnswerExercise = currentExercise.question.includes('Które liczby');

  useEffect(() => {
    initializeSection(sectionId, exercises);
  }, [initializeSection]);

  useEffect(() => {
    setStartTime(Date.now());
    setUserAnswer('');
    setFeedback('');
    setShowAnswer(false);
  }, [currentExerciseIndex]);

  const checkAnswer = (answer: string, correctAnswer: string | number) => {
    if (typeof correctAnswer === 'number') {
      return parseInt(answer) === correctAnswer;
    } else {
      // For multiple answers, check if they match (order doesn't matter)
      const userAnswers = answer.split(',').map(a => a.trim()).sort();
      const correctAnswers = correctAnswer.split(',').map(a => a.trim()).sort();
      return userAnswers.length === correctAnswers.length && 
             userAnswers.every((val, index) => val === correctAnswers[index]);
    }
  };

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      setFeedback('Wpisz odpowiedź!');
      return;
    }

    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    updateTimeSpent(currentExercise.id, timeSpent);
    
    const answer = userAnswer.trim();
    const correctAnswer = currentExercise.correctAnswer;
    const isCorrect = checkAnswer(answer, correctAnswer);
    
    submitAnswer(currentExercise.id, answer);
    
    if (isCorrect) {
      setFeedback('Świetnie! Prawidłowa odpowiedź!');
      completeExercise(currentExercise.id);
      setShowAnswer(true);
    } else {
      if (isMultipleAnswerExercise) {
        setFeedback(`Nieprawidłowo. Liczby o wartości bezwzględnej 6 to: 6 i -6. Obie są w odległości 6 od zera.`);
      } else {
        const abs = Math.abs(number);
        setFeedback(`Nieprawidłowo. |${number}| = ${abs}. Wartość bezwzględna to odległość od zera, zawsze dodatnia.`);
      }
    }
  };

  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      completeSection(sectionId);
    }
  };

  const handleReset = () => {
    resetSection(sectionId);
    setCurrentExerciseIndex(0);
    setUserAnswer('');
    setFeedback('');
    setShowAnswer(false);
  };

  const progress = sectionProgress ? (sectionProgress.completedExercises / sectionProgress.totalExercises) * 100 : 0;
  const isCompleted = sectionProgress?.completed || false;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">1.4 Wartość bezwzględna</h1>
        <p className="text-muted-foreground">
          Naucz się obliczać wartość bezwzględną jako odległość od zera na osi liczbowej.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {!isMultipleAnswerExercise && (
            <Card>
              <CardHeader>
                <CardTitle>Wizualizacja wartości bezwzględnej</CardTitle>
                <CardDescription>
                  Wartość bezwzględna to odległość od zera
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AbsoluteValueVisualization
                  number={number}
                  showDistance={showAnswer}
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Zadanie {currentExerciseIndex + 1}</CardTitle>
                <Badge variant="outline">
                  {currentExerciseIndex + 1} / {exercises.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">{currentExercise.question}</p>
              
              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder={isMultipleAnswerExercise ? "np. 6,-6" : "Wpisz liczbę..."}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="text-lg"
                />
                
                {isMultipleAnswerExercise && (
                  <p className="text-sm text-muted-foreground">
                    Podpowiedź: Wpisz dwie liczby oddzielone przecinkiem
                  </p>
                )}
              </div>

              {feedback && (
                <Alert className={showAnswer ? "border-green-500" : "border-orange-500"}>
                  <AlertDescription>{feedback}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                {!showAnswer ? (
                  <Button onClick={handleSubmit} disabled={!userAnswer.trim()}>
                    Sprawdź odpowiedź
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="flex items-center gap-2">
                    {currentExerciseIndex < exercises.length - 1 ? (
                      <>
                        Następne zadanie
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      'Zakończ sekcję'
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Postęp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Ukończone zadania</span>
                  <span>{sectionProgress?.completedExercises || 0}/{exercises.length}</span>
                </div>
                <Progress value={progress} />
              </div>
              
              {sectionProgress && (
                <div className="text-sm text-muted-foreground">
                  <p>Wynik: {sectionProgress.score}%</p>
                  <p>Czas: {Math.round(sectionProgress.timeSpent / 60)} min</p>
                </div>
              )}

              {isCompleted && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Zacznij od nowa
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lista zadań</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {exercises.map((exercise, index) => {
                  const isCurrentExercise = index === currentExerciseIndex;
                  const exerciseProgress = sectionProgress?.exercises.find(ex => ex.id === exercise.id);
                  const isCompleted = exerciseProgress?.completed || false;
                  
                  return (
                    <div
                      key={exercise.id}
                      className={`flex items-center gap-3 p-2 rounded-lg ${
                        isCurrentExercise ? 'bg-accent' : ''
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={`text-sm ${isCurrentExercise ? 'font-medium' : ''}`}>
                        Zadanie {index + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Własności wartości bezwzględnej</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• |a| = odległość od zera</p>
              <p>• |a| ≥ 0 (zawsze nieujemna)</p>
              <p>• |a| = |-a| (symetria)</p>
              <p>• |a| = a gdy a ≥ 0</p>
              <p>• |a| = -a gdy a &lt; 0</p>
              <p>• Przykład: |-5| = 5, |3| = 3</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}