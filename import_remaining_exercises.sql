-- Continue importing remaining missing exercises
-- Sections 3-2, 3-3, 4-1, 4-2, 5-1, 5-2, 5-3, 6-1

-- ===== SECTION 3-2: Mnożenie w praktyce (exercises 1-5) =====

-- 3-2-1: Three negative factors
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '3-2-1', '3-2', 'I', 3, 2, 1, 'I.3.2.1', 1, 1,
    '(-2) · (-2) · (-2) = ?', '-8', NULL, 'Trzy czynniki ujemne dają wynik ujemny', 2
);

-- 3-2-2: Mixed factors with result positive
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '3-2-2', '3-2', 'I', 3, 2, 2, 'I.3.2.2', 2, 1,
    '(-3) · 2 · (-1) = ?', '6', NULL, 'Dwa czynniki ujemne i jeden dodatni dają wynik dodatni', 2
);

-- 3-2-3: Two negative factors with positive
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '3-2-3', '3-2', 'I', 3, 2, 3, 'I.3.2.3', 3, 1,
    '5 · (-2) · (-3) = ?', '30', NULL, 'Dwa czynniki ujemne dają wynik dodatni, potem mnożymy przez 5', 2
);

-- 3-2-4: More complex three-factor multiplication
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '3-2-4', '3-2', 'I', 3, 2, 4, 'I.3.2.4', 4, 1,
    '(-4) · (-5) · 2 = ?', '40', NULL, '(-4) · (-5) = 20, potem 20 · 2 = 40', 2
);

-- 3-2-5: Four negative factors
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '3-2-5', '3-2', 'I', 3, 2, 5, 'I.3.2.5', 5, 1,
    '(-1) · (-1) · (-1) · (-1) = ?', '1', NULL, 'Parzysta liczba czynników ujemnych daje wynik dodatni', 2
);

-- ===== SECTION 3-3: Zadania tekstowe z mnożeniem (exercises 1-3) =====

-- 3-3-1: Temperature decrease word problem
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, story, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '3-3-1', '3-3', 'I', 3, 3, 1, 'I.3.3.1', 1, 1,
    'Jaka będzie zmiana temperatury?', 'Temperatura spada o 3°C każdej godziny. O ile stopni spadnie w ciągu 5 godzin?', '-15°C', NULL, '5 · (-3) = -15', 2
);

-- 3-3-2: Diver descent word problem
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, story, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '3-3-2', '3-3', 'I', 3, 3, 2, 'I.3.3.2', 2, 1,
    'Na jakiej głębokości będzie nurek?', 'Nurek schodzi w dół z prędkością 4 metry na minutę. Gdzie będzie po 3 minutach?', '-12m', NULL, '3 · (-4) = -12', 2
);

-- 3-3-3: Company loss word problem
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, story, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '3-3-3', '3-3', 'I', 3, 3, 3, 'I.3.3.3', 3, 1,
    'Ile wyniesie łączna strata?', 'Firma ma stratę 500 zł miesięcznie. Jaka będzie łączna strata po 6 miesiącach?', '-3000 zł', NULL, '6 · (-500) = -3000', 2
);

-- ===== SECTION 4-1: Zasady dzielenia (exercises 1-13) =====

-- 4-1-1: Basic positive division
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '4-1-1', '4-1', 'I', 4, 1, 1, 'I.4.1.1', 1, 1,
    '12 : 3 = ?', '4', NULL, 'Obie liczby dodatnie, wynik dodatni', 1
);

-- 4-1-2: Negative divided by positive
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '4-1-2', '4-1', 'I', 4, 1, 2, 'I.4.1.2', 2, 1,
    '(-12) : 3 = ?', '-4', NULL, 'Różne znaki, wynik ujemny', 1
);

-- 4-1-3: Positive divided by negative
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '4-1-3', '4-1', 'I', 4, 1, 3, 'I.4.1.3', 3, 1,
    '12 : (-3) = ?', '-4', NULL, 'Różne znaki, wynik ujemny', 1
);

