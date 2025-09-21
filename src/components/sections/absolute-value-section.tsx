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
  { id: '1-4-1', question: 'Oblicz wartość bezwzględną: |7|', answer: '7', number: 7 },
  { id: '1-4-2', question: 'Oblicz wartość bezwzględną: |-5|', answer: '5', number: -5 },
  { id: '1-4-3', question: 'Oblicz wartość bezwzględną: |-12|', answer: '12', number: -12 },
  { id: '1-4-4', question: 'Oblicz wartość bezwzględną: |0|', answer: '0', number: 0 },
  { id: '1-4-5', question: 'Oblicz wartość bezwzględną: |15|', answer: '15', number: 15 },
  { id: '1-4-6', question: 'Oblicz wartość bezwzględną: |-3|', answer: '3', number: -3 },
  { id: '1-4-7', question: 'Oblicz wartość bezwzględną: |-20|', answer: '20', number: -20 },
];

export function AbsoluteValueSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [clickedNumbers, setClickedNumbers] = useState<number[]>([]);
  
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
    updateSectionProgress('1-4', {
      completed: displayedProgress,
      total: TOTAL_EXERCISES
    });
  }, [displayedProgress, TOTAL_EXERCISES, updateSectionProgress]);

  const checkAnswer = () => {
    if (!userAnswer.trim()) return;
    
    const correct = userAnswer.trim() === currentExercise.answer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      completeExercise(currentExercise.id);
    }
  };

  const handleNumberClick = (value: number) => {
    if (!clickedNumbers.includes(value)) {
      setClickedNumbers([...clickedNumbers, value]);
    }
    setUserAnswer(Math.abs(value).toString());
  };

  const nextExercise = () => {
    if (currentIndex < TOTAL_EXERCISES - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setShowFeedback(false);
      setClickedNumbers([]);
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    setUserAnswer('');
    setShowFeedback(false);
    setClickedNumbers([]);
  };

  const properties = [
    'Wartość bezwzględna liczby to jej odległość od zera na osi liczbowej',
    'Wartość bezwzględna jest zawsze nieujemna (≥ 0)',
    'Dla liczb dodatnich: |a| = a',
    'Dla liczb ujemnych: |a| = -a (zmiana znaku)',
    'Dla zera: |0| = 0',
    'Przykład: |-5| = 5, bo odległość -5 od zera wynosi 5'
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>1.4 Wartość bezwzględna</CardTitle>
            <CardDescription>
              Naucz się obliczać wartość bezwzględną liczb całkowitych
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

        <div className="space-y-4">
          <NumberLine
            min={-Math.max(Math.abs(currentExercise.number) + 2, 5)}
            max={Math.max(Math.abs(currentExercise.number) + 2, 5)}
            markedNumbers={[
              { value: currentExercise.number, color: 'hsl(var(--primary))' },
              { value: 0, color: 'black' }
            ]}
            onNumberClick={handleNumberClick}
            enableAllClicks={true}
            clickedNumbers={clickedNumbers}
          />
          <div className="text-center">
            <div className="text-2xl font-bold">
              |{currentExercise.number}| = {showFeedback && isCorrect ? <span className={showHints ? "text-yellow-500" : "text-destructive"}>{Math.abs(currentExercise.number)}</span> : '?'}
            </div>
            {showFeedback && isCorrect && currentExercise.number !== 0 && (
              <div className="text-sm text-muted-foreground mt-2">
                Odległość od zera: {Math.abs(currentExercise.number)} jednostek
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Wpisz wartość bezwzględną"
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
                : `Nieprawidłowo. |${currentExercise.number}| = ${currentExercise.answer}`}
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


        <InfoBox title="Własności wartości bezwzględnej" items={properties} />
      </CardContent>
    </Card>
  );
}
