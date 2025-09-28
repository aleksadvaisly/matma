import Database from 'better-sqlite3';
import path from 'path';
import { Fraction } from './fraction';

const db = new Database(path.join(process.cwd(), 'matma.db'));

// Enable WAL mode for better concurrency and immediate consistency
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('cache_size = 1000');
db.pragma('temp_store = memory');

// Export the database instance to share across the app
export { db };

/**
 * Parse exercise ID into sortable numeric components
 * Example: "7-1-2" → [7, 1, 2]
 * Example: "7-1-2-a" → [7, 1, 2, 'a']
 */
export function parseId(id: string): (number | string)[] {
  return id.split('-').map(part => {
    const num = parseInt(part);
    return isNaN(num) ? part : num;
  });
}

/**
 * Compare two IDs for sorting
 * Returns negative if a < b, positive if a > b, 0 if equal
 */
export function compareIds(idA: string, idB: string): number {
  const partsA = parseId(idA);
  const partsB = parseId(idB);
  
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const partA = partsA[i] ?? 0;
    const partB = partsB[i] ?? 0;
    
    // Both are numbers
    if (typeof partA === 'number' && typeof partB === 'number') {
      if (partA !== partB) return partA - partB;
    }
    // Both are strings
    else if (typeof partA === 'string' && typeof partB === 'string') {
      const comp = partA.localeCompare(partB);
      if (comp !== 0) return comp;
    }
    // Mixed types - numbers come before strings
    else if (typeof partA === 'number') {
      return -1;
    } else {
      return 1;
    }
  }
  
  return 0;
}

/**
 * Calculate optimal number line range based on the correct answer
 * Prevents the recurring issue of manually configured incorrect ranges
 */
function calculateOptimalRange(correctAnswer: string): { min: number, max: number } {
  try {
    const answerFraction = Fraction.parse(correctAnswer);
    if (!answerFraction) {
      console.warn(`Could not parse answer "${correctAnswer}" as fraction, using default range`);
      return { min: 0, max: 10 };
    }
    
    const answerDecimal = answerFraction.toDecimal();
    
    // Smart range calculation based on answer value
    if (answerDecimal < 0) {
      // For negative answers, ensure range includes 0 and extends beyond answer
      const min = Math.floor(answerDecimal - 1);
      const max = Math.max(2, Math.ceil(Math.abs(answerDecimal)) + 1);
      return { min, max };
    } else if (answerDecimal < 1) {
      // For fractional answers less than 1, use 0 to 2 or 3
      return { min: 0, max: answerDecimal > 0.5 ? 3 : 2 };
    } else {
      // For positive answers >= 1
      const answerInt = Math.floor(answerDecimal);
      const padding = answerInt <= 3 ? 1 : 2; // Smaller padding for small numbers
      return { 
        min: Math.max(0, answerInt - padding), 
        max: answerInt + padding + 1 
      };
    }
  } catch (error) {
    console.error(`Error calculating range for answer "${correctAnswer}":`, error);
    return { min: 0, max: 10 };
  }
}

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
  variant_letter?: string;
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
    `).all(sectionId) as { exercise_base_id: string; min_order: string }[];

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
    
    // Get visual config - first check exercise-specific, then section-level
    if (exercise.input_type === 'number-line' || exercise.input_type === 'text' || exercise.input_type === 'sequence-builder') {
      // First try to get exercise-specific config from visual_configs table
      const exerciseConfig = db.prepare(`
        SELECT config_json
        FROM visual_configs
        WHERE exercise_id = ?
      `).get(exercise.id) as { config_json: string } | undefined;
      
      if (exerciseConfig) {
        try {
          exercise.visualConfig = JSON.parse(exerciseConfig.config_json);
          
          // Keep visual config as-is from database
          // The display layer (number-line.tsx) will handle not showing edge labels
        } catch (error) {
          console.error('Failed to parse exercise visual config:', error);
        }
      }
      
      // If no exercise-specific config and it's number-line, try section_components
      if (!exercise.visualConfig && exercise.input_type === 'number-line') {
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
          // Default config if no section config exists - use smart range calculation
          const optimalRange = calculateOptimalRange(exercise.correct_answer);
          exercise.visualConfig = { 
            enableAllClicks: true, 
            ...optimalRange 
          };
        }
      }
      
      // Default configs if nothing found
      if (!exercise.visualConfig) {
        if (exercise.input_type === 'number-line') {
          const optimalRange = calculateOptimalRange(exercise.correct_answer);
          exercise.visualConfig = { 
            enableAllClicks: true, 
            ...optimalRange 
          };
        } else if (exercise.input_type === 'text') {
          exercise.visualConfig = {};
        } else if (exercise.input_type === 'sequence-builder') {
          exercise.visualConfig = {};
        }
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