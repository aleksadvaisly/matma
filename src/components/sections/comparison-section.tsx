'use client';

import { ExerciseCard, type Exercise } from '@/components/exercise/exercise-card';
import { NumberLine } from '@/components/ui/number-line';
import { HintHighlightGroup } from '@/components/ui/hint-highlight';
import { ChoiceButton, type ChoiceFeedbackState } from '@/components/ui/choice-button';

const exercises: Exercise[] = [
  {
    id: '1-2-1',
    question: 'Porównaj liczby: -3 ? 2',
    answer: '<',
    options: ['<', '=', '>'],
    hint: 'Każda liczba ujemna jest mniejsza od każdej liczby dodatniej.',
    inputType: 'choices'
  },
  {
    id: '1-2-2',
    question: 'Porównaj liczby: 5 ? -1',
    answer: '>',
    options: ['<', '=', '>'],
    hint: 'Liczby dodatnie są zawsze większe od ujemnych.',
    inputType: 'choices'
  },
  {
    id: '1-2-3',
    question: 'Porównaj liczby: -7 ? -4',
    answer: '<',
    options: ['<', '=', '>'],
    hint: 'Z dwóch liczb ujemnych większa jest ta, która jest bliżej zera.',
    inputType: 'choices'
  },
  {
    id: '1-2-4',
    question: 'Porównaj liczby: -2 ? -8',
    answer: '>',
    options: ['<', '=', '>'],
    hint: '-2 jest bliżej zera niż -8, więc jest większe.',
    inputType: 'choices'
  },
  {
    id: '1-2-5',
    question: 'Porównaj liczby: 0 ? -5',
    answer: '>',
    options: ['<', '=', '>'],
    hint: 'Zero jest większe od każdej liczby ujemnej.',
    inputType: 'choices'
  },
  {
    id: '1-2-6',
    question: 'Porównaj liczby: -3 ? -3',
    answer: '=',
    options: ['<', '=', '>'],
    hint: 'To ta sama liczba, więc są sobie równe.',
    inputType: 'choices'
  },
  {
    id: '1-2-7',
    question: 'Porównaj liczby: 4 ? 7',
    answer: '<',
    options: ['<', '=', '>'],
    hint: 'Na osi liczbowej 4 znajduje się po lewej stronie od 7.',
    inputType: 'choices'
  }
];

const rules = [
  'Im bardziej na prawo na osi, tym liczba większa',
  'Liczby dodatnie są zawsze większe od liczb ujemnych',
  'Zero jest większe od wszystkich liczb ujemnych',
  'Z dwóch liczb ujemnych większa jest ta bliższa zeru',
  'Przykład: -2 > -5 bo -2 jest bliżej zera'
];

export function ComparisonSection() {
  return (
    <ExerciseCard
      title="1.2 Porównywanie liczb"
      description="Naucz się porównywać liczby całkowite używając znaków <, = i >"
      sectionId="1-2"
      exercises={exercises}
      hints={rules}
      customContent={(exercise, props) => {
        const match = exercise.question?.match(/(-?\d+)\s*\?\s*(-?\d+)/);
        const leftNumber = match ? parseInt(match[1]) : 0;
        const rightNumber = match ? parseInt(match[2]) : 0;

        return (
          <>
            <div className="text-lg font-medium text-center">
              {exercise.question}
            </div>

            <div className="space-y-4">
              <NumberLine
                min={Math.min(leftNumber, rightNumber, -5) - 2}
                max={Math.max(leftNumber, rightNumber, 5) + 2}
                markedNumbers={[
                  { value: leftNumber, color: 'hsl(var(--primary))' },
                  { value: rightNumber, color: 'hsl(var(--primary))' }
                ]}
              />
              
              <div className="text-center space-y-4">
                <div className="text-2xl font-bold">
                  <span className="text-primary">{leftNumber}</span>
                  <span className="mx-4">?</span>
                  <span className="text-primary">{rightNumber}</span>
                </div>
                
                <div className="flex justify-center gap-4">
                  <HintHighlightGroup showHints={props.showHints} correctAnswer={exercise.answer as string}>
                    {exercise.options?.map((symbol) => {
                      const selected = props.selectedAnswer === symbol;
                      const isCorrectChoice = exercise.answer === symbol;
                      const state: ChoiceFeedbackState = props.showFeedback && selected
                        ? (props.isCorrect ? 'correct' : 'incorrect')
                        : 'idle';

                      return (
                        <ChoiceButton
                          key={symbol}
                          data-value={symbol}
                          size="lg"
                          selected={selected}
                          state={state}
                          revealCorrect={props.showFeedback}
                          isCorrectChoice={isCorrectChoice}
                          onClick={() => props.setSelectedAnswer(symbol)}
                          className="w-16 h-16"
                        >
                          {symbol}
                        </ChoiceButton>
                      );
                    })}
                  </HintHighlightGroup>
                </div>
              </div>
            </div>
          </>
        );
      }}
    />
  );
}