import { notFound } from 'next/navigation';
import { NumberLineSection } from '@/components/sections/number-line-section';
import { ComparisonSection } from '@/components/sections/comparison-section';
import { OppositeSection } from '@/components/sections/opposite-section';
import { AbsoluteValueSection } from '@/components/sections/absolute-value-section';

interface SectionPageProps {
  params: Promise<{
    chapterId: string;
    sectionId: string;
  }>;
}

const sectionComponents: Record<string, React.ComponentType> = {
  '1-1': NumberLineSection,
  '1-2': ComparisonSection,
  '1-3': OppositeSection,
  '1-4': AbsoluteValueSection,
};

export default async function SectionPage({ params }: SectionPageProps) {
  const { chapterId, sectionId } = await params;
  
  // For now, only implement Chapter 1 sections
  if (chapterId !== 'chapter-1') {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Wkrótce dostępne</h1>
          <p className="text-muted-foreground">
            Ten rozdział będzie dostępny wkrótce. Na razie skup się na pierwszym rozdziale!
          </p>
        </div>
      </div>
    );
  }

  const SectionComponent = sectionComponents[sectionId];
  
  if (!SectionComponent) {
    if (sectionId === '1-5') {
      return (
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Wkrótce dostępne</h1>
            <p className="text-muted-foreground">
              Ta sekcja będzie dostępna wkrótce.
            </p>
          </div>
        </div>
      );
    }
    notFound();
  }

  return <SectionComponent />;
}