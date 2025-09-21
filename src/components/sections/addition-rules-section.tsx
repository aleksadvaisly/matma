'use client';

import { ExerciseCard, type Exercise } from '@/components/exercise/exercise-card';

const exercises: Exercise[] = [
  {
    id: '2-1-1',
    terms: [-3, -5],
    options: ['-8', '-2', '2'],
    answer: '-8',
    explanation: 'Liczby mają ten sam znak, więc dodajemy moduły: 3 + 5 = 8 i zachowujemy znak minus.',
    hint: 'Przy tym samym znaku dodaj moduły i zachowaj znak liczb.',
    inputType: 'choices'
  },
  {
    id: '2-1-2',
    terms: [7, -4],
    options: ['11', '3', '-3'],
    answer: '3',
    explanation: 'Znaki są różne. Odejmij mniejszy moduł od większego: 7 - 4 = 3. Wynik ma znak liczby o większym module, czyli dodatni.',
    hint: 'Porównaj, która liczba jest dalej od zera.',
    inputType: 'choices'
  },
  {
    id: '2-1-3',
    terms: [-12, 9],
    options: ['-21', '-3', '21'],
    answer: '-3',
    explanation: 'Moduły różnią się o 3. Większy moduł ma liczba ujemna, więc wynik jest -3.',
    hint: '12 jest dalej od zera niż 9, dlatego wynik będzie ujemny.',
    inputType: 'choices'
  },
  {
    id: '2-1-4',
    terms: [15, 8],
    options: ['7', '23', '-23'],
    answer: '23',
    explanation: 'Dodajemy dwa dodatnie składniki: 15 + 8 = 23.',
    hint: 'Przy tym samym znaku po prostu dodaj wartości.',
    inputType: 'choices'
  },
  {
    id: '2-1-5',
    terms: [-6, -9],
    options: ['-15', '15', '-3'],
    answer: '-15',
    explanation: 'Suma liczb ujemnych to liczba ujemna. 6 + 9 = 15, więc wynik to -15.',
    hint: 'Dodaj moduły, znak pozostaje ujemny.',
    inputType: 'choices'
  },
  {
    id: '2-1-6',
    terms: [-4, 4],
    options: ['8', '0', '-8'],
    answer: '0',
    explanation: 'Liczby przeciwne sumują się do zera.',
    hint: 'Gdy liczby są przeciwne, znoszą się.',
    inputType: 'choices'
  }
];

const rules = [
  'Liczby o tym samym znaku dodajemy, zachowując ich znak',
  'Przy przeciwnych znakach odejmujemy moduły i bierzemy znak liczby o większym module',
  'Liczby przeciwne zawsze dają w sumie zero'
];

export function AdditionRulesSection() {
  return (
    <ExerciseCard
      title="2.1 Zasady dodawania"
      description="Utrwal zasady dodawania liczb całkowitych o różnych znakach"
      sectionId="2-1"
      exercises={exercises}
      hints={rules}
    />
  );
}