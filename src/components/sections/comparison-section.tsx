'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProgressDisplay } from '@/components/ui/progress-display';
import { InfoBox } from '@/components/ui/info-box';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { NumberLine } from '@/components/ui/number-line';
import { useExerciseStore, Exercise } from '@/lib/store';
import { CheckCircle, Circle, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';


const exercises: Array<{ 
  id: string; 
  question: string; 
  answer: string;
  leftNumber: number;
  rightNumber: number;
  hint: string;
}> = [
  {
    id: '1-2-1',
    question: 'Porównaj liczby: -3 ? 2',
    answer: '<',
    leftNumber: -3,
    rightNumber: 2,
    hint: 'Każda liczba ujemna jest mniejsza od każdej liczby dodatniej.'
  },
  {
    id: '1-2-2',
    question: 'Porównaj liczby: 5 ? -1',
    answer: '>',
    leftNumber: 5,
    rightNumber: -1,
    hint: 'Liczby dodatnie są zawsze większe od ujemnych.'
  },
  {
    id: '1-2-3',
    question: 'Porównaj liczby: -7 ? -4',
    answer: '<',
    leftNumber: -7,
    rightNumber: -4,
    hint: 'Z dwóch liczb ujemnych większa jest ta, która jest bliżej zera.'
  },
  {
    id: '1-2-4',
    question: 'Porównaj liczby: -2 ? -8',
    answer: '>',
    leftNumber: -2,
    rightNumber: -8,
    hint: '-2 jest bliżej zera niż -8, więc jest większe.'
  },
  {
    id: '1-2-5',
    question: 'Porównaj liczby: 0 ? -5',
    answer: '>',
    leftNumber: 0,
    rightNumber: -5,
    hint: 'Zero jest większe od każdej liczby ujemnej.'
  },
  {
    id: '1-2-6',
    question: 'Porównaj liczby: -3 ? -3',
    answer: '=',
    leftNumber: -3,
    rightNumber: -3,
    hint: 'To ta sama liczba, więc są sobie równe.'
  },
  {
    id: '1-2-7',
    question: 'Porównaj liczby: 4 ? 7',
    answer: '<',
    leftNumber: 4,
    rightNumber: 7,
    hint: 'Na osi liczbowej 4 znajduje się po lewej stronie od 7.'
  }
];

export function ComparisonSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHints, setShowHints] = useState(false);
  
  const { 
    sectionProgress, 
    updateSectionProgress,
    completeExercise 
  } = useExerciseStore();

  const currentExercise = exercises[currentIndex];
  const completedCount = exercises.filter((_, idx) => idx < currentIndex && showFeedback).length;

  useEffect(() => {
    updateSectionProgress('1-2', { 
      completed: completedCount,
      total: exercises.length 
    });
  }, [completedCount, updateSectionProgress]);

  const checkAnswer = () => {
    if (!selectedAnswer) return;
    
    const correct = selectedAnswer === currentExercise.answer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      completeExercise(currentExercise.id);
      updateSectionProgress('1-2', { 
        completed: completedCount + 1,
        total: exercises.length 
      });
    }
  };

  const nextExercise = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    updateSectionProgress('1-2', { completed: 0, total: exercises.length });
  };

  const rules = [
    'Im bardziej na prawo na osi, tym liczba większa',
    'Liczby dodatnie są zawsze większe od liczb ujemnych',
    'Zero jest większe od wszystkich liczb ujemnych',
    'Z dwóch liczb ujemnych większa jest ta bliższa zeru',
    'Przykład: -2 > -5 bo -2 jest bliżej zera'
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>1.2 Porównywanie liczb</CardTitle>
            <CardDescription>
              Naucz się porównywać liczby całkowite używając znaków &lt;, = i &gt;
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <ProgressDisplay current={completedCount} total={exercises.length} />
            <div className="flex items-center gap-2">
              <Label htmlFor="show-hints" className="text-sm">
                <Sparkles className="h-4 w-4" />
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

        <div className="space-y-4">
          <NumberLine
            min={Math.min(currentExercise.leftNumber, currentExercise.rightNumber, -5) - 2}
            max={Math.max(currentExercise.leftNumber, currentExercise.rightNumber, 5) + 2}
            markedNumbers={[
              { value: currentExercise.leftNumber, color: 'hsl(var(--primary))' },
              { value: currentExercise.rightNumber, color: 'hsl(var(--primary))' }
            ]}
          />
          
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold">
              <span className="text-primary">{currentExercise.leftNumber}</span>
              <span className="mx-4">?</span>
              <span className="text-primary">{currentExercise.rightNumber}</span>
            </div>
            
            <div className="flex justify-center gap-4">
              {['<', '=', '>'].map((symbol) => {
                const isCorrect = showFeedback && currentExercise.answer === symbol;
                const shouldHighlight = showHints && currentExercise.answer === symbol;
                
                return (
                  <Button
                    key={symbol}
                    variant={selectedAnswer === symbol ? "default" : "outline"}
                    size="lg"
                    onClick={() => setSelectedAnswer(symbol)}
                    className={`text-xl w-16 h-16 ${
                      shouldHighlight
                        ? "bg-yellow-200 border-yellow-400 hover:bg-yellow-300" 
                        : isCorrect
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : ""
                    }`}
                  >
                    {symbol}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {showFeedback && (
          <Alert className={isCorrect ? "border-green-500" : "border-red-500"}>
            <AlertDescription>
              {isCorrect 
                ? "Świetnie! Prawidłowa odpowiedź!" 
                : `Nieprawidłowo. Prawidłowa odpowiedź to ${currentExercise.leftNumber} ${currentExercise.answer} ${currentExercise.rightNumber}.`}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          {!showFeedback ? (
            <Button 
              onClick={checkAnswer}
              disabled={!selectedAnswer}
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


        <InfoBox title="Zasady porównywania" items={rules} />
      </CardContent>
    </Card>
  );
}