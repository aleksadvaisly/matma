import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET: Fetch user progress for all sections or specific user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default-user';
    
    const progress = db.prepare(`
      SELECT 
        up.section_id,
        up.exercises_completed,
        up.total_exercises,
        up.last_exercise_id,
        up.completed_at,
        s.title as section_title,
        s.chapter_id
      FROM user_progress up
      JOIN sections s ON up.section_id = s.id
      WHERE up.user_id = ?
      ORDER BY s.chapter_id, s.order_index
    `).all(userId);
    
    const response = NextResponse.json({ progress });
    
    // Prevent caching to ensure fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

// POST: Update user progress for a specific section
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      userId = 'default-user',
      sectionId, 
      exercisesCompleted, 
      totalExercises, 
      lastExerciseId 
    } = body;


    if (!sectionId || exercisesCompleted === undefined || !totalExercises) {
      return NextResponse.json(
        { error: 'Missing required fields: sectionId, exercisesCompleted, totalExercises' },
        { status: 400 }
      );
    }

    // Get total exercises count from database if not provided accurately
    const actualTotal = db.prepare(`
      SELECT COUNT(*) as count 
      FROM exercises 
      WHERE section_id = ?
    `).get(sectionId)?.count || totalExercises;

    const isCompleted = exercisesCompleted >= actualTotal;
    
    // Upsert user progress
    const stmt = db.prepare(`
      INSERT INTO user_progress (
        user_id, section_id, exercises_completed, total_exercises, 
        last_exercise_id, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, section_id) DO UPDATE SET
        exercises_completed = excluded.exercises_completed,
        total_exercises = excluded.total_exercises,
        last_exercise_id = excluded.last_exercise_id,
        completed_at = excluded.completed_at
    `);

    // Use transaction to ensure data consistency
    const transaction = db.transaction(() => {
      stmt.run(
        userId,
        sectionId, 
        exercisesCompleted, 
        actualTotal,
        lastExerciseId,
        isCompleted ? new Date().toISOString() : null
      );
    });
    
    transaction();

    const response = NextResponse.json({ 
      success: true,
      progress: {
        sectionId,
        exercisesCompleted,
        totalExercises: actualTotal,
        isCompleted
      }
    });
    
    // Prevent caching to ensure fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}