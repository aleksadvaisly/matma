import { UniversalSection } from '@/components/sections/universal-section';
import Database from 'better-sqlite3';
import path from 'path';

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

export default async function SectionPage({ params }: SectionPageProps) {
  const { sectionId } = await params;

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

  // All sections now use the UniversalSection component
  return (
    <div className="p-6">
      <UniversalSection sectionId={sectionId} />
    </div>
  );
}