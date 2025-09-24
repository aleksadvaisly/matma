import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'matma.db'));

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  try {
    const { sectionId } = await params;
    
    const config = db.prepare(`
      SELECT component_type, processing_config, ui_config, next_section_id, next_chapter_id
      FROM section_components
      WHERE section_id = ?
    `).get(sectionId) as any;
    
    if (!config) {
      return NextResponse.json(
        { error: 'Section configuration not found' },
        { status: 404 }
      );
    }
    
    // Parse JSON strings from database
    // Construct complete next section URL if next section exists
    const nextSectionUrl = config.next_section_id && config.next_chapter_id
      ? `/dashboard/chapters/${config.next_chapter_id}/sections/${config.next_section_id}`
      : null;
    
    return NextResponse.json({
      component_type: config.component_type,
      processing_config: JSON.parse(config.processing_config || '{}'),
      ui_config: JSON.parse(config.ui_config || '{}'),
      next_section_id: config.next_section_id,
      next_section_url: nextSectionUrl
    });
  } catch (error) {
    console.error('Error fetching section config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch section configuration' },
      { status: 500 }
    );
  }
}