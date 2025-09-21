'use client';

import { ExerciseCard, type Exercise } from '@/components/exercise/exercise-card';

const exercises: Exercise[] = [
  {
    id: '2-3-1',
    story: 'Temperatura o godzinie 6:00 wynosiła -3°C. Do południa wzrosła o 8°C.',
    question: 'Jaka była temperatura w południe?',
    options: ['5°C', '11°C', '-11°C'],
    answer: '5°C',
    hint: 'Wzrost temperatury oznacza dodawanie: -3 + 8',
    inputType: 'choices'
  },
  {
    id: '2-3-2',
    story: 'Nurek znajduje się 12 metrów pod powierzchnią wody. Wynurza się o 7 metrów.',
    question: 'Na jakiej głębokości znajduje się teraz?',
    options: ['-5m', '-19m', '5m'],
    answer: '-5m',
    hint: 'Pod wodą to liczby ujemne: -12 + 7',
    inputType: 'choices'
  },
  {
    id: '2-3-3',
    story: 'Na koncie bankowym masz -50 zł (debet). Wpłacasz 120 zł.',
    question: 'Ile masz teraz na koncie?',
    options: ['70 zł', '170 zł', '-170 zł'],
    answer: '70 zł',
    hint: 'Debet to liczba ujemna: -50 + 120',
    inputType: 'choices'
  },
  {
    id: '2-3-4',
    story: 'W grze zdobyłeś 15 punktów, potem straciłeś 9 punktów.',
    question: 'Ile masz punktów łącznie?',
    options: ['6', '24', '-6'],
    answer: '6',
    hint: 'Strata to odejmowanie: 15 + (-9)',
    inputType: 'choices'
  },
  {
    id: '2-3-5',
    story: 'Winda jest na 3 piętrze. Jedzie 5 pięter w dół.',
    question: 'Na którym piętrze jest teraz winda?',
    options: ['-2', '8', '2'],
    answer: '-2',
    hint: 'Piętra pod ziemią to liczby ujemne: 3 + (-5)',
    inputType: 'choices'
  }
];

const hints = [
  'Wzrost, zysk, w górę = dodawanie liczby dodatniej',
  'Spadek, strata, w dół = dodawanie liczby ujemnej',
  'Pod ziemią/wodą = liczby ujemne',
  'Nad ziemią/wodą = liczby dodatnie'
];

export function AdditionWordProblemsSection() {
  return (
    <ExerciseCard
      title="2.3 Zadania z treścią"
      description="Zastosuj dodawanie liczb całkowitych w praktycznych sytuacjach"
      sectionId="2-3"
      exercises={exercises}
      hints={hints}
    />
  );
}