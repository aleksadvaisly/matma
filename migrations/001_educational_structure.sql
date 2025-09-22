-- Migration: Educational Structure for Dynamic Sections
-- Date: 2024-01-22
-- Description: Add subjects, textbooks, and section_components tables

-- 1. Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create textbooks table (independent of specific classes)
CREATE TABLE IF NOT EXISTS textbooks (
  id TEXT PRIMARY KEY, -- 'mat6-cwiczenia-wsip-2024'
  subject_id INTEGER NOT NULL,
  grade_level INTEGER NOT NULL, -- 1-8, not class_id
  type TEXT NOT NULL, -- 'cwiczenia', 'teoria', 'zadania'
  title TEXT NOT NULL,
  publisher TEXT,
  edition TEXT,
  isbn TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- 3. Create section_components table for dynamic section configuration
CREATE TABLE IF NOT EXISTS section_components (
  section_id TEXT PRIMARY KEY,
  component_type TEXT DEFAULT 'standard', -- 'standard', 'interactive', 'game'
  processing_config TEXT, -- JSON stored as TEXT for SQLite
  ui_config TEXT, -- JSON stored as TEXT for SQLite
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (section_id) REFERENCES sections(id)
);

-- 4. Add textbook_id to chapters table
ALTER TABLE chapters ADD COLUMN textbook_id TEXT;

-- 5. Optional: Create classes table for future use
CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY, -- '6g-2024'
  grade_level INTEGER NOT NULL,
  section TEXT,
  school_year TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Optional: Create user_textbooks for future multi-textbook support
CREATE TABLE IF NOT EXISTS user_textbooks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  textbook_id TEXT NOT NULL,
  class_id TEXT,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (textbook_id) REFERENCES textbooks(id),
  FOREIGN KEY (class_id) REFERENCES classes(id)
);