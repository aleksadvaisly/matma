-- Seed Data for Educational Structure
-- Date: 2024-01-22

-- 1. Insert subjects
INSERT INTO subjects (name, description, icon) VALUES 
  ('matematyka', 'Nauka liczb, działań i rozwiązywania problemów', '📐'),
  ('fizyka', 'Nauka o zjawiskach fizycznych', '⚛️'),
  ('język polski', 'Nauka języka ojczystego', '📚'),
  ('historia', 'Nauka o przeszłości', '📜'),
  ('biologia', 'Nauka o życiu', '🌿'),
  ('geografia', 'Nauka o Ziemi', '🌍'),
  ('chemia', 'Nauka o substancjach', '🧪'),
  ('informatyka', 'Nauka o komputerach i programowaniu', '💻');

-- 2. Insert current textbook (Mathematics Grade 6 - Exercises)
INSERT INTO textbooks (
  id,
  subject_id,
  grade_level,
  type,
  title,
  publisher,
  edition,
  isbn,
  is_active
) VALUES (
  'mat6-cwiczenia-wsip-2024',
  1, -- subject_id for 'matematyka'
  6, -- grade level 6
  'cwiczenia',
  'Matematyka 6 - Ćwiczenia',
  'WSiP',
  '2024',
  '978-83-02-12345-6',
  1
);

-- 3. Link existing chapters to the textbook
UPDATE chapters 
SET textbook_id = 'mat6-cwiczenia-wsip-2024'
WHERE textbook_id IS NULL;

-- 4. Configure all existing sections with standard settings
INSERT INTO section_components (section_id, component_type, processing_config, ui_config)
SELECT 
  id,
  'standard',
  '{"answerType": "integer", "validation": "flexible"}',
  '{"showHints": true, "showProgress": true, "allowNavigation": true}'
FROM sections
WHERE NOT EXISTS (
  SELECT 1 FROM section_components WHERE section_components.section_id = sections.id
);

-- 5. Optional: Add a sample class for testing
INSERT INTO classes (id, grade_level, section, school_year) 
VALUES ('6g-2024', 6, 'g', '2024/2025');