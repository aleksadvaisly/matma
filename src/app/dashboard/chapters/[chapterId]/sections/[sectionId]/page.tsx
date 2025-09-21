import { notFound } from 'next/navigation';
import { NumberLineSection } from '@/components/sections/number-line-section';
import { ComparisonSection } from '@/components/sections/comparison-section';
import { OppositeSection } from '@/components/sections/opposite-section';
import { AbsoluteValueSection } from '@/components/sections/absolute-value-section';
import { IntegerSetSection } from '@/components/sections/integer-set-section';
import { AdditionRulesSection } from '@/components/sections/addition-rules-section';
import { AdditionTechniquesSection } from '@/components/sections/addition-techniques-section';
import { AdditionWordProblemsSection } from '@/components/sections/addition-word-problems-section';

interface SectionPageProps {
  params: Promise<{
    chapterId: string;
    sectionId: string;
  }>;
}

const sectionComponents: Record<string, Record<string, React.ComponentType>> = {
  'chapter-1': {
    '1-1': NumberLineSection,
    '1-2': ComparisonSection,
    '1-3': OppositeSection,
    '1-4': AbsoluteValueSection,
    '1-5': IntegerSetSection,
  },
  'chapter-2': {
    '2-1': AdditionRulesSection,
    '2-2': AdditionTechniquesSection,
    '2-3': AdditionWordProblemsSection,
  },
};

export default async function SectionPage({ params }: SectionPageProps) {
  const { chapterId, sectionId } = await params;

  const chapterSections = sectionComponents[chapterId];

  if (!chapterSections) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Wkrótce dostępne</h1>
          <p className="text-muted-foreground">
            Ten rozdział będzie dostępny wkrótce. Na razie skup się na sekcjach z aktywnych rozdziałów.
          </p>
        </div>
      </div>
    );
  }

  const SectionComponent = chapterSections[sectionId];

  if (!SectionComponent) {
    notFound();
  }

  return <SectionComponent />;
}
