import Database from 'better-sqlite3';
import path from 'path';
import { redirect } from 'next/navigation';

interface SectionPageProps {
  params: Promise<{
    chapterId: string;
    sectionId: string;
  }>;
}

// Check if section exists in database
function sectionExists(sectionId: string): boolean {
  try {
    const db = new Database(path.join(process.cwd(), 'matma.db'));
    const result = db.prepare(
      'SELECT id FROM sections WHERE id = ?'
    ).get(sectionId);
    db.close();
    return !!result;
  } catch (error) {
    console.error('Error checking section existence:', error);
    return false;
  }
}

// Get first exercise with random variant, returns null if no exercises exist
function getFirstExercise(sectionId: string): string | null {
  try {
    const db = new Database(path.join(process.cwd(), 'matma.db'));
    
    // Check if section has variants
    const hasVariants = db.prepare(`
      SELECT COUNT(*) as count
      FROM exercises 
      WHERE section_id = ? AND exercise_base_id IS NOT NULL
    `).get(sectionId) as { count: number };

    if (hasVariants.count > 0) {
      // Get first exercise with random variant
      const firstExercise = db.prepare(`
        SELECT id FROM exercises 
        WHERE section_id = ? AND exercise_base_id = (
          SELECT MIN(exercise_base_id) FROM exercises WHERE section_id = ?
        )
        ORDER BY RANDOM()
        LIMIT 1
      `).get(sectionId, sectionId) as { id: string } | undefined;
      
      db.close();
      return firstExercise?.id || null;
    } else {
      // Fallback for sections without variants
      const firstExercise = db.prepare(`
        SELECT id FROM exercises 
        WHERE section_id = ? 
        ORDER BY order_index 
        LIMIT 1
      `).get(sectionId) as { id: string } | undefined;
      
      db.close();
      return firstExercise?.id || null;
    }
  } catch (error) {
    console.error('Error getting first exercise:', error);
    return null;
  }
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { chapterId, sectionId } = await params;

  // Check if section exists in database
  const exists = sectionExists(sectionId);

  if (!exists) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sekcja w przygotowaniu</h1>
          <p className="text-muted-foreground">
            Ta sekcja będzie dostępna wkrótce. Na razie skup się na innych sekcjach.
          </p>
        </div>
      </div>
    );
  }

  // Check if section has exercises
  const firstExerciseId = getFirstExercise(sectionId);
  
  if (!firstExerciseId) {
    // Section exists but has no exercises
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sekcja w przygotowaniu</h1>
          <p className="text-muted-foreground">
            Ta sekcja nie zawiera jeszcze ćwiczeń. Wróć tutaj wkrótce!
          </p>
        </div>
      </div>
    );
  }

  // Redirect to first exercise with random variant
  redirect(`/dashboard/chapters/${chapterId}/sections/${sectionId}/exercise/${firstExerciseId}`);
}