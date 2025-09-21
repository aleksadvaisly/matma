'use client';

import { ExerciseCard, type Exercise } from '@/components/exercise/exercise-card';

const exercises: Exercise[] = [
  {
    id: '2-2-1',
    terms: [-6, 4, 6, -4],
    options: ['0', '2', '-2'],
    answer: '0',
    explanation: 'Sparuj liczby przeciwne: (-6 + 6) = 0 oraz (4 + -4) = 0. Cała suma to 0.',
    hint: 'Połącz liczby o przeciwnych znakach, aby się zniosły.',
    inputType: 'choices'
  },
  {
    id: '2-2-2',
    terms: [8, -3, -5, 10],
    options: ['10', '0', '-10'],
    answer: '10',
    explanation: 'Najpierw dodaj 8 i -3, otrzymasz 5. 5 + (-5) = 0, więc zostaje tylko 10.',
    hint: 'Szukaj par dających 0, aby uprościć działanie.',
    inputType: 'choices'
  },
  {
    id: '2-2-3',
    terms: [-7, -5, 12, 3],
    options: ['3', '7', '-7'],
    answer: '3',
    explanation: 'Dodaj 12 i -5, otrzymasz 7. 7 + (-7) = 0, zostaje 3.',
    hint: 'Grupuj liczby tak, by powstały zera.',
    inputType: 'choices'
  },
  {
    id: '2-2-4',
    terms: [-9, 4, -1, 6],
    options: ['0', '-10', '10'],
    answer: '0',
    explanation: 'Dodaj -9 i 6, masz -3. -3 + 4 = 1, 1 + (-1) = 0.',
    hint: 'Zmieniając kolejność, możesz szybciej dojść do zera.',
    inputType: 'choices'
  },
  {
    id: '2-2-5',
    terms: [-15, 8, 2, 5],
    options: ['0', '-20', '10'],
    answer: '0',
    explanation: 'Połącz 8 i 2, to 10. 10 + 5 = 15. 15 + (-15) = 0.',
    hint: 'Łącz dodatnie składniki, aby utworzyć liczbę przeciwną do ujemnej.',
    inputType: 'choices'
  }
];

const techniques = [
  'Zmiana kolejności składników nie wpływa na wynik (łączność i przemienność)',
  'Warto wyszukiwać par liczb przeciwnych, które dają 0',
  'Można grupować dodatnie liczby, by zbudować liczbę przeciwną do ujemnej'
];

export function AdditionTechniquesSection() {
  return (
    <ExerciseCard
      title="2.2 Techniki dodawania"
      description="Poznaj sprytne metody dodawania wielu liczb całkowitych"
      sectionId="2-2"
      exercises={exercises}
      hints={techniques}
      customContent={(exercise, props) => {
        const hintSteps = [
          ['(-6) + 6 = 0', '4 + (-4) = 0'],
          ['8 + (-3) = 5', '5 + (-5) = 0', '0 + 10 = 10'],
          ['12 + (-5) = 7', '7 + (-7) = 0', '0 + 3 = 3'],
          ['(-9) + 6 = -3', '-3 + 4 = 1', '1 + (-1) = 0'],
          ['8 + 2 = 10', '10 + 5 = 15', '15 + (-15) = 0']
        ];

        const currentSteps = hintSteps[exercises.findIndex(e => e.id === exercise.id)] || [];

        return (
          <>
            {exercise.terms && (
              <div className="text-2xl font-bold text-center mb-4">
                {exercise.terms.map((term, i) => (
                  <span key={i}>
                    {i > 0 && term >= 0 ? ' + ' : ' '}
                    {i > 0 && term < 0 ? ' ' : ''}
                    {term < 0 ? `(${term})` : term}
                  </span>
                ))} = ?
              </div>
            )}

            {props.showHints && currentSteps.length > 0 && (
              <div className="space-y-2 mb-4">
                <div className="text-sm text-muted-foreground text-center">Kroki rozwiązania:</div>
                {currentSteps.map((step, i) => (
                  <div key={i} className="text-center text-sm bg-green-50 p-2 rounded border border-green-200">
                    {step}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center gap-4">
              {exercise.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => !props.showFeedback && props.setSelectedAnswer(option)}
                  disabled={props.showFeedback}
                  className={`
                    px-8 py-4 text-lg font-medium rounded-lg border-2 transition-all
                    ${props.selectedAnswer === option 
                      ? props.showFeedback
                        ? props.isCorrect
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-red-500 text-white border-red-500'
                        : 'bg-yellow-100 border-yellow-400'
                      : props.showFeedback && exercise.answer === option
                        ? 'bg-green-100 border-green-500'
                        : 'bg-white hover:bg-gray-50 border-gray-300'
                    }
                    ${props.showHints && !props.showFeedback && exercise.answer === option
                      ? 'animate-pulse bg-green-100 border-green-300'
                      : ''
                    }
                  `}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        );
      }}
    />
  );
}