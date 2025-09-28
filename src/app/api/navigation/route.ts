import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default-user';
    
    const chapters = db.prepare(`
      SELECT id, title, description, icon, order_index
      FROM chapters
      ORDER BY order_index
    `).all();
    
    const sections = db.prepare(`
      SELECT id, chapter_id, title, description, order_index
      FROM sections
      ORDER BY chapter_id, order_index
    `).all();

    // Get progress for all sections for this user
    const progress = db.prepare(`
      SELECT 
        section_id,
        exercises_completed,
        total_exercises,
        completed_at
      FROM user_progress
      WHERE user_id = ?
    `).all(userId);

    // Create progress lookup map
    const progressMap = new Map(
      progress.map(p => [p.section_id, p])
    );
    
    const chaptersWithSections = chapters.map(chapter => {
      const chapterSections = sections
        .filter(section => section.chapter_id === chapter.id)
      
      const processedSections = chapterSections
        .map(section => {
          const sectionProgress = progressMap.get(section.id);
          // Check if section is completed either by completed_at timestamp OR by having all exercises completed
          const completed = sectionProgress?.completed_at ? true : 
            (sectionProgress && sectionProgress.exercises_completed >= sectionProgress.total_exercises);
          const progressPercent = sectionProgress 
            ? Math.round((sectionProgress.exercises_completed / sectionProgress.total_exercises) * 100)
            : 0;

          // Add section numbering based on chapter and section order
          const chapterNumber = chapter.order_index;
          const sectionNumber = section.order_index;
          const formattedTitle = `${chapterNumber}.${sectionNumber} ${section.title}`;

          return {
            ...section,
            title: formattedTitle,
            completed,
            progress: progressPercent
          };
        });

      // Calculate chapter total progress
      const totalProgress = processedSections.length > 0
        ? Math.round(
            processedSections.reduce((sum, section) => sum + (section.progress || 0), 0) / 
            processedSections.length
          )
        : 0;

      // Format chapter title with numbering
      const formattedChapterTitle = `${chapter.order_index}. ${chapter.title}`;

      return {
        ...chapter,
        title: formattedChapterTitle,
        sections: processedSections,
        totalProgress
      };
    });
    
    const response = NextResponse.json({
      chapters: chaptersWithSections
    });
    
    // Prevent caching to ensure fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation' },
      { status: 500 }
    );
  }
}