-- 4-1-4: Negative divided by negative
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '4-1-4', '4-1', 'I', 4, 1, 4, 'I.4.1.4', 4, 1,
    '(-12) : (-3) = ?', '4', NULL, 'Te same znaki, wynik dodatni', 1
);

-- 4-1-5: Another negative by positive
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '4-1-5', '4-1', 'I', 4, 1, 5, 'I.4.1.5', 5, 1,
    '(-20) : 5 = ?', '-4', NULL, 'Różne znaki, wynik ujemny', 1
);

-- 4-1-6: Larger negative division
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '4-1-6', '4-1', 'I', 4, 1, 6, 'I.4.1.6', 6, 1,
    '(-24) : (-6) = ?', '4', NULL, 'Te same znaki, wynik dodatni', 1
);

-- 4-1-7: Positive by negative again
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '4-1-7', '4-1', 'I', 4, 1, 7, 'I.4.1.7', 7, 1,
    '30 : (-5) = ?', '-6', NULL, 'Różne znaki, wynik ujemny', 1
);

-- 4-1-8: Zero division
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '4-1-8', '4-1', 'I', 4, 1, 8, 'I.4.1.8', 8, 1,
    '0 : (-7) = ?', '0', NULL, 'Zero podzielone przez dowolną liczbę (różną od zera) daje zero', 1
);

-- 4-1-9: Another negative division
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '4-1-9', '4-1', 'I', 4, 1, 9, 'I.4.1.9', 9, 1,
    '(-36) : (-9) = ?', '4', NULL, 'Te same znaki, wynik dodatni', 1
);

-- 4-1-10: Large negative by positive
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '4-1-10', '4-1', 'I', 4, 1, 10, 'I.4.1.10', 10, 1,
    '(-100) : 25 = ?', '-4', NULL, 'Różne znaki, wynik ujemny', 1
);

-- 4-1-11: Fraction division with variants
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level, variant_letter, exercise_base_id
) VALUES 
    ('4-1-11-a', '4-1', 'I', 4, 1, 11, 'I.4.1.11', 11, 1, '(-¾) : ⅜ = ?', '-2', NULL, '(-3/4) : (3/8) = (-3/4) × (8/3) = -24/12 = -2', 4, 'a', '4-1-11'),
    ('4-1-11-b', '4-1', 'I', 4, 1, 11, 'I.4.1.11', 11, 1, '(-⅔) : ⅓ = ?', '-2', NULL, '(-2/3) : (1/3) = (-2/3) × (3/1) = -6/3 = -2', 4, 'b', '4-1-11'),
    ('4-1-11-c', '4-1', 'I', 4, 1, 11, 'I.4.1.11', 11, 1, '(-⅚) : ⅙ = ?', '-5', NULL, '(-5/6) : (1/6) = (-5/6) × (6/1) = -30/6 = -5', 4, 'c', '4-1-11'),
    ('4-1-11-d', '4-1', 'I', 4, 1, 11, 'I.4.1.11', 11, 1, '(-⅝) : ⅛ = ?', '-5', NULL, '(-5/8) : (1/8) = (-5/8) × (8/1) = -40/8 = -5', 4, 'd', '4-1-11');

-- 4-1-12: Positive by negative fraction
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level, variant_letter, exercise_base_id
) VALUES 
    ('4-1-12-a', '4-1', 'I', 4, 1, 12, 'I.4.1.12', 12, 1, '½ : (-⅔) = ?', '-¾', NULL, '(1/2) : (-2/3) = (1/2) × (-3/2) = -3/4', 4, 'a', '4-1-12'),
    ('4-1-12-b', '4-1', 'I', 4, 1, 12, 'I.4.1.12', 12, 1, '⅓ : (-½) = ?', '-⅔', NULL, '(1/3) : (-1/2) = (1/3) × (-2/1) = -2/3', 4, 'b', '4-1-12'),
    ('4-1-12-c', '4-1', 'I', 4, 1, 12, 'I.4.1.12', 12, 1, '¾ : (-⅜) = ?', '-2', NULL, '(3/4) : (-3/8) = (3/4) × (-8/3) = -24/12 = -2', 4, 'c', '4-1-12'),
    ('4-1-12-d', '4-1', 'I', 4, 1, 12, 'I.4.1.12', 12, 1, '⅖ : (-⅘) = ?', '-½', NULL, '(2/5) : (-4/5) = (2/5) × (-5/4) = -10/20 = -1/2', 4, 'd', '4-1-12');

