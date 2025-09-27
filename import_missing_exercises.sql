-- Import missing exercises from zadania_wszystko.md
-- Testing with section 1-4 exercises 8-13 first

-- Section 1-4 Exercise 8: |-9| + 5
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '1-4-8', '1-4', 'I', 1, 4, 8, 'I.1.4.8', 8, 1,
    'Oblicz |-9| + 5', '14', NULL, '|-9| = 9, więc 9 + 5 = 14', 1
);

-- Section 1-4 Exercise 9: 11 + |-5|
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '1-4-9', '1-4', 'I', 1, 4, 9, 'I.1.4.9', 9, 1,
    'Oblicz 11 + |-5|', '16', NULL, '|-5| = 5, więc 11 + 5 = 16', 1
);

-- Section 1-4 Exercise 10: |-25| - 12
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '1-4-10', '1-4', 'I', 1, 4, 10, 'I.1.4.10', 10, 1,
    'Oblicz |-25| - 12', '13', NULL, '|-25| = 25, więc 25 - 12 = 13', 1
);

-- Section 1-4 Exercise 11: 19 - |-13|
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '1-4-11', '1-4', 'I', 1, 4, 11, 'I.1.4.11', 11, 1,
    'Oblicz 19 - |-13|', '6', NULL, '|-13| = 13, więc 19 - 13 = 6', 1
);

-- Section 1-4 Exercise 12: |8 - 5|
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '1-4-12', '1-4', 'I', 1, 4, 12, 'I.1.4.12', 12, 1,
    'Oblicz |8 - 5|', '3', NULL, '8 - 5 = 3, |3| = 3', 1
);

-- Section 1-4 Exercise 13: |8 + 5|
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '1-4-13', '1-4', 'I', 1, 4, 13, 'I.1.4.13', 13, 1,
    'Oblicz |8 + 5|', '13', NULL, '8 + 5 = 13, |13| = 13', 1
);