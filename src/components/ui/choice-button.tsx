'use client';

import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ChoiceFeedbackState = 'idle' | 'correct' | 'incorrect';

interface ChoiceButtonProps extends ButtonProps {
  selected?: boolean;
  state?: ChoiceFeedbackState;
  revealCorrect?: boolean;
  isCorrectChoice?: boolean;
}

export function ChoiceButton({
  selected = false,
  state = 'idle',
  revealCorrect = false,
  isCorrectChoice = false,
  className,
  children,
  ...props
}: ChoiceButtonProps) {
  const baseSelectedClass = selected && state === 'idle'
    ? 'border-primary text-primary bg-primary/10 hover:bg-primary/20'
    : '';

  const feedbackClass = state === 'correct'
    ? 'border-green-500 text-green-700 bg-green-50 hover:bg-green-100'
    : state === 'incorrect'
      ? 'border-red-500 text-red-700 bg-red-50 hover:bg-red-100'
      : '';

  const revealClass = revealCorrect && isCorrectChoice
    ? 'border-green-500 text-green-700 bg-green-50 hover:bg-green-100'
    : '';

  return (
    <Button
      variant="outline"
      className={cn(
        'min-w-[3rem] justify-center text-lg font-semibold transition-colors whitespace-nowrap',
        baseSelectedClass,
        feedbackClass,
        revealClass,
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

ChoiceButton.displayName = 'ChoiceButton';
