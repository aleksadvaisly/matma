import { NextResponse } from 'next/server';
import { getExercisesBySection, getSectionInfo, getSectionHints } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  try {
    const { sectionId } = await params;
    console.log('Fetching exercises for section:', sectionId);
    const exercises = getExercisesBySection(sectionId);
    const sectionInfo = getSectionInfo(sectionId);
    const hints = getSectionHints(sectionId);
    
    // Transform to match existing component format
    const transformedExercises = exercises.map(ex => ({
      id: ex.id,
      question: ex.question || ex.story,
      answer: ex.correct_answer,
      hint: ex.hint,
      explanation: ex.explanation,
      inputType: ex.input_type === 'number-line' ? 'number-line' : 
                 ex.input_type === 'choices' ? 'choices' : 'text',
      options: ex.options?.map(opt => opt.option_text),
      numberLineConfig: ex.visualConfig
    }));
    
    return NextResponse.json({
      exercises: transformedExercises,
      hints: hints,
      title: sectionInfo?.title,
      description: sectionInfo?.description
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exercises' },
      { status: 500 }
    );
  }
}