-- 4-1-13: Mixed number division
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level, variant_letter, exercise_base_id
) VALUES 
    ('4-1-13-a', '4-1', 'I', 4, 1, 13, 'I.4.1.13', 13, 1, '(-2⅓) : (-1⅙) = ?', '2', NULL, '(-7/3) : (-7/6) = (-7/3) × (-6/7) = 42/21 = 2', 5, 'a', '4-1-13'),
    ('4-1-13-b', '4-1', 'I', 4, 1, 13, 'I.4.1.13', 13, 1, '(-3½) : (-1¾) = ?', '2', NULL, '(-7/2) : (-7/4) = (-7/2) × (-4/7) = 28/14 = 2', 5, 'b', '4-1-13'),
    ('4-1-13-c', '4-1', 'I', 4, 1, 13, 'I.4.1.13', 13, 1, '(-4⅔) : (-2⅓) = ?', '2', NULL, '(-14/3) : (-7/3) = (-14/3) × (-3/7) = 42/21 = 2', 5, 'c', '4-1-13'),
    ('4-1-13-d', '4-1', 'I', 4, 1, 13, 'I.4.1.13', 13, 1, '(-1⅔) : (-⅚) = ?', '2', NULL, '(-5/3) : (-5/6) = (-5/3) × (-6/5) = 30/15 = 2', 5, 'd', '4-1-13');

-- ===== SECTION 4-2: Dzielenie w praktyce (exercises 1-3) =====

-- 4-2-1: Multiple division sequence
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '4-2-1', '4-2', 'I', 4, 2, 1, 'I.4.2.1', 1, 1,
    '(-48) : 6 : (-2) = ?', '4', NULL, '(-48) : 6 = -8, potem (-8) : (-2) = 4', 2
);

-- 4-2-2: Another multiple division
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '4-2-2', '4-2', 'I', 4, 2, 2, 'I.4.2.2', 2, 1,
    '60 : (-3) : (-5) = ?', '4', NULL, '60 : (-3) = -20, potem (-20) : (-5) = 4', 2
);

-- 4-2-3: Third multiple division
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '4-2-3', '4-2', 'I', 4, 2, 3, 'I.4.2.3', 3, 1,
    '(-64) : (-8) : 2 = ?', '4', NULL, '(-64) : (-8) = 8, potem 8 : 2 = 4', 2
);

-- ===== SECTION 5-1: Odejmowanie jako dodawanie liczby przeciwnej (exercises 1-10) =====

-- 5-1-1: Basic subtraction conversion
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '5-1-1', '5-1', 'I', 5, 1, 1, 'I.5.1.1', 1, 1,
    '4 - 7 = ?', '-3', NULL, '4 - 7 = 4 + (-7) = -3', 1
);

-- 5-1-2: Larger positive minus larger positive
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '5-1-2', '5-1', 'I', 5, 1, 2, 'I.5.1.2', 2, 1,
    '11 - 23 = ?', '-12', NULL, '11 - 23 = 11 + (-23) = -12', 1
);

-- 5-1-3: Simple positive minus larger positive
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '5-1-3', '5-1', 'I', 5, 1, 3, 'I.5.1.3', 3, 1,
    '3 - 7 = ?', '-4', NULL, '3 - 7 = 3 + (-7) = -4', 1
);

-- 5-1-4: Negative minus positive
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '5-1-4', '5-1', 'I', 5, 1, 4, 'I.5.1.4', 4, 1,
    '(-3) - 7 = ?', '-10', NULL, '(-3) - 7 = (-3) + (-7) = -10', 1
);

