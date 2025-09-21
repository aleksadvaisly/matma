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
import { ArrowRight, RefreshCw, Sparkles } from 'lucide-react';


export function NumberLineSection() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHints, setShowHints] = useState(false);
  
  const {
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

  const TOTAL_EXERCISES = exercises.length;

  const currentExercise = exercises[currentExerciseIndex];
  const completedCount = currentExerciseIndex;
  const displayedProgress = Math.min(
    TOTAL_EXERCISES,
    completedCount + (showFeedback && isCorrect ? 1 : 0)
  );

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
    }
  };

  const nextExercise = () => {
    if (currentExerciseIndex < TOTAL_EXERCISES - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const resetExercises = () => {
    setCurrentExerciseIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  useEffect(() => {
    updateSectionProgress('1-1', {
      completed: displayedProgress,
      total: TOTAL_EXERCISES
    });
  }, [displayedProgress, TOTAL_EXERCISES, updateSectionProgress]);

  const hints = [
    'Oś liczbowa to linia, na której liczby są uporządkowane od najmniejszej do największej',
    'Liczby ujemne znajdują się po lewej stronie zera',
    'Liczby dodatnie znajdują się po prawej stronie zera',
    'Im dalej na prawo, tym liczba jest większa',
    'Zero jest większe od wszystkich liczb ujemnych i mniejsze od wszystkich dodatnich'
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>1.1 Liczby na osi liczbowej</CardTitle>
            <CardDescription>
              Naucz się umieszczać liczby całkowite na osi liczbowej
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <ProgressDisplay current={displayedProgress} total={TOTAL_EXERCISES} />
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

        <NumberLine
          min={minNum - padding}
          max={maxNum + padding}
          selectedNumber={selectedAnswer}
          onNumberClick={handleNumberClick}
          showHints={showHints}
          correctAnswer={parseInt(currentExercise.answer)}
          feedbackState={showFeedback ? (isCorrect ? 'correct' : 'incorrect') : 'idle'}
        />

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
              disabled={!selectedAnswer}
              className="flex-1"
            >
              Sprawdź odpowiedź
            </Button>
          ) : (
            <>
                  {currentExerciseIndex < TOTAL_EXERCISES - 1 ? (
                    <Button onClick={nextExercise} className="flex-1 gap-2">
                  Następne zadanie
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={resetExercises} className="flex-1 gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Rozpocznij od nowa
                </Button>
              )}
            </>
          )}
        </div>

        <InfoBox title="Wskazówki" items={hints} />
      </CardContent>
    </Card>
  );
}
