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

interface OppositeVisualizationProps {
  number: number;
  showOpposite?: boolean;
  highlightedNumbers?: number[];
}

function OppositeVisualization({ number, showOpposite = false, highlightedNumbers = [] }: OppositeVisualizationProps) {
  const width = 600;
  const height = 120;
  const padding = 40;
  const lineY = height / 2;
  
  const min = Math.min(-Math.abs(number) - 2, number - 2);
  const max = Math.max(Math.abs(number) + 2, number + 2);
  const range = max - min;
  
  const getX = (value: number) => padding + ((value - min) / range) * (width - 2 * padding);
  
  const oppositeNumber = -number;
  
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
        
        {/* Symmetry line */}
        {showOpposite && (
          <line
            x1={getX(number)}
            y1={lineY - 25}
            x2={getX(oppositeNumber)}
            y2={lineY - 25}
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        )}
        
        {/* Numbers on axis */}
        {Array.from({ length: range + 1 }, (_, i) => {
          const value = min + i;
          const x = getX(value);
          const isOriginal = value === number;
          const isOpposite = value === oppositeNumber && showOpposite;
          const isHighlighted = highlightedNumbers.includes(value);
          const isZero = value === 0;
          
          // Only show relevant numbers
          if (Math.abs(value) <= Math.max(Math.abs(number), 10) && value % 1 === 0) {
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
                
                {/* Highlighted points */}
                {(isOriginal || isOpposite || isHighlighted) && (
                  <circle
                    cx={x}
                    cy={lineY}
                    r="8"
                    fill={isOriginal ? "hsl(var(--destructive))" : isOpposite ? "hsl(var(--primary))" : "hsl(var(--accent))"}
                  />
                )}
                
                {/* Number label */}
                <text
                  x={x}
                  y={lineY + 35}
                  textAnchor="middle"
                  fontSize="14"
                  fill={
                    isOriginal ? "hsl(var(--destructive))" : 
                    isOpposite ? "hsl(var(--primary))" :
                    isHighlighted ? "hsl(var(--accent-foreground))" :
                    "hsl(var(--foreground))"
                  }
                  fontWeight={isOriginal || isOpposite || isHighlighted ? "bold" : "normal"}
                >
                  {value}
                </text>
              </g>
            );
          }
          return null;
        })}
        
        {/* Labels */}
        {showOpposite && (
          <>
            <text
              x={getX(number)}
              y={lineY - 35}
              textAnchor="middle"
              fontSize="12"
              fill="hsl(var(--destructive))"
              fontWeight="bold"
            >
              {number}
            </text>
            <text
              x={getX(oppositeNumber)}
              y={lineY - 35}
              textAnchor="middle"
              fontSize="12"
              fill="hsl(var(--primary))"
              fontWeight="bold"
            >
              {oppositeNumber}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

const generateExercises = (): Exercise[] => [
  {
    id: '1-3-1',
    question: 'Jaka jest liczba przeciwna do 5?',
    correctAnswer: -5,
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-3-2',
    question: 'Jaka jest liczba przeciwna do -3?',
    correctAnswer: 3,
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-3-3',
    question: 'Jaka jest liczba przeciwna do 0?',
    correctAnswer: 0,
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-3-4',
    question: 'Jaka jest liczba przeciwna do -8?',
    correctAnswer: 8,
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-3-5',
    question: 'Jaka jest liczba odwrotna do 4? (Wpisz jako ułamek, np. 1/4)',
    correctAnswer: '1/4',
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-3-6',
    question: 'Jaka jest liczba odwrotna do -2? (Wpisz jako ułamek, np. -1/2)',
    correctAnswer: '-1/2',
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
];

export function OppositeSection() {
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

  const sectionId = '1-3';
  const exercises = generateExercises();
  const sectionProgress = getSectionProgress(sectionId);
  const currentExercise = exercises[currentExerciseIndex];

  // Parse number from exercise question
  const parseExercise = (question: string) => {
    const match = question.match(/do (-?\d+)/);
    if (match) {
      return parseInt(match[1]);
    }
    return 0;
  };

  const number = parseExercise(currentExercise.question);
  const isReciprocalExercise = currentExercise.question.includes('odwrotna');

  useEffect(() => {
    initializeSection(sectionId, exercises);
  }, [initializeSection]);

  useEffect(() => {
    setStartTime(Date.now());
    setUserAnswer('');
    setFeedback('');
    setShowAnswer(false);
  }, [currentExerciseIndex]);

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      setFeedback('Wpisz odpowiedź!');
      return;
    }

    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    updateTimeSpent(currentExercise.id, timeSpent);
    
    let isCorrect = false;
    const answer = userAnswer.trim();
    const correctAnswer = currentExercise.correctAnswer;
    
    if (typeof correctAnswer === 'number') {
      isCorrect = parseInt(answer) === correctAnswer;
    } else {
      isCorrect = answer === correctAnswer;
    }
    
    submitAnswer(currentExercise.id, answer);
    
    if (isCorrect) {
      setFeedback('Świetnie! Prawidłowa odpowiedź!');
      completeExercise(currentExercise.id);
      setShowAnswer(true);
    } else {
      if (isReciprocalExercise) {
        setFeedback(`Nieprawidłowo. Liczba odwrotna do ${number} to ${correctAnswer}. Liczba odwrotna to 1 podzielone przez daną liczbę.`);
      } else {
        setFeedback(`Nieprawidłowo. Liczba przeciwna do ${number} to ${correctAnswer}. Liczba przeciwna ma przeciwny znak.`);
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
        <h1 className="text-3xl font-bold mb-2">1.3 Liczby przeciwne i odwrotne</h1>
        <p className="text-muted-foreground">
          Naucz się znajduć liczby przeciwne (zmiana znaku) i odwrotne (1/x).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {!isReciprocalExercise && (
            <Card>
              <CardHeader>
                <CardTitle>Wizualizacja liczb przeciwnych</CardTitle>
                <CardDescription>
                  Liczby przeciwne są symetryczne względem zera
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OppositeVisualization
                  number={number}
                  showOpposite={showAnswer}
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
                  placeholder="Wpisz odpowiedź..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="text-lg"
                />
                
                {isReciprocalExercise && (
                  <p className="text-sm text-muted-foreground">
                    Podpowiedź: Liczba odwrotna do x to 1/x
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
              <CardTitle>Definicje</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div>
                <p className="font-medium">Liczba przeciwna:</p>
                <p>• Zmiana znaku liczby</p>
                <p>• Przeciwna do a to -a</p>
                <p>• Przykład: przeciwna do 5 to -5</p>
              </div>
              <div>
                <p className="font-medium">Liczba odwrotna:</p>
                <p>• Liczba, której iloczyn z daną liczbą równa 1</p>
                <p>• Odwrotna do a to 1/a</p>
                <p>• Przykład: odwrotna do 3 to 1/3</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}