import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useNavigationStore } from './navigation-store';

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
  saveProgressToDatabase: (sectionId: string, exerciseId?: string) => Promise<void>;
  loadProgressFromDatabase: (sectionId: string) => Promise<void>;
  
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
        const existingSection = get().sectionProgress[sectionId];
        
        // If section exists and has exercises, don't reinitialize
        if (existingSection && existingSection.exercises && existingSection.exercises.length > 0) {
          // Just load latest progress from database
          get().loadProgressFromDatabase(sectionId).catch(console.error);
          return;
        }
        
        // Initialize new section
        set((state) => ({
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
        }));
        
        // Load progress from database to override initial state
        get().loadProgressFromDatabase(sectionId).catch(console.error);
      },

      setCurrentExercise: (exercise: Exercise) => {
        set({ currentExercise: exercise });
      },

      submitAnswer: (exerciseId: string, answer: string | number) => {
        set((state) => {
          const newSectionProgress = { ...state.sectionProgress };
          
          for (const sectionId in newSectionProgress) {
            const section = newSectionProgress[sectionId];
            if (!section.exercises) continue;
            
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
        console.log(`Exercise completed: ${exerciseId}`);
        
        // Update the exercise as completed in local store
        set((state) => {
          const newSectionProgress = { ...state.sectionProgress };
          
          for (const sectionId in newSectionProgress) {
            const section = newSectionProgress[sectionId];
            if (!section.exercises) continue;
            
            const exerciseIndex = section.exercises.findIndex(ex => ex.id === exerciseId);
            
            if (exerciseIndex !== -1) {
              const exercise = { ...section.exercises[exerciseIndex] };
              exercise.completed = true;
              exercise.userAnswer = exercise.correctAnswer;
              
              // Update exercise in section
              const updatedExercises = [...section.exercises];
              updatedExercises[exerciseIndex] = exercise;
              
              // Update completed count
              const completedCount = updatedExercises.filter(ex => ex.completed).length;
              
              newSectionProgress[sectionId] = {
                ...section,
                exercises: updatedExercises,
                completedExercises: completedCount,
              };
              
              // Save to database asynchronously
              get().saveProgressToDatabase(sectionId, exerciseId).catch(console.error);
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
          if (!section || !section.exercises) return state;
          
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
            if (!section.exercises) continue;
            
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
        
        // Save progress to database when section progress is updated
        const state = get();
        state.saveProgressToDatabase(sectionId).catch(console.error);
      },

      getSectionProgress: (sectionId: string) => {
        return get().sectionProgress[sectionId];
      },

      getExercise: (exerciseId: string, sectionId: string) => {
        const section = get().sectionProgress[sectionId];
        return section?.exercises?.find(ex => ex.id === exerciseId);
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

      saveProgressToDatabase: async (sectionId: string, lastExerciseId?: string) => {
        try {
          const state = get();
          const section = state.sectionProgress[sectionId];
          if (!section) return;

          const userId = typeof window !== 'undefined' 
            ? localStorage.getItem('userId') || 'default-user'
            : 'default-user';

          const response = await fetch('/api/progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              sectionId,
              exercisesCompleted: section.completedExercises,
              totalExercises: section.totalExercises,
              lastExerciseId
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to save progress');
          }

          console.log(`Progress saved for section ${sectionId}`);
          
          // Trigger sidebar refresh
          if (typeof window !== 'undefined') {
            useNavigationStore.getState().refreshNavigation();
          }
        } catch (error) {
          console.error('Error saving progress to database:', error);
        }
      },

      loadProgressFromDatabase: async (sectionId: string) => {
        try {
          const userId = typeof window !== 'undefined' 
            ? localStorage.getItem('userId') || 'default-user'
            : 'default-user';

          const response = await fetch(`/api/progress?userId=${userId}`);
          if (!response.ok) {
            throw new Error('Failed to load progress');
          }

          const data = await response.json();
          const sectionProgress = data.progress.find((p: any) => p.section_id === sectionId);
          
          if (sectionProgress) {
            set((state) => {
              const currentSection = state.sectionProgress[sectionId];
              if (!currentSection) return state; // Section not initialized yet
              
              // Mark first N exercises as completed based on database progress
              const updatedExercises = currentSection.exercises.map((exercise, index) => ({
                ...exercise,
                completed: index < sectionProgress.exercises_completed,
                userAnswer: index < sectionProgress.exercises_completed ? exercise.correctAnswer : exercise.userAnswer,
              }));
              
              return {
                ...state,
                sectionProgress: {
                  ...state.sectionProgress,
                  [sectionId]: {
                    ...currentSection,
                    exercises: updatedExercises,
                    completedExercises: sectionProgress.exercises_completed,
                    totalExercises: sectionProgress.total_exercises,
                    completed: !!sectionProgress.completed_at,
                    score: Math.round((sectionProgress.exercises_completed / sectionProgress.total_exercises) * 100),
                  },
                },
              };
            });

            console.log(`Progress loaded for section ${sectionId}: ${sectionProgress.exercises_completed}/${sectionProgress.total_exercises}`);
            
            // Trigger sidebar refresh to show updated progress
            if (typeof window !== 'undefined') {
              useNavigationStore.getState().refreshNavigation();
            }
          }
        } catch (error) {
          console.error('Error loading progress from database:', error);
        }
      },
    }),
    {
      name: 'exercise-storage',
    }
  )
);
