'use client';

import { ExerciseCard, type Exercise } from '@/components/exercise/exercise-card';

const exercises: Exercise[] = [
  {
    id: '1-1-1',
    question: 'Która liczba znajduje się 3 jednostki na prawo od zera?',
    answer: 3,
    inputType: 'number-line',
    numberLineConfig: {
      min: -2,
      max: 7,
      enableAllClicks: true
    }
  },
  {
    id: '1-1-2',
    question: 'Która liczba znajduje się 5 jednostek na lewo od zera?',
    answer: -5,
    inputType: 'number-line',
    numberLineConfig: {
      min: -7,
      max: 2,
      enableAllClicks: true
    }
  },
  {
    id: '1-1-3',
    question: 'Wskaż liczbę -3 na osi liczbowej.',
    answer: -3,
    inputType: 'number-line',
    numberLineConfig: {
      min: -5,
      max: 5,
      enableAllClicks: true
    }
  },
  {
    id: '1-1-4',
    question: 'Która liczba jest większa: -2 czy -7?',
    answer: -2,
    inputType: 'number-line',
    numberLineConfig: {
      min: -9,
      max: 2,
      enableAllClicks: true
    }
  },
  {
    id: '1-1-5',
    question: 'Znajdź liczbę, która znajduje się dokładnie pomiędzy -4 i 2.',
    answer: -1,
    inputType: 'number-line',
    numberLineConfig: {
      min: -5,
      max: 3,
      enableAllClicks: true
    }
  },
  {
    id: '1-1-6',
    question: 'Wskaż liczbę 5 na osi liczbowej.',
    answer: 5,
    inputType: 'number-line',
    numberLineConfig: {
      min: -2,
      max: 7,
      enableAllClicks: true
    }
  },
  {
    id: '1-1-7',
    question: 'Która liczba znajduje się 8 jednostek na prawo od -3?',
    answer: 5,
    inputType: 'number-line',
    numberLineConfig: {
      min: -5,
      max: 7,
      enableAllClicks: true
    }
  }
];

const hints = [
  'Oś liczbowa to linia, na której liczby są uporządkowane od najmniejszej do największej',
  'Liczby ujemne znajdują się po lewej stronie zera',
  'Liczby dodatnie znajdują się po prawej stronie zera',
  'Im dalej na prawo, tym liczba jest większa',
  'Zero jest większe od wszystkich liczb ujemnych i mniejsze od wszystkich dodatnich'
];

export function NumberLineSection() {
  return (
    <ExerciseCard
      title="1.1 Liczby na osi liczbowej"
      description="Naucz się umieszczać liczby całkowite na osi liczbowej"
      sectionId="1-1"
      exercises={exercises}
      hints={hints}
    />
  );
}