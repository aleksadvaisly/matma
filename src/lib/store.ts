import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Exercise {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  userAnswer?: string | number;
  completed: boolean;
  attempts: number;
  timeSpent: number;
}

export interface SectionProgress {
  sectionId: string;
  exercises: Exercise[];
  completed: boolean;
  score: number;
  totalExercises: number;
  completedExercises: number;
  timeSpent: number;
  startedAt?: Date;
  completedAt?: Date;
}

export interface ExerciseState {
  // Progress tracking
  sectionProgress: Record<string, SectionProgress>;
  currentExercise: Exercise | null;
  
  // Actions
  initializeSection: (sectionId: string, exercises: Exercise[]) => void;
  setCurrentExercise: (exercise: Exercise) => void;
  submitAnswer: (exerciseId: string, answer: string | number) => void;
  completeExercise: (exerciseId: string) => void;
  completeSection: (sectionId: string) => void;
  resetSection: (sectionId: string) => void;
  updateTimeSpent: (exerciseId: string, timeSpent: number) => void;
  updateSectionProgress: (sectionId: string, progress: { completed: number; total: number }) => void;
  
  // Getters
  getSectionProgress: (sectionId: string) => SectionProgress | undefined;
  getExercise: (exerciseId: string, sectionId: string) => Exercise | undefined;
  isExerciseCompleted: (exerciseId: string, sectionId: string) => boolean;
  getSectionScore: (sectionId: string) => number;
  getTotalProgress: () => number;
}

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set, get) => ({
      sectionProgress: {},
      currentExercise: null,

      initializeSection: (sectionId: string, exercises: Exercise[]) => {
        set((state) => {
          if (state.sectionProgress[sectionId]) {
            return state; // Section already initialized
          }
          
          return {
            ...state,
            sectionProgress: {
              ...state.sectionProgress,
              [sectionId]: {
                sectionId,
                exercises,
                completed: false,
                score: 0,
                totalExercises: exercises.length,
                completedExercises: 0,
                timeSpent: 0,
                startedAt: new Date(),
              },
            },
          };
        });
      },

      setCurrentExercise: (exercise: Exercise) => {
        set({ currentExercise: exercise });
      },

      submitAnswer: (exerciseId: string, answer: string | number) => {
        set((state) => {
          const newSectionProgress = { ...state.sectionProgress };
          
          for (const sectionId in newSectionProgress) {
            const section = newSectionProgress[sectionId];
            const exerciseIndex = section.exercises.findIndex(ex => ex.id === exerciseId);
            
            if (exerciseIndex !== -1) {
              const exercise = { ...section.exercises[exerciseIndex] };
              exercise.userAnswer = answer;
              exercise.attempts += 1;
              
              // Update exercise in section
              const updatedExercises = [...section.exercises];
              updatedExercises[exerciseIndex] = exercise;
              
              newSectionProgress[sectionId] = {
                ...section,
                exercises: updatedExercises,
              };
              break;
            }
          }
          
          return {
            ...state,
            sectionProgress: newSectionProgress,
          };
        });
      },

      completeExercise: (exerciseId: string) => {
        set((state) => {
          const newSectionProgress = { ...state.sectionProgress };
          
          for (const sectionId in newSectionProgress) {
            const section = newSectionProgress[sectionId];
            const exerciseIndex = section.exercises.findIndex(ex => ex.id === exerciseId);
            
            if (exerciseIndex !== -1) {
              const exercise = { ...section.exercises[exerciseIndex] };
              exercise.completed = true;
              
              // Update exercise in section
              const updatedExercises = [...section.exercises];
              updatedExercises[exerciseIndex] = exercise;
              
              // Update section progress
              const completedCount = updatedExercises.filter(ex => ex.completed).length;
              const correctCount = updatedExercises.filter(ex => 
                ex.completed && String(ex.userAnswer) === String(ex.correctAnswer)
              ).length;
              
              newSectionProgress[sectionId] = {
                ...section,
                exercises: updatedExercises,
                completedExercises: completedCount,
                score: Math.round((correctCount / section.totalExercises) * 100),
              };
              break;
            }
          }
          
          return {
            ...state,
            sectionProgress: newSectionProgress,
          };
        });
      },

      completeSection: (sectionId: string) => {
        set((state) => ({
          ...state,
          sectionProgress: {
            ...state.sectionProgress,
            [sectionId]: {
              ...state.sectionProgress[sectionId],
              completed: true,
              completedAt: new Date(),
            },
          },
        }));
      },

      resetSection: (sectionId: string) => {
        set((state) => {
          const section = state.sectionProgress[sectionId];
          if (!section) return state;
          
          const resetExercises = section.exercises.map(exercise => ({
            ...exercise,
            userAnswer: undefined,
            completed: false,
            attempts: 0,
            timeSpent: 0,
          }));
          
          return {
            ...state,
            sectionProgress: {
              ...state.sectionProgress,
              [sectionId]: {
                ...section,
                exercises: resetExercises,
                completed: false,
                score: 0,
                completedExercises: 0,
                timeSpent: 0,
                startedAt: new Date(),
                completedAt: undefined,
              },
            },
          };
        });
      },

      updateTimeSpent: (exerciseId: string, timeSpent: number) => {
        set((state) => {
          const newSectionProgress = { ...state.sectionProgress };
          
          for (const sectionId in newSectionProgress) {
            const section = newSectionProgress[sectionId];
            const exerciseIndex = section.exercises.findIndex(ex => ex.id === exerciseId);
            
            if (exerciseIndex !== -1) {
              const exercise = { ...section.exercises[exerciseIndex] };
              exercise.timeSpent = timeSpent;
              
              // Update exercise in section
              const updatedExercises = [...section.exercises];
              updatedExercises[exerciseIndex] = exercise;
              
              // Update total section time
              const totalTime = updatedExercises.reduce((sum, ex) => sum + ex.timeSpent, 0);
              
              newSectionProgress[sectionId] = {
                ...section,
                exercises: updatedExercises,
                timeSpent: totalTime,
              };
              break;
            }
          }
          
          return {
            ...state,
            sectionProgress: newSectionProgress,
          };
        });
      },

      updateSectionProgress: (sectionId: string, progress: { completed: number; total: number }) => {
        set((state) => ({
          ...state,
          sectionProgress: {
            ...state.sectionProgress,
            [sectionId]: {
              ...state.sectionProgress[sectionId],
              completedExercises: progress.completed,
              totalExercises: progress.total,
            },
          },
        }));
      },

      getSectionProgress: (sectionId: string) => {
        return get().sectionProgress[sectionId];
      },

      getExercise: (exerciseId: string, sectionId: string) => {
        const section = get().sectionProgress[sectionId];
        return section?.exercises.find(ex => ex.id === exerciseId);
      },

      isExerciseCompleted: (exerciseId: string, sectionId: string) => {
        const exercise = get().getExercise(exerciseId, sectionId);
        return exercise?.completed || false;
      },

      getSectionScore: (sectionId: string) => {
        const section = get().sectionProgress[sectionId];
        return section?.score || 0;
      },

      getTotalProgress: () => {
        const sections = Object.values(get().sectionProgress);
        if (sections.length === 0) return 0;
        
        const totalCompleted = sections.filter(s => s.completed).length;
        return Math.round((totalCompleted / sections.length) * 100);
      },
    }),
    {
      name: 'exercise-storage',
    }
  )
);
