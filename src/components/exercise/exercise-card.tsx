'use client';

import { useState, useEffect, ReactNode, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ExerciseHeader } from './exercise-header';
import { UniversalAnswerInput } from './universal-answer-input';
import { FeedbackSystem } from './feedback-system';
import { InfoBox } from '@/components/ui/info-box';
import { ExpressionLine } from '@/components/ui/expression-line';
import { useExerciseStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import { Fraction } from '@/lib/fraction';

export interface Exercise {
  id: string;
  question?: string;
  story?: string;
  terms?: number[];
  answer: string | number;
  options?: string[];
  hint?: string;
  explanation?: string;
  variant_letter?: string;
  inputType?: 'text' | 'choices' | 'number-line' | 'choice-grid' | 'sequence-builder';
  numberLineConfig?: {
    min: number;
    max: number;
    markedNumbers?: Array<{ value: number; color: string }>;
    enableAllClicks?: boolean;
    // NEW fraction support
    resolution?: string; // e.g., "1/2", "1/4" - defines clickable granularity
    captionOnEvery?: number; // e.g., 1 - show labels every N units
    // Legacy fraction support
    subdivision?: number; // 1 for integers, 2 for halves, 3 for thirds, etc.
    fractionDisplay?: boolean; // Whether to show fractions in Unicode format
    allowFractionalClick?: boolean; // Whether clicking on fractional positions is allowed
  };
  textConfig?: {
    supportsFractions?: boolean; // Whether text input should support fraction parsing
    placeholder?: string;
  };
  sequenceBuilderConfig?: {
    choices?: string[];
    separator?: string;
  };
}

interface ExerciseCardProps {
  title: string;
  description: string;
  sectionId: string;
  exercises: Exercise[];
  hints?: string[];
  initialExerciseId?: string;
  customContent?: (exercise: Exercise, props: {
    selectedAnswer: string | number | Fraction | null;
    setSelectedAnswer: (value: string | number | Fraction | null) => void;
    showHints: boolean;
    showFeedback: boolean;
    isCorrect: boolean;
  }) => ReactNode;
  onExerciseComplete?: (exercise: Exercise, isCorrect: boolean) => void;
}


export function ExerciseCard({
  title,
  description,
  sectionId,
  exercises,
  hints = [],
  initialExerciseId,
  customContent,
  onExerciseComplete
}: ExerciseCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Parse initial index from exerciseId (e.g., "1-1-3-b" -> index for exercise 3)
  const getInitialIndex = () => {
    if (!initialExerciseId) return 0;
    
    // Find exercise by exact ID match
    const index = exercises.findIndex(ex => ex.id === initialExerciseId);
    if (index !== -1) return index;
    
    // If not found, try to match by base ID (without variant)
    // For IDs like "1-1-3-a", extract "1-1-3" and find any variant
    const baseId = initialExerciseId.replace(/-[a-z]$/, '');
    const baseIndex = exercises.findIndex(ex => {
      const exBaseId = ex.id.replace(/-[a-z]$/, '');
      return exBaseId === baseId;
    });
    if (baseIndex !== -1) return baseIndex;
    
    // Last resort: try to extract exercise number from ID pattern
    // For "1-1-3-a" extract the 3rd number (exercise number)
    const parts = initialExerciseId.split('-');
    if (parts.length >= 3) {
      const exerciseNum = parseInt(parts[2]); // Get the 3rd part (exercise number)
      if (!isNaN(exerciseNum)) {
        // Find exercise with matching exercise_number
        const matchIndex = exercises.findIndex((ex, idx) => idx === exerciseNum - 1);
        if (matchIndex !== -1) return matchIndex;
      }
    }
    
    return 0;
  };
  
  const [currentIndex, setCurrentIndex] = useState(getInitialIndex());
  
  // Update index when URL changes
  useEffect(() => {
    const newIndex = getInitialIndex();
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      setSelectedAnswerState(null);
      setShowFeedback(false);
      setIsCorrect(false);
    }
  }, [initialExerciseId]);
  const [selectedAnswer, setSelectedAnswerState] = useState<string | number | Fraction | null>(null);
  
  const setSelectedAnswer = (value: string | number | Fraction | null) => {
    console.log('=== DEBUG: setSelectedAnswer called ===');
    console.log('New value:', value, '(type:', typeof value, ')');
    console.log('Current exercise ID:', currentExercise?.id);
    setSelectedAnswerState(value);
  };
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [nextSectionUrl, setNextSectionUrl] = useState<string | null>(null);
  
  const { updateSectionProgress, completeExercise, initializeSection, getSectionProgress } = useExerciseStore();

  const TOTAL_EXERCISES = exercises.length;
  const currentExercise = exercises[currentIndex];
  const displayedProgress = currentIndex + 1;
  
  // Get next section URL from database
  const getNextSectionUrl = () => {
    return nextSectionUrl || undefined;
  };

  // Initialize section with exercises when component mounts
  useEffect(() => {
    if (exercises.length > 0) {
      setIsInitializing(true);
      // Convert exercises to store format
      const storeExercises = exercises.map(ex => ({
        id: ex.id,
        question: ex.question || '',
        options: ex.options,
        correctAnswer: ex.answer,
        userAnswer: undefined,
        completed: false,
        attempts: 0,
        timeSpent: 0,
      }));
      
      // First initialize, then let loadProgressFromDatabase override with saved state
      initializeSection(sectionId, storeExercises);
      
      // Allow time for loadProgressFromDatabase to complete before enabling progress updates
      setTimeout(() => setIsInitializing(false), 500);
    }
  }, [sectionId, exercises.length, initializeSection]); // Only depend on length, not exercises array

  // Fetch next section URL from database
  useEffect(() => {
    const fetchNextSectionUrl = async () => {
      try {
        const response = await fetch(`/api/sections/${sectionId}/config`);
        if (response.ok) {
          const config = await response.json();
          setNextSectionUrl(config.next_section_url);
        }
      } catch (error) {
        console.error('Failed to fetch next section URL:', error);
      }
    };

    fetchNextSectionUrl();
  }, [sectionId]);
  
  // Removed auto-showing completed state - users can re-solve exercises when revisiting

  useEffect(() => {
    // Don't update progress during initialization to avoid race condition
    if (!isInitializing) {
      const sectionProgress = getSectionProgress(sectionId);
      const currentCompletedCount = sectionProgress?.completedExercises || 0;
      
      // Only update if we're completing a NEW exercise, not when just navigating
      if (showFeedback && isCorrect) {
        // We just completed an exercise - increment the count if it's a new completion
        const alreadyCompleted = sectionProgress?.exercises?.find(ex => ex.id === currentExercise.id)?.completed;
        if (!alreadyCompleted) {
          updateSectionProgress(sectionId, {
            completed: Math.max(currentCompletedCount, currentIndex + 1),
            total: TOTAL_EXERCISES
          });
        }
      }
      // Don't update progress when just navigating through already completed exercises
    }
  }, [currentIndex, showFeedback, isCorrect, TOTAL_EXERCISES, updateSectionProgress, sectionId, getSectionProgress, currentExercise]); // Remove isInitializing from deps to fix warning

  const checkAnswer = useCallback(() => {
    console.log('=== DEBUG: checkAnswer called ===');
    console.log('selectedAnswer:', selectedAnswer, '(type:', typeof selectedAnswer, ')');
    console.log('currentExercise.answer:', currentExercise.answer, '(type:', typeof currentExercise.answer, ')');
    console.log('currentExercise.id:', currentExercise.id);
    
    if (!selectedAnswer) {
      console.log('DEBUG: selectedAnswer is falsy, returning early');
      return;
    }

    let correct: boolean;
    
    // If selectedAnswer is a Fraction object from the number line
    if (selectedAnswer instanceof Fraction) {
      const answerFraction = Fraction.parse(String(currentExercise.answer));
      correct = answerFraction ? selectedAnswer.equals(answerFraction) : false;
      console.log('Fraction comparison:', selectedAnswer.toString(), 'vs', answerFraction?.toString(), '=', correct);
    } else {
      // For text input and other types, use string comparison with Fraction.areEquivalent
      const selectedStr = String(selectedAnswer).trim();
      const answerStr = String(currentExercise.answer).trim();
      console.log('selectedStr:', selectedStr);
      console.log('answerStr:', answerStr);
      correct = Fraction.areEquivalent(selectedStr, answerStr);
      console.log('Fraction.areEquivalent result:', correct);
    }
    
    // No fallback needed - Fraction.areEquivalent handles all cases
    
    console.log('FINAL correct result:', correct);
    
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      completeExercise(currentExercise.id);
    }
    
    onExerciseComplete?.(currentExercise, correct);
  }, [selectedAnswer, currentExercise, completeExercise, onExerciseComplete]);

  const navigateToExercise = (exerciseId: string) => {
    // Extract chapter from current path
    const pathParts = pathname.split('/');
    const chapterIndex = pathParts.findIndex(p => p === 'chapters');
    
    if (chapterIndex !== -1) {
      const chapterId = pathParts[chapterIndex + 1];
      const newPath = `/dashboard/chapters/${chapterId}/sections/${sectionId}/exercise/${exerciseId}`;
      router.push(newPath);
    }
  };

  const getRandomVariant = async (exerciseId: string): Promise<string> => {
    // Extract base ID
    const baseId = exerciseId.replace(/-[a-z]$/, '');
    
    try {
      // Check if this exercise has variants
      const response = await fetch(`/api/exercises/variants/${baseId}`);
      if (response.ok) {
        const { variants } = await response.json();
        if (variants && variants.length > 0) {
          // Return random variant
          const randomVariant = variants[Math.floor(Math.random() * variants.length)];
          return `${baseId}-${randomVariant}`;
        }
      }
    } catch (error) {
      console.error('Failed to fetch variants:', error);
    }
    
    // If no variants, return original ID
    return exerciseId;
  };

  const nextExercise = async () => {
    if (canGoNext()) {
      const nextEx = exercises[currentIndex + 1];
      if (nextEx) {
        const randomizedId = await getRandomVariant(nextEx.id);
        navigateToExercise(randomizedId);
      }
    }
  };

  const previousExercise = async () => {
    if (canGoPrevious()) {
      const prevEx = exercises[currentIndex - 1];
      if (prevEx) {
        const randomizedId = await getRandomVariant(prevEx.id);
        navigateToExercise(randomizedId);
      }
    }
  };

  const canGoNext = () => {
    // Can go to next exercise if:
    // 1. Not on the last exercise
    // 2. EITHER the current exercise was just completed (answered correctly)
    //    OR the current exercise is already completed from previous session (can skip)
    //    OR the next exercise is already completed from previous session
    if (currentIndex >= TOTAL_EXERCISES - 1) return false;
    
    const sectionProgress = getSectionProgress(sectionId);
    const currentExerciseId = exercises[currentIndex]?.id;
    const nextExerciseId = exercises[currentIndex + 1]?.id;
    
    // FAIL-FAST: Detect critical navigation errors
    if (!currentExerciseId) {
      console.error(`CRITICAL: Missing exercise ID at index ${currentIndex} in section ${sectionId}`);
      return false;
    }
    
    // Check completion by ID (primary) and by index (fallback) to handle sync issues
    const isCurrentExerciseCompleted = sectionProgress?.exercises?.find(ex => ex.id === currentExerciseId)?.completed 
      || currentIndex < (sectionProgress?.completedExercises || 0);
    const isNextExerciseCompleted = sectionProgress?.exercises?.find(ex => ex.id === nextExerciseId)?.completed 
      || (currentIndex + 1) < (sectionProgress?.completedExercises || 0);
    
    const canProgress = (showFeedback && isCorrect) || isCurrentExerciseCompleted || isNextExerciseCompleted;
    
    // LOG: Debug progress blocking for troubleshooting
    if (!canProgress && process.env.NODE_ENV === 'development') {
      console.log(`Progress blocked at exercise ${currentIndex + 1} (${currentExerciseId}):`, {
        showFeedback,
        isCorrect,
        isCurrentExerciseCompleted,
        isNextExerciseCompleted,
        currentIndex,
        totalExercises: TOTAL_EXERCISES
      });
    }
    
    return canProgress;
  };

  const canGoPrevious = () => {
    // Can go to previous exercise if:
    // 1. Not on the first exercise  
    // 2. The previous exercise is completed (from store)
    if (currentIndex <= 0) return false;
    
    const sectionProgress = getSectionProgress(sectionId);
    const prevExerciseId = exercises[currentIndex - 1]?.id;
    const isPrevExerciseCompleted = sectionProgress?.exercises?.find(ex => ex.id === prevExerciseId)?.completed 
      || (currentIndex - 1) < (sectionProgress?.completedExercises || 0);
    
    return isPrevExerciseCompleted;
  };

  const resetExercises = () => {
    setCurrentIndex(0);
    setSelectedAnswerState(null);
    setShowFeedback(false);
  };

  const refreshVariant = async () => {
    // Get a new random variant for current exercise
    const currentEx = exercises[currentIndex];
    if (!currentEx) return;
    
    const baseId = currentEx.id.replace(/-[a-z]$/, '');
    const currentVariant = currentEx.id.match(/-([a-z])$/)?.[1];
    
    try {
      // Fetch available variants from database
      const response = await fetch(`/api/exercises/variants/${baseId}`);
      if (response.ok) {
        const { variants } = await response.json();
        if (variants && variants.length > 1) {
          // Filter out current variant if it exists
          const availableVariants = currentVariant 
            ? variants.filter((v: string) => v !== currentVariant)
            : variants;
          
          if (availableVariants.length > 0) {
            const newVariant = availableVariants[Math.floor(Math.random() * availableVariants.length)];
            const newExerciseId = `${baseId}-${newVariant}`;
            navigateToExercise(newExerciseId);
            return;
          }
        }
      }
    } catch (error) {
      console.error('Failed to refresh variant:', error);
    }
    
    // If no variants available, just reload current
    navigateToExercise(currentEx.id);
  };

  const renderContent = () => {
    if (!currentExercise) {
      return null;
    }

    if (customContent) {
      return customContent(currentExercise, {
        selectedAnswer,
        setSelectedAnswer,
        showHints,
        showFeedback,
        isCorrect
      });
    }

    return (
      <>
        {currentExercise.story && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="text-base text-gray-700">
              {currentExercise.story}
            </div>
          </div>
        )}

        {currentExercise.question && (
          <div className="text-lg font-medium text-center">
            {currentExercise.variant_letter && (
              <span className="font-bold">{currentExercise.variant_letter}) </span>
            )}
            {currentExercise.question}
          </div>
        )}

        {currentExercise.terms && (
          <ExpressionLine terms={currentExercise.terms} />
        )}

        {showHints && currentExercise.hint && (
          <div className="rounded-md border border-dashed border-green-300 bg-green-50 p-4 text-sm text-green-700">
            {currentExercise.hint}
          </div>
        )}

        <UniversalAnswerInput
          type={currentExercise.inputType || 'choices'}
          value={selectedAnswer as string | number | null}
          onChange={setSelectedAnswer as (value: string | number) => void}
          disabled={showFeedback}
          showHints={showHints}
          correctAnswer={currentExercise.answer}
          showFeedback={showFeedback}
          isCorrect={isCorrect}
          options={currentExercise.options || []}
          {...(currentExercise.inputType === 'number-line' ? currentExercise.numberLineConfig || {} : {})}
          {...(currentExercise.inputType === 'text' ? currentExercise.textConfig || {} : {})}
          {...(currentExercise.inputType === 'sequence-builder' ? currentExercise.sequenceBuilderConfig || {} : {})}
        />
      </>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <ExerciseHeader
          title={title}
          description={description}
          current={displayedProgress}
          total={TOTAL_EXERCISES}
          showHints={showHints}
          onHintsToggle={setShowHints}
          onPrevious={previousExercise}
          onNext={nextExercise}
          canGoPrevious={canGoPrevious()}
          canGoNext={canGoNext()}
        />
      </CardHeader>
      <CardContent className="space-y-6">
        {renderContent()}

        <FeedbackSystem
          showFeedback={showFeedback}
          isCorrect={isCorrect}
          correctAnswer={currentExercise.answer}
          customMessage={
            showFeedback && currentExercise.explanation
              ? (isCorrect 
                  ? `Brawo! ${currentExercise.explanation}`
                  : `Jeszcze raz. ${currentExercise.explanation}`)
              : undefined
          }
          selectedAnswer={selectedAnswer}
          isLastExercise={currentIndex === TOTAL_EXERCISES - 1}
          nextSectionUrl={getNextSectionUrl()}
          onCheck={checkAnswer}
          onNext={nextExercise}
          onReset={refreshVariant}
        />

        {hints.length > 0 && (
          <InfoBox title="Wskazówki" items={hints} />
        )}
      </CardContent>
    </Card>
  );
}