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

interface WordProblemExercise {
  id: string;
  scenario: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  hint: string;
}

const exercises: WordProblemExercise[] = [
  {
    id: '2-3-1',
    scenario: 'Rano temperatura wynosiła -2 st. C. W ciągu dnia wzrosła o 5 st. C, a wieczorem spadła o 3 st. C.',
    question: 'Jaka temperatura była wieczorem?',
    options: ['0 st. C', '-4 st. C', '1 st. C'],
    answer: '0 st. C',
    explanation: '-2 + 5 = 3, 3 + (-3) = 0. Temperatura wieczorem to 0 st. C.',
    hint: 'Dodaj wszystkie zmiany jedna po drugiej.'
  },
  {
    id: '2-3-2',
    scenario: 'Na koncie było -50 zł. Wpłata wyniosła 120 zł, a następnie wypłacono 40 zł.',
    question: 'Jaki jest stan konta po operacjach?',
    options: ['30 zł', '10 zł', '-30 zł'],
    answer: '30 zł',
    explanation: '-50 + 120 = 70, 70 + (-40) = 30.',
    hint: 'Najpierw zlikwiduj dług, potem odejmij wypłatę.'
  },
  {
    id: '2-3-3',
    scenario: 'Winda startuje na 6. piętrze, zjeżdża 8 pięter w dół i wjeżdża 3 piętra w górę.',
    question: 'Na którym piętrze zatrzyma się winda?',
    options: ['1. piętro', '2. piętro', '3. piętro'],
    answer: '1. piętro',
    explanation: '6 + (-8) = -2, -2 + 3 = 1. Winda kończy na 1. piętrze.',
    hint: 'Zapisz ruchy windy jako dodawanie liczb dodatnich i ujemnych.'
  },
  {
    id: '2-3-4',
    scenario: 'Nurek znajduje się 12 metrów poniżej poziomu morza. Wypływa 9 metrów w górę, a potem zanurza się o dodatkowe 4 metry.',
    question: 'Na jakiej głębokości kończy?',
    options: ['-7 m', '-15 m', '-5 m'],
    answer: '-7 m',
    explanation: '-12 + 9 = -3, -3 + (-4) = -7.',
    hint: 'Pamiętaj, że głębokość poniżej zera zapisujemy liczbami ujemnymi.'
  },
  {
    id: '2-3-5',
    scenario: 'W grze planszowej gracz miał 10 punktów, stracił 25 punktów, a następnie zyskał 15 punktów bonusu.',
    question: 'Ile punktów ma teraz?',
    options: ['0 punktów', '-20 punktów', '5 punktów'],
    answer: '0 punktów',
    explanation: '10 + (-25) = -15, -15 + 15 = 0.',
    hint: 'Zapisz każdą zmianę jako liczbę całkowitą i dodaj kolejno.'
  }
];

const strategies = [
  'Każdą zmianę zapisuj jako liczbę: wzrost to plus, spadek to minus',
  'Dodawaj kolejno, pilnując znaków przy każdej operacji',
  'Po każdym kroku sprawdzaj, czy przekroczyłeś zero'
];

export function AdditionWordProblemsSection() {
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
    updateSectionProgress('2-3', {
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
            <CardTitle>2.3 Zadania z treścią</CardTitle>
            <CardDescription>
              Przekształcaj sytuacje z życia na działania na liczbach całkowitych
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
        <div className="rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Scenariusz</p>
          <p>{currentExercise.scenario}</p>
        </div>

        <div className="text-lg font-medium text-center">
          {currentExercise.question}
        </div>

        {showHints && (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
            {currentExercise.hint}
          </div>
        )}

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
                ? `Dobrze! ${currentExercise.explanation}`
                : `Policz jeszcze raz krok po kroku. ${currentExercise.explanation}`}
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

        <InfoBox title="Strategie" items={strategies} />
      </CardContent>
    </Card>
  );
}
