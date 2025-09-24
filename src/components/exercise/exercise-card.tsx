'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ExerciseHeader } from './exercise-header';
import { UniversalAnswerInput } from './universal-answer-input';
import { FeedbackSystem } from './feedback-system';
import { InfoBox } from '@/components/ui/info-box';
import { ExpressionLine } from '@/components/ui/expression-line';
import { useExerciseStore } from '@/lib/store';

export interface Exercise {
  id: string;
  question?: string;
  story?: string;
  terms?: number[];
  answer: string | number;
  options?: string[];
  hint?: string;
  explanation?: string;
  inputType?: 'text' | 'choices' | 'number-line' | 'choice-grid';
  numberLineConfig?: {
    min: number;
    max: number;
    markedNumbers?: Array<{ value: number; color: string }>;
    enableAllClicks?: boolean;
  };
}

interface ExerciseCardProps {
  title: string;
  description: string;
  sectionId: string;
  exercises: Exercise[];
  hints?: string[];
  customContent?: (exercise: Exercise, props: {
    selectedAnswer: string | number | null;
    setSelectedAnswer: (value: string | number | null) => void;
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
  customContent,
  onExerciseComplete
}: ExerciseCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
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

  const checkAnswer = () => {
    if (!selectedAnswer) return;

    const normalizedSelected = String(selectedAnswer).trim();
    const normalizedAnswer = String(currentExercise.answer).trim();
    const correct = normalizedSelected === normalizedAnswer;
    
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      completeExercise(currentExercise.id);
    }
    
    onExerciseComplete?.(currentExercise, correct);
  };

  const nextExercise = () => {
    if (canGoNext()) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      
      // Always reset state when navigating - allow re-solving
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(false);
    }
  };

  const previousExercise = () => {
    if (canGoPrevious()) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      
      // Always reset state when navigating - allow re-solving
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(false);
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
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const refreshVariant = () => {
    // Simply reload the page to get a new random variant from the API
    // This ensures the variant is properly fetched through the normal flow
    window.location.reload();
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
          value={selectedAnswer}
          onChange={setSelectedAnswer}
          disabled={showFeedback}
          showHints={showHints}
          correctAnswer={currentExercise.answer}
          showFeedback={showFeedback}
          isCorrect={isCorrect}
          options={currentExercise.options || []}
          layout={currentExercise.layout || 'vertical'}
          {...(currentExercise.numberLineConfig || {})}
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