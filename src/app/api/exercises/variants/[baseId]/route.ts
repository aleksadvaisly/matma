import { NextResponse } from 'next/server';
import { getExerciseVariants } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ baseId: string }> }
) {
  try {
    const { baseId } = await params;
    const variants = getExerciseVariants(baseId);
    
    return NextResponse.json({ variants });
  } catch (error) {
    console.error('Error fetching variants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch variants' },
      { status: 500 }
    );
  }
}