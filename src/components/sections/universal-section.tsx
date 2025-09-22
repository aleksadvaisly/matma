'use client';

import { useState, useEffect } from 'react';
import { ExerciseCard, type Exercise } from '@/components/exercise/exercise-card';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SectionConfig {
  component_type: string;
  processing_config: {
    answerType?: 'integer' | 'text' | 'choice';
    validation?: 'strict' | 'flexible';
  };
  ui_config: {
    showHints?: boolean;
    showProgress?: boolean;
    allowNavigation?: boolean;
    showTimer?: boolean;
  };
}

interface SectionData {
  exercises: any[];
  hints: string[];
  title: string;
  description: string;
}

interface UniversalSectionProps {
  sectionId: string;
}

export function UniversalSection({ sectionId }: UniversalSectionProps) {
  const [config, setConfig] = useState<SectionConfig | null>(null);
  const [sectionData, setSectionData] = useState<SectionData | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSection() {
      try {
        // Fetch section configuration and exercises in parallel
        const [configRes, exercisesRes] = await Promise.all([
          fetch(`/api/sections/${sectionId}/config`),
          fetch(`/api/exercises/${sectionId}`)
        ]);

        if (!configRes.ok || !exercisesRes.ok) {
          throw new Error('Failed to fetch section data');
        }

        const configData = await configRes.json();
        const exercisesData = await exercisesRes.json();

        setConfig(configData);
        setSectionData(exercisesData);

        // Process exercises based on configuration
        const processedExercises = exercisesData.exercises.map((ex: any) => {
          let processedAnswer = ex.answer;
          
          // Apply answer type processing
          if (configData.processing_config?.answerType === 'integer') {
            processedAnswer = parseInt(ex.answer, 10);
          }

          return {
            ...ex,
            answer: processedAnswer
          };
        });

        setExercises(processedExercises);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadSection();
  }, [sectionId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !sectionData || !config) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error || 'Failed to load section'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ExerciseCard
      title={sectionData.title}
      description={sectionData.description}
      sectionId={sectionId}
      exercises={exercises}
      hints={config.ui_config?.showHints ? sectionData.hints : []}
    />
  );
}