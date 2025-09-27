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
  exerciseId?: string;
}

export function UniversalSection({ sectionId, exerciseId }: UniversalSectionProps) {
  const [config, setConfig] = useState<SectionConfig | null>(null);
  const [sectionData, setSectionData] = useState<SectionData | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSection() {
      try {
        // Build exercises URL with optional exerciseId parameter
        const exercisesUrl = exerciseId 
          ? `/api/exercises/${sectionId}?exerciseId=${exerciseId}`
          : `/api/exercises/${sectionId}`;
        
        // Fetch section configuration and exercises in parallel
        const [configRes, exercisesRes] = await Promise.all([
          fetch(`/api/sections/${sectionId}/config`),
          fetch(exercisesUrl)
        ]);

        if (!configRes.ok || !exercisesRes.ok) {
          throw new Error('Failed to fetch section data');
        }

        const configData = await configRes.json();
        const exercisesData = await exercisesRes.json();

        setConfig(configData);
        setSectionData(exercisesData);

        // Function to determine layout for exercises
        const determineLayout = (exercise: any): 'horizontal' | 'vertical' => {
          // 1. Explicit database value has priority
          if (exercise.layout_type) {
            return exercise.layout_type;
          }
          
          // 2. Fallback: auto-detection for choices
          if (exercise.inputType === 'choices' && exercise.options) {
            const optionTexts = exercise.options.map((opt: any) => 
              typeof opt === 'string' ? opt : opt.text || opt.value
            );
            const maxLength = Math.max(...optionTexts.map((text: string) => text.length));
            return maxLength <= 6 ? 'horizontal' : 'vertical';
          }
          
          // 3. Default: vertical
          return 'vertical';
        };

        // Process exercises based on configuration
        const processedExercises = exercisesData.exercises.map((ex: any) => {
          // Keep answers as strings - the Fraction comparison logic handles conversion
          // Don't apply blanket integer parsing as it breaks fraction answers like "7/3"
          return {
            ...ex,
            answer: ex.answer, // Keep original answer string
            layout: determineLayout(ex)
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
  }, [sectionId, exerciseId]);

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
      initialExerciseId={exerciseId}
    />
  );
}