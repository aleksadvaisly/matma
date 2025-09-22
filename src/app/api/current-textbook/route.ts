import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'matma.db'));

// Static context - in the future this could be dynamic per user
const CURRENT_TEXTBOOK_ID = 'mat6-cwiczenia-wsip-2024';

export async function GET() {
  try {
    const textbook = db.prepare(`
      SELECT 
        t.id,
        t.grade_level,
        t.type,
        t.title,
        t.publisher,
        t.edition,
        s.id as subject_id,
        s.name as subject_name,
        s.icon as subject_icon
      FROM textbooks t
      JOIN subjects s ON t.subject_id = s.id
      WHERE t.id = ?
    `).get(CURRENT_TEXTBOOK_ID) as any;
    
    if (!textbook) {
      return NextResponse.json(
        { error: 'Textbook not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      id: textbook.id,
      title: textbook.title,
      subject_id: textbook.subject_id,
      subject_name: textbook.subject_name,
      subject_icon: textbook.subject_icon,
      grade_level: textbook.grade_level,
      type: textbook.type,
      publisher: textbook.publisher,
      edition: textbook.edition
    });
  } catch (error) {
    console.error('Error fetching textbook info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch textbook information' },
      { status: 500 }
    );
  }
}