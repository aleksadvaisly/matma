'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FeedbackSystemProps {
  showFeedback: boolean;
  isCorrect: boolean;
  correctAnswer?: string | number;
  customMessage?: string;
  selectedAnswer?: string | number | null;
  canSubmit?: boolean;
  isLastExercise?: boolean;
  nextSectionUrl?: string;
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
  nextSectionUrl,
  onCheck,
  onNext,
  onReset
}: FeedbackSystemProps) {
  const router = useRouter();
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
            style={{ cursor: (!canSubmit || selectedAnswer === null || selectedAnswer === '') ? 'not-allowed' : 'pointer' }}
          >
            Sprawdź odpowiedź
          </Button>
        ) : (
          <>
            {!isLastExercise ? (
              <>
                <Button 
                  onClick={onReset} 
                  variant="outline"
                  className="gap-2" 
                  style={{ cursor: 'pointer' }}
                >
                  <RefreshCw className="h-4 w-4" />
                  Powtórz zadanie
                </Button>
                <Button onClick={onNext} className="flex-1 gap-2" style={{ cursor: 'pointer' }}>
                  Następne zadanie
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            ) : nextSectionUrl ? (
              <Button 
                onClick={() => router.push(nextSectionUrl)} 
                className="flex-1 gap-2"
                style={{ cursor: 'pointer' }}
              >
                Przejdź do następnego tematu
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={onReset} className="flex-1 gap-2" style={{ cursor: 'pointer' }}>
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