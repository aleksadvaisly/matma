'use client';

import { useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
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

// Navigation mapping between sections
const SECTION_NAVIGATION: Record<string, string> = {
  '1-1': '1-2',
  '1-2': '1-3',
  '1-3': '1-4',
  '1-4': '1-5',
  '1-5': '2-1',
  '2-1': '2-2',
  '2-2': '2-3',
  '2-3': '3-1',
  '3-1': '3-2',
  '3-2': '3-3',
  '3-3': '3-4',
  '3-4': '4-1',
  '4-1': '4-2',
  '4-2': '4-3',
  '4-3': '5-1',
  '5-1': '5-2',
  '5-2': '5-3',
  '5-3': '5-4',
  '5-4': '6-1',
  '6-1': '6-2',
  '6-2': '6-3',
  '6-3': '6-4',
  '6-4': '6-5',
  '6-5': null // Last section
};

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
  
  const pathname = usePathname();
  const { updateSectionProgress, completeExercise, initializeSection, getSectionProgress } = useExerciseStore();

  const TOTAL_EXERCISES = exercises.length;
  const currentExercise = exercises[currentIndex];
  const displayedProgress = currentIndex + 1;
  
  // Calculate next section URL
  const getNextSectionUrl = () => {
    const currentSectionId = pathname?.split('/').pop();
    if (!currentSectionId) return undefined;
    
    const nextSectionId = SECTION_NAVIGATION[currentSectionId];
    if (!nextSectionId) return undefined;
    
    // Extract chapter from next section ID (e.g., '2-1' -> 'chapter-2')
    const chapterId = `chapter-${nextSectionId.split('-')[0]}`;
    return `/dashboard/chapters/${chapterId}/sections/${nextSectionId}`;
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
  
  // Removed auto-showing completed state - users can re-solve exercises when revisiting

  useEffect(() => {
    // Don't update progress during initialization to avoid race condition
    if (!isInitializing) {
      updateSectionProgress(sectionId, {
        completed: currentIndex + (showFeedback && isCorrect ? 1 : 0),
        total: TOTAL_EXERCISES
      });
    }
  }, [currentIndex, showFeedback, isCorrect, TOTAL_EXERCISES, updateSectionProgress, sectionId]); // Remove isInitializing from deps to fix warning

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

  const renderContent = () => {
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
          <div className="text-base text-muted-foreground mb-4">
            {currentExercise.story}
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
          onReset={resetExercises}
        />

        {hints.length > 0 && (
          <InfoBox title="Wskazówki" items={hints} />
        )}
      </CardContent>
    </Card>
  );
}