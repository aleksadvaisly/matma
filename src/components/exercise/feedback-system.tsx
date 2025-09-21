'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowRight, RefreshCw } from 'lucide-react';

interface FeedbackSystemProps {
  showFeedback: boolean;
  isCorrect: boolean;
  correctAnswer?: string | number;
  customMessage?: string;
  selectedAnswer?: string | number | null;
  canSubmit?: boolean;
  isLastExercise?: boolean;
  onCheck: () => void;
  onNext: () => void;
  onReset: () => void;
}

export function FeedbackSystem({
  showFeedback,
  isCorrect,
  correctAnswer,
  customMessage,
  selectedAnswer,
  canSubmit = true,
  isLastExercise = false,
  onCheck,
  onNext,
  onReset
}: FeedbackSystemProps) {
  return (
    <>
      {showFeedback && (
        <Alert className={isCorrect ? "border-green-500" : "border-red-500"}>
          <AlertDescription>
            {customMessage || (
              isCorrect 
                ? "Świetnie! Prawidłowa odpowiedź!" 
                : `Nieprawidłowo. Prawidłowa odpowiedź to ${correctAnswer}.`
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        {!showFeedback ? (
          <Button 
            onClick={onCheck}
            disabled={!canSubmit || selectedAnswer === null || selectedAnswer === ''}
            className="flex-1"
          >
            Sprawdź odpowiedź
          </Button>
        ) : (
          <>
            {!isLastExercise ? (
              <Button onClick={onNext} className="flex-1 gap-2">
                Następne zadanie
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={onReset} className="flex-1 gap-2">
                <RefreshCw className="h-4 w-4" />
                Rozpocznij od nowa
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
}