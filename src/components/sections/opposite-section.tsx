'use client';

import { ExerciseCard, type Exercise } from '@/components/exercise/exercise-card';
import { NumberLine } from '@/components/ui/number-line';
import { Input } from '@/components/ui/input';

const exercises: Exercise[] = [
  { 
    id: '1-3-1', 
    question: 'Znajdź liczbę przeciwną do 5', 
    answer: '-5',
    inputType: 'text'
  },
  { 
    id: '1-3-2', 
    question: 'Znajdź liczbę przeciwną do -3', 
    answer: '3',
    inputType: 'text'
  },
  { 
    id: '1-3-3', 
    question: 'Znajdź liczbę przeciwną do -8', 
    answer: '8',
    inputType: 'text'
  },
  { 
    id: '1-3-4', 
    question: 'Znajdź liczbę przeciwną do 12', 
    answer: '-12',
    inputType: 'text'
  },
  { 
    id: '1-3-5', 
    question: 'Znajdź liczbę przeciwną do 0', 
    answer: '0',
    inputType: 'text'
  },
  { 
    id: '1-3-6', 
    question: 'Znajdź liczbę odwrotną do 2', 
    answer: '1/2',
    inputType: 'text'
  },
  { 
    id: '1-3-7', 
    question: 'Znajdź liczbę odwrotną do 1/3', 
    answer: '3',
    inputType: 'text'
  }
];

const hints = [
  'Liczba przeciwna to liczba o tej samej wartości bezwzględnej, ale przeciwnym znaku',
  'Liczba przeciwna do a to -a',
  'Suma liczby i jej liczby przeciwnej wynosi 0',
  'Liczba przeciwna do 0 to 0',
  'Liczba odwrotna to 1 podzielone przez tę liczbę'
];

export function OppositeSection() {
  return (
    <ExerciseCard
      title="1.3 Liczby przeciwne"
      description="Poznaj pojęcie liczby przeciwnej i odwrotnej"
      sectionId="1-3"
      exercises={exercises}
      hints={hints}
      customContent={(exercise, props) => {
        const match = exercise.question?.match(/(-?\d+(?:\/\d+)?)/);
        const number = match ? match[1] : '0';
        const isReciprocal = exercise.question?.includes('odwrotną');
        
        const parseNumber = (str: string) => {
          if (str.includes('/')) {
            const [num, den] = str.split('/');
            return parseInt(num) / parseInt(den);
          }
          return parseInt(str);
        };

        const numValue = parseNumber(number);
        const min = Math.min(numValue, -numValue, -10);
        const max = Math.max(numValue, -numValue, 10);

        const handleNumberClick = (value: number) => {
          props.setSelectedAnswer(String(value));
        };

        return (
          <>
            <div className="text-lg font-medium text-center">
              {exercise.question}
            </div>

            {!isReciprocal && (
              <NumberLine
                min={min - 2}
                max={max + 2}
                markedNumbers={[
                  { value: numValue, color: 'hsl(var(--primary))' },
                  ...(props.showFeedback && !isReciprocal && numValue !== 0 
                    ? [{ value: -numValue, color: 'hsl(var(--destructive))' }] 
                    : [])
                ]}
                selectedNumber={props.selectedAnswer ? parseNumber(String(props.selectedAnswer)) : null}
                onNumberClick={handleNumberClick}
                showHints={props.showHints}
                correctAnswer={parseNumber(String(exercise.answer))}
                feedbackState={props.showFeedback 
                  ? (props.isCorrect ? 'correct' : 'incorrect') 
                  : 'idle'}
              />
            )}

            <div className="flex items-center gap-2 max-w-sm mx-auto">
              <span className="text-lg font-medium">Odpowiedź:</span>
              <Input
                type="text"
                value={props.selectedAnswer || ''}
                onChange={(e) => props.setSelectedAnswer(e.target.value)}
                placeholder="Wpisz odpowiedź"
                disabled={props.showFeedback}
                className={`${
                  props.showHints && !props.showFeedback 
                    ? 'bg-green-100 border-green-300 animate-pulse' 
                    : ''
                }`}
              />
            </div>
          </>
        );
      }}
    />
  );
}