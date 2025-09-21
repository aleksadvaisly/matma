'use client';

import { useState } from 'react';
import { ExerciseCard, type Exercise } from '@/components/exercise/exercise-card';
import { NumberLine } from '@/components/ui/number-line';
import { Input } from '@/components/ui/input';

const exercises: Exercise[] = [
  { 
    id: '1-4-1', 
    question: 'Znajdź wartość bezwzględną liczby -7', 
    answer: '7',
    inputType: 'text'
  },
  { 
    id: '1-4-2', 
    question: 'Ile wynosi |5|?', 
    answer: '5',
    inputType: 'text'
  },
  { 
    id: '1-4-3', 
    question: 'Oblicz |-12|', 
    answer: '12',
    inputType: 'text'
  },
  { 
    id: '1-4-4', 
    question: 'Która liczba ma większą wartość bezwzględną: -8 czy 6?', 
    answer: '-8',
    inputType: 'text'
  },
  { 
    id: '1-4-5', 
    question: 'Ile wynosi |0|?', 
    answer: '0',
    inputType: 'text'
  },
  { 
    id: '1-4-6', 
    question: 'Znajdź liczbę, której wartość bezwzględna wynosi 15', 
    answer: '15',
    inputType: 'text'
  },
  { 
    id: '1-4-7', 
    question: 'Która liczba jest dalej od zera: -10 czy 9?', 
    answer: '-10',
    inputType: 'text'
  }
];

const hints = [
  'Wartość bezwzględna to odległość liczby od zera na osi liczbowej',
  'Wartość bezwzględna jest zawsze nieujemna',
  '|a| = a dla a ≥ 0, |a| = -a dla a < 0',
  'Liczby przeciwne mają tę samą wartość bezwzględną',
  'Im większa wartość bezwzględna, tym liczba jest dalej od zera'
];

export function AbsoluteValueSection() {
  return (
    <ExerciseCard
      title="1.4 Wartość bezwzględna"
      description="Naucz się obliczać wartość bezwzględną liczb"
      sectionId="1-4"
      exercises={exercises}
      hints={hints}
      customContent={(exercise, props) => {
        const [clickedNumbers, setClickedNumbers] = useState<number[]>([]);
        
        const extractNumbers = () => {
          const matches = exercise.question?.match(/-?\d+/g) || [];
          return matches.map(m => parseInt(m));
        };

        const numbers = extractNumbers();
        const min = Math.min(...numbers, -10);
        const max = Math.max(...numbers, 10);

        const handleNumberClick = (value: number) => {
          if (!clickedNumbers.includes(value)) {
            setClickedNumbers([...clickedNumbers, value]);
          }
          const absValue = Math.abs(value);
          
          if (exercise.question?.includes('większą wartość') || exercise.question?.includes('dalej od zera')) {
            props.setSelectedAnswer(String(value));
          } else if (exercise.question?.includes('której wartość bezwzględna')) {
            props.setSelectedAnswer(String(absValue));
          } else {
            props.setSelectedAnswer(String(absValue));
          }
        };

        return (
          <>
            <div className="text-lg font-medium text-center">
              {exercise.question}
            </div>

            <NumberLine
              min={min - 2}
              max={max + 2}
              markedNumbers={numbers.map(n => ({ 
                value: n, 
                color: 'hsl(var(--primary))' 
              }))}
              selectedNumber={props.selectedAnswer ? parseInt(String(props.selectedAnswer)) : null}
              onNumberClick={handleNumberClick}
              showHints={props.showHints}
              correctAnswer={parseInt(String(exercise.answer))}
              feedbackState={props.showFeedback 
                ? (props.isCorrect ? 'correct' : 'incorrect') 
                : 'idle'}
              enableAllClicks={true}
            />

            <div className="space-y-2">
              {clickedNumbers.map(num => (
                <div key={num} className="text-center text-sm text-muted-foreground">
                  |{num}| = {Math.abs(num)}
                </div>
              ))}
            </div>

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