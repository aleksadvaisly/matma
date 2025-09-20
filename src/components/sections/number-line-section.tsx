'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useExerciseStore, Exercise } from '@/lib/store';
import { CheckCircle, Circle, ArrowRight, RefreshCw } from 'lucide-react';

// Simple number line component that works
function NumberLine({ 
  min = -10, 
  max = 10, 
  selectedNumber, 
  onNumberClick,
  highlightNumbers = [] 
}: {
  min?: number;
  max?: number;
  selectedNumber?: number;
  onNumberClick?: (number: number) => void;
  highlightNumbers?: number[];
}) {
  const range = max - min;
  const step = range > 30 ? 5 : range > 15 ? 2 : 1;
  
  return (
    <div className="w-full overflow-x-auto pb-4">
      <svg width={Math.max(800, range * 40)} height="120" className="min-w-full">
        {/* Main line */}
        <line 
          x1="40" 
          y1="60" 
          x2={range * 40 + 40} 
          y2="60" 
          stroke="black" 
          strokeWidth="2"
        />
        
        {/* Arrow ends */}
        <polygon points="30,60 40,55 40,65" fill="black" />
        <polygon points={`${range * 40 + 50},60 ${range * 40 + 40},55 ${range * 40 + 40},65`} fill="black" />
        
        {/* Ticks and numbers */}
        {Array.from({ length: Math.floor(range/step) + 1 }, (_, i) => {
          const value = min + i * step;
          const x = 40 + ((value - min) / range) * (range * 40);
          const isHighlighted = highlightNumbers.includes(value);
          const isSelected = selectedNumber === value;
          
          return (
            <g key={value}>
              {/* Tick mark */}
              <line 
                x1={x} 
                y1="55" 
                x2={x} 
                y2="65" 
                stroke="black" 
                strokeWidth="2"
              />
              
              {/* Clickable area and number */}
              {onNumberClick ? (
                <g
                  onClick={() => onNumberClick(value)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={x}
                    cy={60}
                    r="15"
                    fill={isSelected ? 'blue' : isHighlighted ? 'yellow' : 'transparent'}
                    fillOpacity={isSelected ? 0.3 : isHighlighted ? 0.3 : 0}
                  />
                  <text 
                    x={x} 
                    y={90} 
                    textAnchor="middle" 
                    fontSize="14"
                    fontWeight={isSelected || isHighlighted ? 'bold' : 'normal'}
                    fill={isSelected ? 'blue' : isHighlighted ? 'orange' : 'black'}
                  >
                    {value}
                  </text>
                </g>
              ) : (
                <text 
                  x={x} 
                  y={90} 
                  textAnchor="middle" 
                  fontSize="14"
                  fontWeight={isHighlighted ? 'bold' : 'normal'}
                  fill={isHighlighted ? 'orange' : 'black'}
                >
                  {value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function NumberLineSection() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const { 
    sectionProgress, 
    updateSectionProgress,
    completeExercise 
  } = useExerciseStore();

  const exercises: Exercise[] = [
    {
      id: '1-1-1',
      question: 'Która liczba znajduje się 3 jednostki na prawo od zera?',
      answer: '3',
      type: 'number-line'
    },
    {
      id: '1-1-2',
      question: 'Która liczba znajduje się 5 jednostek na lewo od zera?',
      answer: '-5',
      type: 'number-line'
    },
    {
      id: '1-1-3',
      question: 'Wskaż liczbę -3 na osi liczbowej.',
      answer: '-3',
      type: 'number-line'
    },
    {
      id: '1-1-4',
      question: 'Która liczba jest większa: -2 czy -7?',
      answer: '-2',
      type: 'number-line'
    },
    {
      id: '1-1-5',
      question: 'Znajdź liczbę, która znajduje się dokładnie pomiędzy -4 i 2.',
      answer: '-1',
      type: 'number-line'
    },
    {
      id: '1-1-6',
      question: 'Wskaż liczbę 5 na osi liczbowej.',
      answer: '5',
      type: 'number-line'
    },
    {
      id: '1-1-7',
      question: 'Która liczba znajduje się 8 jednostek na prawo od -3?',
      answer: '5',
      type: 'number-line'
    }
  ];

  const currentExercise = exercises[currentExerciseIndex];
  const progress = ((sectionProgress['1-1']?.completed || 0) / exercises.length) * 100;

  // Extract numbers from question to determine range
  const extractNumbers = (text: string): number[] => {
    const numbers: number[] = [];
    const matches = text.match(/-?\d+/g);
    if (matches) {
      matches.forEach(match => {
        const num = parseInt(match);
        if (!isNaN(num)) numbers.push(num);
      });
    }
    // Always include the answer
    const answerNum = parseInt(currentExercise.answer);
    if (!isNaN(answerNum)) numbers.push(answerNum);
    
    return numbers;
  };

  const highlightNumbers = extractNumbers(currentExercise.question + ' ' + currentExercise.answer);
  const minNum = Math.min(...highlightNumbers, -5);
  const maxNum = Math.max(...highlightNumbers, 5);
  const range = maxNum - minNum;
  const padding = Math.max(2, Math.ceil(range * 0.2));

  const handleNumberClick = (number: number) => {
    setSelectedAnswer(number);
  };

  const checkAnswer = () => {
    const correct = selectedAnswer === parseInt(currentExercise.answer);
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      completeExercise(currentExercise.id);
      updateSectionProgress('1-1', { 
        completed: (sectionProgress['1-1']?.completedExercises || 0) + 1,
        total: exercises.length 
      });
    }
  };

  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const resetExercises = () => {
    setCurrentExerciseIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    updateSectionProgress('1-1', { completed: 0, total: exercises.length });
  };

  useEffect(() => {
    updateSectionProgress('1-1', { 
      completed: sectionProgress['1-1']?.completed || 0,
      total: exercises.length 
    });
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>1.1 Liczby na osi liczbowej</span>
          <Badge variant="outline">
            {sectionProgress['1-1']?.completedExercises || 0}/{exercises.length}
          </Badge>
        </CardTitle>
        <CardDescription>
          Naucz się umieszczać liczby całkowite na osi liczbowej
        </CardDescription>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">
            Zadanie {currentExerciseIndex + 1} z {exercises.length}
          </h3>
          <p className="text-gray-700 mb-4">{currentExercise.question}</p>
          
          <NumberLine
            min={minNum - padding}
            max={maxNum + padding}
            selectedNumber={selectedAnswer}
            onNumberClick={handleNumberClick}
            highlightNumbers={highlightNumbers}
          />
          
          {selectedAnswer !== null && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Wybrana liczba: <span className="font-bold">{selectedAnswer}</span>
              </p>
            </div>
          )}
        </div>

        {!showFeedback && (
          <div className="flex gap-4">
            <Button 
              onClick={checkAnswer}
              disabled={selectedAnswer === null}
            >
              Sprawdź odpowiedź
            </Button>
            {currentExerciseIndex > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentExerciseIndex(currentExerciseIndex - 1);
                  setSelectedAnswer(null);
                  setShowFeedback(false);
                }}
              >
                Poprzednie zadanie
              </Button>
            )}
          </div>
        )}

        {showFeedback && (
          <>
            <Alert className={isCorrect ? "border-green-500" : "border-red-500"}>
              <AlertDescription>
                {isCorrect ? (
                  <span className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Brawo! To poprawna odpowiedź.
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-red-700">
                    <Circle className="h-5 w-5" />
                    Spróbuj ponownie. Poprawna odpowiedź to {currentExercise.answer}.
                  </span>
                )}
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              {currentExerciseIndex < exercises.length - 1 ? (
                <Button onClick={nextExercise}>
                  Następne zadanie <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={resetExercises} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Zacznij od nowa
                </Button>
              )}
            </div>
          </>
        )}

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">💡 Wskazówka</h4>
          <p className="text-sm text-gray-600">
            Oś liczbowa to linia, na której liczby są uporządkowane od najmniejszej do największej.
            Liczby ujemne znajdują się po lewej stronie zera, a dodatnie po prawej.
            Im dalej na prawo, tym liczba jest większa.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