-- 5-1-5: Another negative minus positive
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '5-1-5', '5-1', 'I', 5, 1, 5, 'I.5.1.5', 5, 1,
    '(-1) - 12 = ?', '-13', NULL, '(-1) - 12 = (-1) + (-12) = -13', 1
);

-- 5-1-6: Negative minus negative (same sign removal)
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '5-1-6', '5-1', 'I', 5, 1, 6, 'I.5.1.6', 6, 1,
    '(-5) - (-3) = ?', '-2', NULL, '(-5) - (-3) = (-5) + 3 = -2', 2
);

-- 5-1-7: Negative minus negative resulting positive
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '5-1-7', '5-1', 'I', 5, 1, 7, 'I.5.1.7', 7, 1,
    '(-1) - (-15) = ?', '14', NULL, '(-1) - (-15) = (-1) + 15 = 14', 2
);

-- 5-1-8: Negative minus negative
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '5-1-8', '5-1', 'I', 5, 1, 8, 'I.5.1.8', 8, 1,
    '-15 - (-8) = ?', '-7', NULL, '-15 - (-8) = -15 + 8 = -7', 2
);

-- 5-1-9: Positive minus larger positive
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '5-1-9', '5-1', 'I', 5, 1, 9, 'I.5.1.9', 9, 1,
    '5 - 17 = ?', '-12', NULL, '5 - 17 = 5 + (-17) = -12', 1
);

-- 5-1-10: Positive minus negative
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '5-1-10', '5-1', 'I', 5, 1, 10, 'I.5.1.10', 10, 1,
    '6 - (-11) = ?', '17', NULL, '6 - (-11) = 6 + 11 = 17', 2
);

-- ===== SECTION 5-2: Odejmowanie dużych liczb (exercises 1-5) =====

-- 5-2-1: Large negative minus negative
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '5-2-1', '5-2', 'I', 5, 2, 1, 'I.5.2.1', 1, 1,
    '-150 - (-80) = ?', '-70', NULL, '-150 - (-80) = -150 + 80 = -70', 2
);

-- 5-2-2: Positive minus large positive
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '5-2-2', '5-2', 'I', 5, 2, 2, 'I.5.2.2', 2, 1,
    '140 - 500 = ?', '-360', NULL, '140 - 500 = 140 + (-500) = -360', 2
);

-- 5-2-3: Large negative minus large negative
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '5-2-3', '5-2', 'I', 5, 2, 3, 'I.5.2.3', 3, 1,
    '-100 - (-770) = ?', '670', NULL, '-100 - (-770) = -100 + 770 = 670', 2
);

-- 5-2-4: Positive minus negative large
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '5-2-4', '5-2', 'I', 5, 2, 4, 'I.5.2.4', 4, 1,
    '150 - (-110) = ?', '260', NULL, '150 - (-110) = 150 + 110 = 260', 2
);

-- 5-2-5: Large negative minus negative
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '5-2-5', '5-2', 'I', 5, 2, 5, 'I.5.2.5', 5, 1,
    '-300 - (-210) = ?', '-90', NULL, '-300 - (-210) = -300 + 210 = -90', 2
);

-- ===== SECTION 5-3: Zadania tekstowe z odejmowaniem (exercises 1-4) =====

-- 5-3-1: Temperature difference word problem
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, story, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '5-3-1', '5-3', 'I', 5, 3, 1, 'I.5.3.1', 1, 1,
    'O ile stopni spadła temperatura?', 'W południe zanotowano temperaturę 2°C. Wieczorem temperatura spadła do -5°C.', '7°C', NULL, '2 - (-5) = 7 stopni różnicy', 3
);

-- 5-3-2: Temperature calculation word problem
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, story, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '5-3-2', '5-3', 'I', 5, 3, 2, 'I.5.3.2', 2, 1,
    'Jaka była temperatura wieczorem?', 'Od południa do wieczora temperatura obniżyła się o 5°C. W południe było 7°C.', '2°C', NULL, '7 - 5 = 2', 3
);

