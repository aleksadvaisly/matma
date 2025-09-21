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

interface TechniqueExercise {
  id: string;
  terms: number[];
  options: string[];
  answer: string;
  explanation: string;
  hint: string;
  hintSteps?: string[];
}

const exercises: TechniqueExercise[] = [
  {
    id: '2-2-1',
    terms: [-6, 4, 6, -4],
    options: ['0', '2', '-2'],
    answer: '0',
    explanation: 'Sparuj liczby przeciwne: (-6 + 6) = 0 oraz (4 + -4) = 0. Cała suma to 0.',
    hint: 'Połącz liczby o przeciwnych znakach, aby się zniosły.',
    hintSteps: ['(-6) + 6 = 0', '4 + (-4) = 0']
  },
  {
    id: '2-2-2',
    terms: [8, -3, -5, 10],
    options: ['10', '0', '-10'],
    answer: '10',
    explanation: 'Najpierw dodaj 8 i -3, otrzymasz 5. 5 + (-5) = 0, więc zostaje tylko 10.',
    hint: 'Szukaj par dających 0, aby uprościć działanie.',
    hintSteps: ['8 + (-3) = 5', '5 + (-5) = 0', '0 + 10 = 10']
  },
  {
    id: '2-2-3',
    terms: [-7, -5, 12, 3],
    options: ['3', '7', '-7'],
    answer: '3',
    explanation: 'Dodaj 12 i -5, otrzymasz 7. 7 + (-7) = 0, zostaje 3.',
    hint: 'Grupuj liczby tak, by powstały zera.',
    hintSteps: ['12 + (-5) = 7', '7 + (-7) = 0', '0 + 3 = 3']
  },
  {
    id: '2-2-4',
    terms: [-9, 4, -1, 6],
    options: ['0', '-10', '10'],
    answer: '0',
    explanation: 'Dodaj -9 i 6, masz -3. -3 + 4 = 1, 1 + (-1) = 0.',
    hint: 'Zmieniając kolejność, możesz szybciej dojść do zera.',
    hintSteps: ['(-9) + 6 = -3', '-3 + 4 = 1', '1 + (-1) = 0']
  },
  {
    id: '2-2-5',
    terms: [-15, 8, 2, 5],
    options: ['0', '-20', '10'],
    answer: '0',
    explanation: 'Połącz 8 i 2, to 10. 10 + 5 = 15. 15 + (-15) = 0.',
    hint: 'Łącz dodatnie składniki, aby utworzyć liczbę przeciwną do ujemnej.',
    hintSteps: ['8 + 2 = 10', '10 + 5 = 15', '15 + (-15) = 0']
  }
];

const techniques = [
  'Zmiana kolejności składników nie wpływa na wynik (łączność i przemienność)',
  'Warto wyszukiwać par liczb przeciwnych, które dają 0',
  'Można grupować dodatnie liczby, by zbudować liczbę przeciwną do ujemnej'
];

export function AdditionTechniquesSection() {
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
    updateSectionProgress('2-2', {
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
            <CardTitle>2.2 Techniki obliczeniowe</CardTitle>
            <CardDescription>
              Uprość dodawanie liczb całkowitych za pomocą sprytnych grupowań
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
          <div className="space-y-3 rounded-md border border-dashed border-blue-300 bg-blue-50 p-4 text-sm text-blue-700">
            <div>{currentExercise.hint}</div>
            {currentExercise.hintSteps && (
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs uppercase tracking-wide">
                {currentExercise.hintSteps.map((step) => (
                  <span key={step} className="rounded-full bg-white px-3 py-1 text-blue-700 shadow-sm">
                    {step}
                  </span>
                ))}
              </div>
            )}
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
                ? `Świetnie! ${currentExercise.explanation}`
                : `Sprawdź swoje grupowania. ${currentExercise.explanation}`}
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

        <InfoBox title="Techniki" items={techniques} />
      </CardContent>
    </Card>
  );
}
