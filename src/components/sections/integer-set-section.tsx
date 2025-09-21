'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProgressDisplay } from '@/components/ui/progress-display';
import { InfoBox } from '@/components/ui/info-box';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChoiceButton, type ChoiceFeedbackState } from '@/components/ui/choice-button';
import { useExerciseStore } from '@/lib/store';
import { ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

const exercises = [
  {
    id: '1-5-1',
    question: 'Wskaż symbol oznaczający zbiór wszystkich liczb całkowitych.',
    options: ['Z', 'N', 'Q'],
    answer: 'Z',
    explanation: 'Litera Z (z niemieckiego Zahlen) opisuje całą rodzinę liczb całkowitych.'
  },
  {
    id: '1-5-2',
    question: 'Który zestaw zawiera wyłącznie liczby należące do zbioru Z?',
    options: ['-4, 0, 7', '-1/2, 0, 5/2', 'π, 1, -3/2'],
    answer: '-4, 0, 7',
    explanation: 'Liczby całkowite to wartości bez części ułamkowej: ..., -2, -1, 0, 1, 2, ...'
  },
  {
    id: '1-5-3',
    question: 'Jak nazywamy część zbioru Z złożoną z liczb większych od zera?',
    options: ['Z+', 'Z-', 'N-'],
    answer: 'Z+',
    explanation: 'Z+ oznacza liczby całkowite dodatnie: 1, 2, 3, ...'
  },
  {
    id: '1-5-4',
    question: 'Która para tworzy liczby przeciwne należące do Z?',
    options: ['-6 i 6', '2 i 5', '-4 i -4'],
    answer: '-6 i 6',
    explanation: 'Liczby przeciwne mają tę samą odległość od zera, ale przeciwny znak.'
  },
  {
    id: '1-5-5',
    question: 'Które zdanie o zbiorze Z jest prawdziwe?',
    options: [
      'Każda liczba całkowita ma część ułamkową',
      'Zero należy do zbioru liczb całkowitych',
      'W zbiorze Z nie ma liczb ujemnych'
    ],
    answer: 'Zero należy do zbioru liczb całkowitych',
    explanation: 'Zawiera liczby dodatnie, ujemne oraz zero.'
  },
  {
    id: '1-5-6',
    question: 'Która liczba NIE należy do zbioru Z?',
    options: ['-12', '3/4', '0'],
    answer: '3/4',
    explanation: '3/4 ma część ułamkową, więc należy do liczb wymiernych, ale nie całkowitych.'
  }
];

const hints = [
  'Z = {..., -3, -2, -1, 0, 1, 2, 3, ...}',
  'Z+ to dodatnie liczby całkowite, a Z- to ujemne liczby całkowite',
  'Zero należy do Z, ale nie należy do Z⁺ ani Z⁻',
  'Liczby całkowite nie zawierają części dziesiętnej ani ułamkowej'
];

const keyFacts = [
  'Liczby całkowite oznaczamy literą Z (od niem. Zahlen)',
  'Zawierają liczby dodatnie, ujemne oraz zero',
  'Podzbiory: Z+ (dodatnie) i Z- (ujemne)',
  'Każda liczba całkowita ma liczbę przeciwną w zbiorze Z'
];

export function IntegerSetSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const { updateSectionProgress, completeExercise } = useExerciseStore();

  const TOTAL_EXERCISES = exercises.length;
  const currentExercise = exercises[currentIndex];
  const completedCount = currentIndex;
  const displayedProgress = Math.min(
    TOTAL_EXERCISES,
    completedCount + (showFeedback && isCorrect ? 1 : 0)
  );

  useEffect(() => {
    updateSectionProgress('1-5', {
      completed: displayedProgress,
      total: TOTAL_EXERCISES
    });
  }, [displayedProgress, TOTAL_EXERCISES, updateSectionProgress]);

  const checkAnswer = () => {
    if (!selectedAnswer) return;

    const correct = selectedAnswer === currentExercise.answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      completeExercise(currentExercise.id);
    }
  };

  const nextExercise = () => {
    if (currentIndex < TOTAL_EXERCISES - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const resetExercises = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>1.5 Zbiór liczb całkowitych</CardTitle>
            <CardDescription>
              Rozpoznawaj liczby całkowite oraz ich symbolikę
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

        <div className="flex flex-col items-center gap-3">
          {currentExercise.options.map((option) => {
            const selected = selectedAnswer === option;
            const state: ChoiceFeedbackState = showFeedback && selected
              ? (isCorrect ? 'correct' : 'incorrect')
              : 'idle';

            return (
              <ChoiceButton
                key={option}
                selected={selected}
                state={state}
                revealCorrect={showFeedback}
                isCorrectChoice={currentExercise.answer === option}
                onClick={() => !showFeedback && setSelectedAnswer(option)}
                className="w-full max-w-md"
              >
                {option}
              </ChoiceButton>
            );
          })}
        </div>

        {showFeedback && (
          <Alert className={isCorrect ? 'border-green-500' : 'border-red-500'}>
            <AlertDescription>
              {isCorrect
                ? `Świetnie! ${currentExercise.explanation}`
                : `Spróbuj jeszcze raz. ${currentExercise.explanation}`}
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
              {currentIndex < TOTAL_EXERCISES - 1 ? (
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

        <InfoBox title="Kluczowe informacje" items={showHints ? keyFacts : hints} />
      </CardContent>
    </Card>
  );
}
