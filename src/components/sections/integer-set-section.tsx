'use client';

import { ExerciseCard, type Exercise } from '@/components/exercise/exercise-card';
import { ChoiceButton } from '@/components/ui/choice-button';

const exercises: Exercise[] = [
  {
    id: '1-5-1',
    question: 'Wskaż symbol oznaczający zbiór wszystkich liczb całkowitych.',
    options: ['Z', 'N', 'Q'],
    answer: 'Z',
    explanation: 'Litera Z (z niemieckiego Zahlen) opisuje całą rodzinę liczb całkowitych.',
    inputType: 'choices'
  },
  {
    id: '1-5-2',
    question: 'Który zestaw zawiera wyłącznie liczby należące do zbioru Z?',
    options: ['-4, 0, 7', '-1/2, 0, 5/2', 'π, 1, -3/2'],
    answer: '-4, 0, 7',
    explanation: 'Liczby całkowite to wartości bez części ułamkowej: ..., -2, -1, 0, 1, 2, ...',
    inputType: 'choices'
  },
  {
    id: '1-5-3',
    question: 'Jak nazywamy część zbioru Z złożoną z liczb większych od zera?',
    options: ['Z+', 'Z-', 'N-'],
    answer: 'Z+',
    explanation: 'Z+ oznacza liczby całkowite dodatnie: 1, 2, 3, ...',
    inputType: 'choices'
  },
  {
    id: '1-5-4',
    question: 'Która para tworzy liczby przeciwne należące do Z?',
    options: ['-6 i 6', '2 i 5', '-4 i -4'],
    answer: '-6 i 6',
    explanation: 'Liczby przeciwne to pary liczb, których suma daje zero.',
    inputType: 'choices'
  },
  {
    id: '1-5-5',
    question: 'W którym przedziale znajdują się liczby całkowite 1, 2, 3, ... , 9?',
    options: ['(0, 10)', '[1, 9]', '(0, 9]'],
    answer: '[1, 9]',
    explanation: 'Nawias kwadratowy [ ] oznacza, że liczba brzegowa należy do przedziału.',
    inputType: 'choices'
  },
  {
    id: '1-5-6',
    question: 'Jakie liczby całkowite są większe od -3 i mniejsze od 2?',
    options: ['-2, -1, 0, 1', '-3, -2, -1, 0, 1, 2', '-2, -1, 0'],
    answer: '-2, -1, 0, 1',
    explanation: 'Szukamy liczb całkowitych spełniających: -3 < x < 2, czyli x ∈ {-2, -1, 0, 1}.',
    inputType: 'choices'
  },
  {
    id: '1-5-7',
    question: 'Czym różni się zbiór N od zbioru Z+?',
    options: [
      'N zawiera zero, Z+ nie',
      'Z+ zawiera zero, N nie',
      'Nie ma różnicy'
    ],
    answer: 'N zawiera zero, Z+ nie',
    explanation: 'N = {0, 1, 2, 3, ...}, natomiast Z+ = {1, 2, 3, ...} (bez zera).',
    inputType: 'choices'
  }
];

const hints = [
  'Z - zbiór liczb całkowitych (..., -2, -1, 0, 1, 2, ...)',
  'N - zbiór liczb naturalnych (0, 1, 2, 3, ...)',
  'Z+ - liczby całkowite dodatnie (1, 2, 3, ...)',
  'Z- - liczby całkowite ujemne (-1, -2, -3, ...)',
  'Liczby przeciwne: a + (-a) = 0'
];

export function IntegerSetSection() {
  return (
    <ExerciseCard
      title="1.5 Zbiór liczb całkowitych"
      description="Poznaj oznaczenia i własności zbioru liczb całkowitych"
      sectionId="1-5"
      exercises={exercises}
      hints={hints}
    />
  );
}