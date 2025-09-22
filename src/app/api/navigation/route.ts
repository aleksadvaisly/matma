import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'matma.db'));

export async function GET() {
  try {
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
    
    const chaptersWithSections = chapters.map(chapter => ({
      ...chapter,
      sections: sections.filter(section => section.chapter_id === chapter.id)
    }));
    
    return NextResponse.json({
      chapters: chaptersWithSections
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation' },
      { status: 500 }
    );
  }
}