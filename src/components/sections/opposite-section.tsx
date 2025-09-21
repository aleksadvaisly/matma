'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { ProgressDisplay } from '@/components/ui/progress-display';
import { InfoBox } from '@/components/ui/info-box';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { NumberLine } from '@/components/ui/number-line';
import { useExerciseStore } from '@/lib/store';
import { ArrowRight, RefreshCw, Sparkles } from 'lucide-react';


const exercises = [
  { id: '1-3-1', question: 'Znajdź liczbę przeciwną do 5', answer: '-5', number: 5 },
  { id: '1-3-2', question: 'Znajdź liczbę przeciwną do -3', answer: '3', number: -3 },
  { id: '1-3-3', question: 'Znajdź liczbę przeciwną do -8', answer: '8', number: -8 },
  { id: '1-3-4', question: 'Znajdź liczbę przeciwną do 12', answer: '-12', number: 12 },
  { id: '1-3-5', question: 'Znajdź liczbę przeciwną do 0', answer: '0', number: 0 },
  { id: '1-3-6', question: 'Znajdź liczbę odwrotną do 2', answer: '1/2', number: 2, isReciprocal: true },
  { id: '1-3-7', question: 'Znajdź liczbę odwrotną do 1/3', answer: '3', number: 1/3, isReciprocal: true },
];

export function OppositeSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  
  const {
    updateSectionProgress,
    completeExercise
  } = useExerciseStore();

  const TOTAL_EXERCISES = exercises.length;
  const currentExercise = exercises[currentIndex];
  const completedCount = currentIndex;
  const displayedProgress = Math.min(
    TOTAL_EXERCISES,
    completedCount + (showFeedback && isCorrect ? 1 : 0)
  );

  useEffect(() => {
    updateSectionProgress('1-3', {
      completed: displayedProgress,
      total: TOTAL_EXERCISES
    });
  }, [displayedProgress, TOTAL_EXERCISES, updateSectionProgress]);

  const checkAnswer = () => {
    if (!userAnswer.trim()) return;
    
    const normalizedAnswer = userAnswer.replace(/\s/g, '').toLowerCase();
    const normalizedCorrect = currentExercise.answer.replace(/\s/g, '').toLowerCase();
    
    const correct = normalizedAnswer === normalizedCorrect || 
                   (normalizedAnswer === '0.5' && normalizedCorrect === '1/2') ||
                   (normalizedAnswer === '0,5' && normalizedCorrect === '1/2');
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      completeExercise(currentExercise.id);
    }
  };

  const handleNumberClick = (value: number) => {
    setSelectedNumber(value);
    setUserAnswer(value.toString());
  };

  const nextExercise = () => {
    if (currentIndex < TOTAL_EXERCISES - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setShowFeedback(false);
      setSelectedNumber(null);
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    setUserAnswer('');
    setShowFeedback(false);
    setSelectedNumber(null);
  };

  const definitions = [
    'Liczby przeciwne to liczby równo oddalone od zera, ale po przeciwnych stronach',
    'Liczba przeciwna do a to -a (zmiana znaku)',
    'Suma liczby i liczby do niej przeciwnej wynosi 0: a + (-a) = 0',
    'Liczby odwrotne to liczby, których iloczyn wynosi 1',
    'Liczba odwrotna do a to 1/a (dla a ≠ 0)',
    'Zero nie ma liczby odwrotnej'
  ];

  const isReciprocal = currentExercise.isReciprocal || false;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>1.3 Liczby przeciwne i odwrotne</CardTitle>
            <CardDescription>
              Naucz się znajdować liczby przeciwne i odwrotne
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

        {!isReciprocal && (
          <>
            <NumberLine
              min={-Math.max(Math.abs(currentExercise.number) + 2, 5)}
              max={Math.max(Math.abs(currentExercise.number) + 2, 5)}
              onNumberClick={handleNumberClick}
              selectedNumber={selectedNumber}
              showHints={showHints}
              correctAnswer={-currentExercise.number}
              markedNumbers={[
                { value: currentExercise.number, color: 'hsl(var(--primary))', label: 'Original' },
                ...(showFeedback && isCorrect ? [{ value: -currentExercise.number, color: 'hsl(var(--destructive))', label: 'Opposite' }] : []),
                ...(userAnswer && !showFeedback && !isNaN(parseInt(userAnswer)) ? [{ value: parseInt(userAnswer), color: 'blue', label: 'Your answer' }] : [])
              ]}
              feedbackState={showFeedback ? (isCorrect ? 'correct' : 'incorrect') : 'idle'}
            />
            {showFeedback && isCorrect && currentExercise.number !== 0 && (
              <div className="text-center text-sm text-muted-foreground">
                Liczba przeciwna: {currentExercise.number} → {-currentExercise.number}
              </div>
            )}
          </>
        )}

        {isReciprocal && (
          <div className="text-center p-8 bg-muted/30 rounded-lg">
            <div className="text-3xl font-bold mb-4">
              {currentExercise.number === 1/3 ? '1/3' : currentExercise.number}
            </div>
            <div className="text-lg text-muted-foreground">
              {currentExercise.number} × ? = 1
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder={isReciprocal ? "Wpisz odpowiedź (np. 1/2 lub 0.5)" : "Wpisz liczbę przeciwną"}
            className={`flex-1 text-center text-lg ${
              showHints && !showFeedback ? "bg-green-100 border-green-300 animate-pulse" : ""
            }`}
            onKeyPress={(e) => e.key === 'Enter' && !showFeedback && checkAnswer()}
          />
        </div>

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
              disabled={!userAnswer.trim()}
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
                <Button onClick={reset} className="flex-1 gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Rozpocznij od nowa
                </Button>
              )}
            </>
          )}
        </div>


        <InfoBox title="Definicje" items={definitions} />
      </CardContent>
    </Card>
  );
}
