declare const db: any;
export { db };
/**
 * Parse exercise ID into sortable numeric components
 * Example: "7-1-2" → [7, 1, 2]
 * Example: "7-1-2-a" → [7, 1, 2, 'a']
 */
export declare function parseExerciseId(id: string): (number | string)[];
/**
 * Compare two exercise IDs for sorting
 * Returns negative if a < b, positive if a > b, 0 if equal
 */
export declare function compareExerciseIds(idA: string, idB: string): number;
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
export declare function getExercisesBySection(sectionId: string, specificExerciseId?: string | null): Exercise[];
export declare function getSectionInfo(sectionId: string): {
    title: string;
    description: string;
};
export declare function getSectionHints(sectionId: string): string[];
export declare function getExerciseVariants(exerciseBaseId: string): string[];