-- 5-3-3: Bank account word problem
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, story, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '5-3-3', '5-3', 'I', 5, 3, 3, 'I.5.3.3', 3, 1,
    'Jaki jest teraz stan konta?', 'Stan konta pana Mariana wynosił 0 zł. Wypłacił z bankomatu 200 zł.', '-200 zł', NULL, '0 - 200 = -200', 3
);

-- 5-3-4: Aircraft altitude word problem
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, story, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '5-3-4', '5-3', 'I', 5, 3, 4, 'I.5.3.4', 4, 1,
    'Na jakiej wysokości leci teraz?', 'Samolot leciał na wysokości 10000 m i zniżył się o 2500 m.', '7500 m', NULL, '10000 - 2500 = 7500', 3
);

-- ===== SECTION 6-1: Kolejność wykonywania działań (exercises 1-10) =====

-- 6-1-1: Multiplication before addition
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '6-1-1', '6-1', 'I', 6, 1, 1, 'I.6.1.1', 1, 1,
    '2 + 3 · 4 = ?', '14', NULL, 'Najpierw mnożenie: 3 · 4 = 12, potem 2 + 12 = 14', 2
);

-- 6-1-2: Multiplication before subtraction
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '6-1-2', '6-1', 'I', 6, 1, 2, 'I.6.1.2', 2, 1,
    '10 - 2 · 3 = ?', '4', NULL, 'Najpierw mnożenie: 2 · 3 = 6, potem 10 - 6 = 4', 2
);

-- 6-1-3: Parentheses first
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '6-1-3', '6-1', 'I', 6, 1, 3, 'I.6.1.3', 3, 1,
    '(2 + 3) · 4 = ?', '20', NULL, 'Najpierw nawias: 2 + 3 = 5, potem 5 · 4 = 20', 2
);

-- 6-1-4: Division before addition
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '6-1-4', '6-1', 'I', 6, 1, 4, 'I.6.1.4', 4, 1,
    '12 : 3 + 2 = ?', '6', NULL, 'Najpierw dzielenie: 12 : 3 = 4, potem 4 + 2 = 6', 2
);

-- 6-1-5: Multiple multiplications and subtraction
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '6-1-5', '6-1', 'I', 6, 1, 5, 'I.6.1.5', 5, 1,
    '5 · 2 - 3 · 3 = ?', '1', NULL, '5 · 2 = 10, 3 · 3 = 9, potem 10 - 9 = 1', 2
);

-- 6-1-6: Negative multiplication with parentheses
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '6-1-6', '6-1', 'I', 6, 1, 6, 'I.6.1.6', 6, 1,
    '-2 · (3 + 5) = ?', '-16', NULL, 'Najpierw nawias: 3 + 5 = 8, potem -2 · 8 = -16', 3
);

-- 6-1-7: Parentheses with negative numbers
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '6-1-7', '6-1', 'I', 6, 1, 7, 'I.6.1.7', 7, 1,
    '(-3 + 7) · (-2) = ?', '-8', NULL, 'Najpierw nawias: -3 + 7 = 4, potem 4 · (-2) = -8', 3
);

-- 6-1-8: Division and multiplication with addition
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '6-1-8', '6-1', 'I', 6, 1, 8, 'I.6.1.8', 8, 1,
    '20 : (-5) + 3 · 2 = ?', '2', NULL, '20 : (-5) = -4, 3 · 2 = 6, potem -4 + 6 = 2', 3
);

-- 6-1-9: Complex negative operations
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '6-1-9', '6-1', 'I', 6, 1, 9, 'I.6.1.9', 9, 1,
    '3 · (-4) - (-2) · 5 = ?', '-2', NULL, '3 · (-4) = -12, (-2) · 5 = -10, potem -12 - (-10) = -12 + 10 = -2', 4
);

-- 6-1-10: Multiple operations
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '6-1-10', '6-1', 'I', 6, 1, 10, 'I.6.1.10', 10, 1,
    '2 + 3 · 4 - 5 : 5 = ?', '13', NULL, '3 · 4 = 12, 5 : 5 = 1, potem 2 + 12 - 1 = 13', 3
);