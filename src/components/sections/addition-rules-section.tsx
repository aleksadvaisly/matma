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
import { ExpressionLine } from '@/components/ui/expression-line';
import { useExerciseStore } from '@/lib/store';
import { ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

interface AdditionExercise {
  id: string;
  terms: number[];
  options: string[];
  answer: string;
  explanation: string;
  hint: string;
}

const exercises: AdditionExercise[] = [
  {
    id: '2-1-1',
    terms: [-3, -5],
    options: ['-8', '-2', '2'],
    answer: '-8',
    explanation: 'Liczby mają ten sam znak, więc dodajemy moduły: 3 + 5 = 8 i zachowujemy znak minus.',
    hint: 'Przy tym samym znaku dodaj moduły i zachowaj znak liczb.'
  },
  {
    id: '2-1-2',
    terms: [7, -4],
    options: ['11', '3', '-3'],
    answer: '3',
    explanation: 'Znaki są różne. Odejmij mniejszy moduł od większego: 7 - 4 = 3. Wynik ma znak liczby o większym module, czyli dodatni.',
    hint: 'Porównaj, która liczba jest dalej od zera.'
  },
  {
    id: '2-1-3',
    terms: [-12, 9],
    options: ['-21', '-3', '21'],
    answer: '-3',
    explanation: 'Moduły różnią się o 3. Większy moduł ma liczba ujemna, więc wynik jest -3.',
    hint: '12 jest dalej od zera niż 9, dlatego wynik będzie ujemny.'
  },
  {
    id: '2-1-4',
    terms: [15, 8],
    options: ['7', '23', '-23'],
    answer: '23',
    explanation: 'Dodajemy dwa dodatnie składniki: 15 + 8 = 23.',
    hint: 'Przy tym samym znaku po prostu dodaj wartości.'
  },
  {
    id: '2-1-5',
    terms: [-6, -9],
    options: ['-15', '15', '-3'],
    answer: '-15',
    explanation: 'Suma liczb ujemnych to liczba ujemna. 6 + 9 = 15, więc wynik to -15.',
    hint: 'Dodaj moduły, znak pozostaje ujemny.'
  },
  {
    id: '2-1-6',
    terms: [-4, 4],
    options: ['8', '0', '-8'],
    answer: '0',
    explanation: 'Liczby przeciwne sumują się do zera.',
    hint: 'Gdy liczby są przeciwne, znoszą się.'
  }
];

const rules = [
  'Liczby o tym samym znaku dodajemy, zachowując ich znak',
  'Przy przeciwnych znakach odejmujemy moduły i bierzemy znak liczby o większym module',
  'Liczby przeciwne zawsze dają w sumie zero'
];

export function AdditionRulesSection() {
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
    updateSectionProgress('2-1', {
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
            <CardTitle>2.1 Zasady dodawania</CardTitle>
            <CardDescription>
              Utrwal zasady dodawania liczb całkowitych o różnych znakach
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
        <ExpressionLine terms={currentExercise.terms} />

        {showHints && (
          <div className="rounded-md border border-dashed border-green-300 bg-green-50 p-4 text-sm text-green-700">
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
                ? `Brawo! ${currentExercise.explanation}`
                : `Jeszcze raz. ${currentExercise.explanation}`}
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

        <InfoBox title="Podstawowe zasady" items={rules} />
      </CardContent>
    </Card>
  );
}
