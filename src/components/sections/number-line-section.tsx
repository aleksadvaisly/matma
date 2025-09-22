'use client';

import { useState, useEffect } from 'react';
import { ExerciseCard, type Exercise } from '@/components/exercise/exercise-card';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function NumberLineSection() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [hints, setHints] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExercises() {
      try {
        const response = await fetch('/api/exercises/1-1');
        if (!response.ok) {
          throw new Error('Failed to fetch exercises');
        }
        const data = await response.json();
        
        // Convert answers to numbers for number-line type
        const processedExercises = data.exercises.map((ex: any) => ({
          ...ex,
          answer: parseInt(ex.answer, 10)
        }));
        
        setExercises(processedExercises);
        setHints(data.hints || []);
        setTitle(data.title || '1.1 Liczby na osi liczbowej');
        setDescription(data.description || 'Naucz się umieszczać liczby całkowite na osi liczbowej');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-500">
        <AlertDescription>
          Błąd ładowania zadań: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (exercises.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          Brak zadań do wyświetlenia
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ExerciseCard
      title={title}
      description={description}
      sectionId="1-1"
      exercises={exercises}
      hints={hints}
    />
  );
}