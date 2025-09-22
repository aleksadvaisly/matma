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
  options?: any[];
  visualConfig?: any;
}

export interface ExerciseOption {
  id: number;
  exercise_id: string;
  option_text: string;
  order_index: number;
}

export interface VisualConfig {
  exercise_id: string;
  config_type: string;
  config_json: string;
}

export function getExercisesBySection(sectionId: string) {
  const exercises = db.prepare(`
    SELECT 
      e.*,
      it.type_name as input_type
    FROM exercises e
    JOIN input_types it ON e.input_type_id = it.id
    WHERE e.section_id = ?
    ORDER BY e.order_index
  `).all(sectionId) as Exercise[];
  
  // Get options for each exercise
  for (const exercise of exercises) {
    if (exercise.input_type === 'choices') {
      const options = db.prepare(`
        SELECT option_text, order_index
        FROM exercise_options
        WHERE exercise_id = ?
        ORDER BY order_index
      `).all(exercise.id) as ExerciseOption[];
      
      exercise.options = options;
    }
    
    // Get visual config if it's number-line
    if (exercise.input_type === 'number-line') {
      const config = db.prepare(`
        SELECT config_json
        FROM visual_configs
        WHERE exercise_id = ?
      `).get(exercise.id) as { config_json: string } | undefined;
      
      if (config) {
        exercise.visualConfig = JSON.parse(config.config_json);
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