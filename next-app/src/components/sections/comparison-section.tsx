'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useExerciseStore, Exercise } from '@/lib/store';
import { CheckCircle, Circle, ArrowRight, RefreshCw } from 'lucide-react';

interface ComparisonVisualizationProps {
  leftNumber: number;
  rightNumber: number;
  selectedAnswer?: string;
  onAnswerClick?: (answer: string) => void;
  showCorrectAnswer?: boolean;
  correctAnswer?: string;
}

function ComparisonVisualization({
  leftNumber,
  rightNumber,
  selectedAnswer,
  onAnswerClick,
  showCorrectAnswer,
  correctAnswer
}: ComparisonVisualizationProps) {
  const width = 600;
  const height = 120;
  const padding = 40;
  const lineY = height / 2;
  
  const min = Math.min(leftNumber, rightNumber) - 2;
  const max = Math.max(leftNumber, rightNumber) + 2;
  const range = max - min;
  
  const getX = (value: number) => padding + ((value - min) / range) * (width - 2 * padding);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
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
          
          {/* Tick marks and numbers */}
          {Array.from({ length: range + 1 }, (_, i) => {
            const value = min + i;
            const x = getX(value);
            const isHighlighted = value === leftNumber || value === rightNumber;
            const isZero = value === 0;
            
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
                {isHighlighted && (
                  <circle
                    cx={x}
                    cy={lineY}
                    r="8"
                    fill={value === leftNumber ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                  />
                )}
                
                {/* Number label */}
                <text
                  x={x}
                  y={lineY + 35}
                  textAnchor="middle"
                  fontSize="14"
                  fill={isHighlighted ? (value === leftNumber ? "hsl(var(--destructive))" : "hsl(var(--primary))") : "hsl(var(--foreground))"}
                  fontWeight={isHighlighted ? "bold" : "normal"}
                >
                  {value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className="text-center space-y-4">
        <div className="text-2xl font-bold">
          <span className="text-destructive">{leftNumber}</span>
          <span className="mx-4">?</span>
          <span className="text-primary">{rightNumber}</span>
        </div>
        
        <div className="flex justify-center gap-4">
          {['<', '=', '>'].map((symbol) => (
            <Button
              key={symbol}
              variant={selectedAnswer === symbol ? "default" : "outline"}
              size="lg"
              onClick={() => onAnswerClick?.(symbol)}
              className={`text-xl w-16 h-16 ${
                showCorrectAnswer && correctAnswer === symbol 
                  ? "border-green-500 bg-green-50 dark:bg-green-950" 
                  : ""
              }`}
            >
              {symbol}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

const generateExercises = (): Exercise[] => [
  {
    id: '1-2-1',
    question: 'Porównaj liczby: -3 ? 2',
    correctAnswer: '<',
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-2-2',
    question: 'Porównaj liczby: 5 ? -1',
    correctAnswer: '>',
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-2-3',
    question: 'Porównaj liczby: -7 ? -4',
    correctAnswer: '<',
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-2-4',
    question: 'Porównaj liczby: -2 ? -8',
    correctAnswer: '>',
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-2-5',
    question: 'Porównaj liczby: 0 ? -5',
    correctAnswer: '>',
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-2-6',
    question: 'Porównaj liczby: -3 ? -3',
    correctAnswer: '=',
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
];

export function ComparisonSection() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>();
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

  const sectionId = '1-2';
  const exercises = generateExercises();
  const sectionProgress = getSectionProgress(sectionId);
  const currentExercise = exercises[currentExerciseIndex];

  // Parse numbers from exercise question
  const parseExercise = (question: string) => {
    const match = question.match(/(-?\d+)\s*\?\s*(-?\d+)/);
    if (match) {
      return {
        leftNumber: parseInt(match[1]),
        rightNumber: parseInt(match[2])
      };
    }
    return { leftNumber: 0, rightNumber: 0 };
  };

  const { leftNumber, rightNumber } = parseExercise(currentExercise.question);

  useEffect(() => {
    initializeSection(sectionId, exercises);
  }, [initializeSection]);

  useEffect(() => {
    setStartTime(Date.now());
    setSelectedAnswer(undefined);
    setFeedback('');
    setShowAnswer(false);
  }, [currentExerciseIndex]);

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) {
      setFeedback('Wybierz znak porównania!');
      return;
    }

    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    updateTimeSpent(currentExercise.id, timeSpent);
    submitAnswer(currentExercise.id, selectedAnswer);

    const isCorrect = selectedAnswer === currentExercise.correctAnswer;
    
    if (isCorrect) {
      setFeedback('Świetnie! Prawidłowa odpowiedź!');
      completeExercise(currentExercise.id);
      setShowAnswer(true);
    } else {
      let explanation = '';
      if (leftNumber > rightNumber) {
        explanation = `${leftNumber} > ${rightNumber} bo ${leftNumber} znajduje się po prawej stronie ${rightNumber} na osi liczbowej.`;
      } else if (leftNumber < rightNumber) {
        explanation = `${leftNumber} < ${rightNumber} bo ${leftNumber} znajduje się po lewej stronie ${rightNumber} na osi liczbowej.`;
      } else {
        explanation = `${leftNumber} = ${rightNumber} bo to są te same liczby.`;
      }
      setFeedback(`Nieprawidłowo. ${explanation}`);
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
    setSelectedAnswer(undefined);
    setFeedback('');
    setShowAnswer(false);
  };

  const progress = sectionProgress ? (sectionProgress.completedExercises / sectionProgress.totalExercises) * 100 : 0;
  const isCompleted = sectionProgress?.completed || false;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">1.2 Porównywanie liczb</h1>
        <p className="text-muted-foreground">
          Naucz się porównywać liczby całkowite używając znaków &lt;, = i &gt;.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Zadanie {currentExerciseIndex + 1}</CardTitle>
                <Badge variant="outline">
                  {currentExerciseIndex + 1} / {exercises.length}
                </Badge>
              </div>
              <CardDescription>
                Wybierz odpowiedni znak porównania
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ComparisonVisualization
                leftNumber={leftNumber}
                rightNumber={rightNumber}
                selectedAnswer={selectedAnswer}
                onAnswerClick={handleAnswerClick}
                showCorrectAnswer={showAnswer}
                correctAnswer={currentExercise.correctAnswer as string}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 pt-6">
              <p className="text-lg">{currentExercise.question}</p>
              
              {selectedAnswer && (
                <div className="p-3 bg-muted rounded-lg">
                  <p>Wybrana odpowiedź: <strong>{leftNumber} {selectedAnswer} {rightNumber}</strong></p>
                </div>
              )}

              {feedback && (
                <Alert className={showAnswer ? "border-green-500" : "border-orange-500"}>
                  <AlertDescription>{feedback}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                {!showAnswer ? (
                  <Button onClick={handleSubmit} disabled={!selectedAnswer}>
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
              <CardTitle>Zasady porównywania</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Im bardziej na prawo na osi, tym liczba większa</p>
              <p>• Liczby dodatnie są większe od ujemnych</p>
              <p>• Zero jest większe od liczb ujemnych</p>
              <p>• Z liczb ujemnych większa jest ta bliższa zeru</p>
              <p>• Przykład: -2 &gt; -5 bo -2 jest bliżej zera</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}