import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'matma.db'));

export interface Exercise {
  id: string;
  section_id: string;
  division_roman: string;
  chapter_number: number;
  section_number: number;
  exercise_number: number;
  full_id: string;
  order_index: number;
  input_type: string;
  question: string | null;
  story: string | null;
  correct_answer: string;
  hint: string | null;
  explanation: string | null;
  layout_type: string | null;
  options?: any[];
  visualConfig?: any;
}

export interface ExerciseOption {
  id: number;
  exercise_id: string;
  option_text: string;
  option_value?: string;
  order_index: number;
}

export interface VisualConfig {
  exercise_id: string;
  config_type: string;
  config_json: string;
}

export function getExercisesBySection(sectionId: string, specificExerciseId?: string | null) {
  // Check if section has variants (exercise_base_id is not null)
  const hasVariants = db.prepare(`
    SELECT COUNT(*) as count
    FROM exercises 
    WHERE section_id = ? AND exercise_base_id IS NOT NULL
  `).get(sectionId) as { count: number };

  let exercises: Exercise[] = [];

  if (hasVariants.count > 0) {
    // Use variant system for sections that have it
    const baseExercises = db.prepare(`
      SELECT DISTINCT exercise_base_id, MIN(order_index) as min_order
      FROM exercises
      WHERE section_id = ? AND exercise_base_id IS NOT NULL
      GROUP BY exercise_base_id
      ORDER BY min_order
    `).all(sectionId) as { exercise_base_id: string; min_order: number }[];

    // For each base exercise, select appropriate variant
    for (const base of baseExercises) {
      let variant: Exercise | undefined;
      
      // If a specific exercise ID is requested, try to use its variant
      if (specificExerciseId && specificExerciseId.startsWith(base.exercise_base_id)) {
        // Extract variant letter from specific ID
        const requestedVariant = specificExerciseId.match(/-([a-z])$/)?.[1];
        if (requestedVariant) {
          variant = db.prepare(`
            SELECT 
              e.*,
              e.layout_type,
              it.type_name as input_type
            FROM exercises e
            JOIN input_types it ON e.input_type_id = it.id
            WHERE e.exercise_base_id = ? AND e.variant_letter = ?
          `).get(base.exercise_base_id, requestedVariant) as Exercise | undefined;
        }
      }
      
      // Fallback to first variant if specific not found
      if (!variant) {
        variant = db.prepare(`
          SELECT 
            e.*,
            e.layout_type,
            it.type_name as input_type
          FROM exercises e
          JOIN input_types it ON e.input_type_id = it.id
          WHERE e.exercise_base_id = ?
          ORDER BY e.variant_letter
          LIMIT 1
        `).get(base.exercise_base_id) as Exercise;
      }
      
      if (variant) {
        exercises.push(variant);
      }
    }
  } else {
    // Fallback to old system for sections without variants
    exercises = db.prepare(`
      SELECT 
        e.*,
        e.layout_type,
        it.type_name as input_type
      FROM exercises e
      JOIN input_types it ON e.input_type_id = it.id
      WHERE e.section_id = ?
      ORDER BY e.order_index
    `).all(sectionId) as Exercise[];
  }
  
  // Get options for each exercise
  for (const exercise of exercises) {
    if (exercise.input_type === 'choices') {
      const options = db.prepare(`
        SELECT option_text, option_value, order_index
        FROM exercise_options
        WHERE exercise_id = ?
        ORDER BY order_index
      `).all(exercise.id) as ExerciseOption[];
      
      exercise.options = options;
    }
    
    // Get visual config if it's number-line from section_components
    if (exercise.input_type === 'number-line') {
      const config = db.prepare(`
        SELECT processing_config
        FROM section_components
        WHERE section_id = ?
      `).get(exercise.section_id) as { processing_config: string } | undefined;
      
      if (config) {
        try {
          const parsedConfig = JSON.parse(config.processing_config);
          exercise.visualConfig = parsedConfig.numberLineConfig || { enableAllClicks: true };
        } catch (error) {
          // Default config if parsing fails
          exercise.visualConfig = { enableAllClicks: true };
        }
      } else {
        // Default config if no section config exists
        exercise.visualConfig = { enableAllClicks: true };
      }
    }
  }
  
  return exercises;
}

export function getSectionInfo(sectionId: string) {
  const section = db.prepare(`
    SELECT title, description 
    FROM sections 
    WHERE id = ?
  `).get(sectionId) as { title: string; description: string } | undefined;
  
  return section;
}

export function getSectionHints(sectionId: string) {
  const hints = db.prepare(`
    SELECT hint_text
    FROM section_hints
    WHERE section_id = ?
    ORDER BY order_index
  `).all(sectionId) as { hint_text: string }[];
  
  return hints.map(h => h.hint_text);
}

export function getExerciseVariants(exerciseBaseId: string): string[] {
  const variants = db.prepare(`
    SELECT DISTINCT variant_letter
    FROM exercises
    WHERE exercise_base_id = ?
    ORDER BY variant_letter
  `).all(exerciseBaseId) as { variant_letter: string }[];
  
  return variants.map(v => v.variant_letter);
}