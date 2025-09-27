-- Complete import of all missing exercises from zadania_wszystko.md
-- DO NOT modify existing exercises - only insert missing ones

-- ===== SECTION 1-5: Missing exercises 8-10 =====

-- 1-5-8: Exercise about fraction identification
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '1-5-8', '1-5', 'I', 1, 5, 8, 'I.1.5.8', 8, 1,
    'Wśród liczb: -3, 2/3, 0, 17/4, 12/4, 20/5, 19/8, 7 jest 5 liczb całkowitych. Które to liczby?', '-3, 0, 12/4, 20/5, 7', NULL, '12/4 = 3, 20/5 = 4 są liczbami całkowitymi', 2
);

-- 1-5-9: Numbers less than -8
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '1-5-9', '1-5', 'I', 1, 5, 9, 'I.1.5.9', 9, 1,
    'Które z liczb: -10, -7, -4, -1, 2 są mniejsze niż -8?', '-10', NULL, 'Tylko -10 < -8', 2
);

-- 1-5-10: Identifying integers
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '1-5-10', '1-5', 'I', 1, 5, 10, 'I.1.5.10', 10, 1,
    'Wybierz wszystkie liczby całkowite spośród: -12.7, -3, -1/4, 1/3, 20/3, -17, 0, 1', '-3, -17, 0, 1', NULL, 'Liczby całkowite nie mają części ułamkowej', 2
);

-- ===== SECTION 2-2: Missing exercises 6-7 =====

-- 2-2-6: Large negative addition
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '2-2-6', '2-2', 'I', 2, 2, 6, 'I.2.2.6', 6, 1,
    '-5000 + (-6000)', '-11000', NULL, NULL, 2
);

-- 2-2-7: Mixed large numbers
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '2-2-7', '2-2', 'I', 2, 2, 7, 'I.2.2.7', 7, 1,
    '400 + (-250)', '150', NULL, NULL, 2
);

-- ===== SECTION 2-3: Missing exercise 6 =====

-- 2-3-6: Three addends
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '2-3-6', '2-3', 'I', 2, 3, 6, 'I.2.3.6', 6, 1,
    '5 + (-3) + (-2)', '0', NULL, NULL, 3
);

-- ===== SECTION 2-4: Dodawanie ułamków (exercises 1-4) =====

-- 2-4-1: Basic fraction addition with variants
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level, variant_letter, exercise_base_id
) VALUES 
    ('2-4-1-a', '2-4', 'I', 2, 4, 1, 'I.2.4.1', 1, 1, '(-⅔) + ⅓', '-⅓', NULL, '-⅔ + ⅓ = -2/3 + 1/3 = -1/3', 4, 'a', '2-4-1'),
    ('2-4-1-b', '2-4', 'I', 2, 4, 1, 'I.2.4.1', 1, 1, '(-¾) + ¼', '-½', NULL, '-¾ + ¼ = -3/4 + 1/4 = -2/4 = -1/2', 4, 'b', '2-4-1'),
    ('2-4-1-c', '2-4', 'I', 2, 4, 1, 'I.2.4.1', 1, 1, '(-⅚) + ⅙', '-⅔', NULL, '-⅚ + ⅙ = -5/6 + 1/6 = -4/6 = -2/3', 4, 'c', '2-4-1'),
    ('2-4-1-d', '2-4', 'I', 2, 4, 1, 'I.2.4.1', 1, 1, '(-⅝) + ⅜', '-¼', NULL, '-⅝ + ⅜ = -5/8 + 3/8 = -2/8 = -1/4', 4, 'd', '2-4-1');

-- 2-4-2: Mixed number addition with variants
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level, variant_letter, exercise_base_id
) VALUES 
    ('2-4-2-a', '2-4', 'I', 2, 4, 2, 'I.2.4.2', 2, 1, '-1¾ + 2⅙', '5/12', NULL, '-1¾ + 2⅙ = -7/4 + 13/6 = -21/12 + 26/12 = 5/12', 5, 'a', '2-4-2'),
    ('2-4-2-b', '2-4', 'I', 2, 4, 2, 'I.2.4.2', 2, 1, '-1½ + 2⅓', '⅚', NULL, '-1½ + 2⅓ = -3/2 + 7/3 = -9/6 + 14/6 = 5/6', 5, 'b', '2-4-2'),
    ('2-4-2-c', '2-4', 'I', 2, 4, 2, 'I.2.4.2', 2, 1, '-2⅔ + 3¼', '7/12', NULL, '-2⅔ + 3¼ = -8/3 + 13/4 = -32/12 + 39/12 = 7/12', 5, 'c', '2-4-2'),
    ('2-4-2-d', '2-4', 'I', 2, 4, 2, 'I.2.4.2', 2, 1, '-1⅚ + 2½', '⅔', NULL, '-1⅚ + 2½ = -11/6 + 5/2 = -11/6 + 15/6 = 4/6 = 2/3', 5, 'd', '2-4-2');

-- 2-4-3: Whole number plus mixed number
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level, variant_letter, exercise_base_id
) VALUES 
    ('2-4-3-a', '2-4', 'I', 2, 4, 3, 'I.2.4.3', 3, 1, '3 + (-4⅔)', '-1⅔', NULL, '3 + (-4⅔) = 3 - 4⅔ = -1⅔', 4, 'a', '2-4-3'),
    ('2-4-3-b', '2-4', 'I', 2, 4, 3, 'I.2.4.3', 3, 1, '2 + (-3½)', '-1½', NULL, '2 + (-3½) = 2 - 3½ = -1½', 4, 'b', '2-4-3'),
    ('2-4-3-c', '2-4', 'I', 2, 4, 3, 'I.2.4.3', 3, 1, '4 + (-5¾)', '-1¾', NULL, '4 + (-5¾) = 4 - 5¾ = -1¾', 4, 'c', '2-4-3'),
    ('2-4-3-d', '2-4', 'I', 2, 4, 3, 'I.2.4.3', 3, 1, '5 + (-6⅓)', '-1⅓', NULL, '5 + (-6⅓) = 5 - 6⅓ = -1⅓', 4, 'd', '2-4-3');

-- 2-4-4: Three fraction addition
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level, variant_letter, exercise_base_id
) VALUES 
    ('2-4-4-a', '2-4', 'I', 2, 4, 4, 'I.2.4.4', 4, 1, '(-⅕) + (-⅗) + ⅖', '-⅖', NULL, '-⅕ + (-⅗) + ⅖ = -1/5 - 3/5 + 2/5 = -2/5', 4, 'a', '2-4-4'),
    ('2-4-4-b', '2-4', 'I', 2, 4, 4, 'I.2.4.4', 4, 1, '(-¼) + (-½) + ¾', '0', NULL, '-¼ + (-½) + ¾ = -1/4 - 2/4 + 3/4 = 0', 4, 'b', '2-4-4'),
    ('2-4-4-c', '2-4', 'I', 2, 4, 4, 'I.2.4.4', 4, 1, '(-⅓) + (-⅔) + ⅙', '-⅚', NULL, '-⅓ + (-⅔) + ⅙ = -2/6 - 4/6 + 1/6 = -5/6', 4, 'c', '2-4-4'),
    ('2-4-4-d', '2-4', 'I', 2, 4, 4, 'I.2.4.4', 4, 1, '(-⅛) + (-⅜) + ¼', '-¼', NULL, '-⅛ + (-⅜) + ¼ = -1/8 - 3/8 + 2/8 = -2/8 = -1/4', 4, 'd', '2-4-4');

-- ===== SECTION 2-5: Techniki dodawania (exercises 1-5) =====

-- 2-5-1: Finding opposite pairs
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '2-5-1', '2-5', 'I', 2, 5, 1, 'I.2.5.1', 1, 2,
    '(-6) + 4 + 6 + (-4) = ?', '0', 'Połącz liczby o przeciwnych znakach, aby się zniosły.', 'Sparuj liczby przeciwne: (-6 + 6) = 0 oraz (4 + -4) = 0. Cała suma to 0.', 3
);

-- Add options for 2-5-1
INSERT INTO exercise_options (exercise_id, option_text, order_index, option_value) VALUES
    ('2-5-1', '0', 1, '0'),
    ('2-5-1', '2', 2, '2'), 
    ('2-5-1', '-2', 3, '-2');

-- 2-5-2: Strategic grouping
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '2-5-2', '2-5', 'I', 2, 5, 2, 'I.2.5.2', 2, 2,
    '8 + (-3) + (-5) + 10 = ?', '10', 'Szukaj par dających 0, aby uprościć działanie.', 'Najpierw dodaj 8 i -3, otrzymasz 5. 5 + (-5) = 0, więc zostaje tylko 10.', 3
);

-- Add options for 2-5-2
INSERT INTO exercise_options (exercise_id, option_text, order_index, option_value) VALUES
    ('2-5-2', '10', 1, '10'),
    ('2-5-2', '0', 2, '0'), 
    ('2-5-2', '-10', 3, '-10');

-- 2-5-3: Complex grouping
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '2-5-3', '2-5', 'I', 2, 5, 3, 'I.2.5.3', 3, 2,
    '(-7) + (-5) + 12 + 3 = ?', '3', 'Grupuj liczby tak, by powstały zera.', 'Dodaj 12 i -5, otrzymasz 7. 7 + (-7) = 0, zostaje 3.', 3
);

-- Add options for 2-5-3
INSERT INTO exercise_options (exercise_id, option_text, order_index, option_value) VALUES
    ('2-5-3', '3', 1, '3'),
    ('2-5-3', '7', 2, '7'), 
    ('2-5-3', '-7', 3, '-7');

-- 2-5-4: Reordering strategy
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '2-5-4', '2-5', 'I', 2, 5, 4, 'I.2.5.4', 4, 2,
    '(-9) + 4 + (-1) + 6 = ?', '0', 'Zmieniając kolejność, możesz szybciej dojść do zera.', 'Dodaj -9 i 6, masz -3. -3 + 4 = 1, 1 + (-1) = 0.', 3
);

-- Add options for 2-5-4
INSERT INTO exercise_options (exercise_id, option_text, order_index, option_value) VALUES
    ('2-5-4', '0', 1, '0'),
    ('2-5-4', '-10', 2, '-10'), 
    ('2-5-4', '10', 3, '10');

-- 2-5-5: Building opposite numbers
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '2-5-5', '2-5', 'I', 2, 5, 5, 'I.2.5.5', 5, 2,
    '(-15) + 8 + 2 + 5 = ?', '0', 'Łącz dodatnie składniki, aby utworzyć liczbę przeciwną do ujemnej.', 'Połącz 8 i 2, to 10. 10 + 5 = 15. 15 + (-15) = 0.', 3
);

-- Add options for 2-5-5
INSERT INTO exercise_options (exercise_id, option_text, order_index, option_value) VALUES
    ('2-5-5', '0', 1, '0'),
    ('2-5-5', '-20', 2, '-20'), 
    ('2-5-5', '10', 3, '10');

-- ===== SECTION 2-6: Zadania z treścią (exercises 1-10) =====

-- 2-6-1: Temperature word problem
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, story, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '2-6-1', '2-6', 'I', 2, 6, 1, 'I.2.6.1', 1, 2,
    'Jaka była temperatura w południe?', 'Temperatura o godzinie 6:00 wynosiła -3°C. Do południa wzrosła o 8°C.', '5°C', 'Wzrost temperatury oznacza dodawanie: -3 + 8', NULL, 3
);

-- Add options for 2-6-1
INSERT INTO exercise_options (exercise_id, option_text, order_index, option_value) VALUES
    ('2-6-1', '5°C', 1, '5°C'),
    ('2-6-1', '11°C', 2, '11°C'), 
    ('2-6-1', '-11°C', 3, '-11°C');

-- 2-6-2: Diver word problem
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, story, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '2-6-2', '2-6', 'I', 2, 6, 2, 'I.2.6.2', 2, 2,
    'Na jakiej głębokości znajduje się teraz?', 'Nurek znajduje się 12 metrów pod powierzchnią wody. Wynurza się o 7 metrów.', '-5m', 'Pod wodą to liczby ujemne: -12 + 7', NULL, 3
);

-- Add options for 2-6-2
INSERT INTO exercise_options (exercise_id, option_text, order_index, option_value) VALUES
    ('2-6-2', '-5m', 1, '-5m'),
    ('2-6-2', '-19m', 2, '-19m'), 
    ('2-6-2', '5m', 3, '5m');

-- 2-6-3: Bank account word problem
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, story, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '2-6-3', '2-6', 'I', 2, 6, 3, 'I.2.6.3', 3, 2,
    'Ile masz teraz na koncie?', 'Na koncie bankowym masz -50 zł (debet). Wpłacasz 120 zł.', '70 zł', 'Debet to liczba ujemna: -50 + 120', NULL, 3
);

-- Add options for 2-6-3
INSERT INTO exercise_options (exercise_id, option_text, order_index, option_value) VALUES
    ('2-6-3', '70 zł', 1, '70 zł'),
    ('2-6-3', '170 zł', 2, '170 zł'), 
    ('2-6-3', '-170 zł', 3, '-170 zł');

-- 2-6-4: Game points word problem
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, story, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '2-6-4', '2-6', 'I', 2, 6, 4, 'I.2.6.4', 4, 2,
    'Ile masz punktów łącznie?', 'W grze zdobyłeś 15 punktów, potem straciłeś 9 punktów.', '6', 'Strata to odejmowanie: 15 + (-9)', NULL, 3
);

-- Add options for 2-6-4
INSERT INTO exercise_options (exercise_id, option_text, order_index, option_value) VALUES
    ('2-6-4', '6', 1, '6'),
    ('2-6-4', '24', 2, '24'), 
    ('2-6-4', '-6', 3, '-6');

-- 2-6-5: Elevator word problem
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, story, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '2-6-5', '2-6', 'I', 2, 6, 5, 'I.2.6.5', 5, 2,
    'Na którym piętrze jest teraz winda?', 'Winda jest na 3 piętrze. Jedzie 5 pięter w dół.', '-2', 'Piętra pod ziemią to liczby ujemne: 3 + (-5)', NULL, 3
);

-- Add options for 2-6-5
INSERT INTO exercise_options (exercise_id, option_text, order_index, option_value) VALUES
    ('2-6-5', '-2', 1, '-2'),
    ('2-6-5', '8', 2, '8'), 
    ('2-6-5', '2', 3, '2');

-- 2-6-6: Company quarterly profits - advanced
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, story, correct_answer, hint, explanation, difficulty_level, variant_letter, exercise_base_id
) VALUES 
    ('2-6-6-a', '2-6', 'I', 2, 6, 6, 'I.2.6.6', 6, 1, 'Jaki zysk osiągnęła firma w całym roku?', 'Firma produkująca ozdoby choinkowe odnotowała w kolejnych kwartałach roku zyski: I kwartał: -7000 zł (strata), II kwartał: -15000 zł (strata), III kwartał: -40000 zł (strata), IV kwartał: +362000 zł (zysk).', '300000 zł', NULL, '-7000 + (-15000) + (-40000) + 362000 = -62000 + 362000 = 300000', 4, 'a', '2-6-6'),
    ('2-6-6-b', '2-6', 'I', 2, 6, 6, 'I.2.6.6', 6, 1, 'Jaki zysk osiągnęła firma w całym roku?', 'Firma produkująca ozdoby choinkowe odnotowała w kolejnych kwartałach roku zyski: I kwartał: -5000 zł (strata), II kwartał: -12000 zł (strata), III kwartał: -33000 zł (strata), IV kwartał: +280000 zł (zysk).', '230000 zł', NULL, '-5000 + (-12000) + (-33000) + 280000 = -50000 + 280000 = 230000', 4, 'b', '2-6-6'),
    ('2-6-6-c', '2-6', 'I', 2, 6, 6, 'I.2.6.6', 6, 1, 'Jaki zysk osiągnęła firma w całym roku?', 'Firma produkująca ozdoby choinkowe odnotowała w kolejnych kwartałach roku zyski: I kwartał: -8000 zł (strata), II kwartał: -18000 zł (strata), III kwartał: -44000 zł (strata), IV kwartał: +400000 zł (zysk).', '330000 zł', NULL, '-8000 + (-18000) + (-44000) + 400000 = -70000 + 400000 = 330000', 4, 'c', '2-6-6'),
    ('2-6-6-d', '2-6', 'I', 2, 6, 6, 'I.2.6.6', 6, 1, 'Jaki zysk osiągnęła firma w całym roku?', 'Firma produkująca ozdoby choinkowe odnotowała w kolejnych kwartałach roku zyski: I kwartał: -6000 zł (strata), II kwartał: -14000 zł (strata), III kwartał: -35000 zł (strata), IV kwartał: +305000 zł (zysk).', '250000 zł', NULL, '-6000 + (-14000) + (-35000) + 305000 = -55000 + 305000 = 250000', 4, 'd', '2-6-6');

-- 2-6-7: Scout patrol points
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, story, correct_answer, hint, explanation, difficulty_level, variant_letter, exercise_base_id
) VALUES 
    ('2-6-7-a', '2-6', 'I', 2, 6, 7, 'I.2.6.7', 7, 1, 'Jaki był łączny wynik patrolu "Łosie"?', 'W harcerskim biegu terenowym patrol "Łosie" uzyskał punkty na poszczególnych stacjach: Samarytanka: -1 pkt (kara), Terenoznawstwo: -4 pkt (kara), Historia: 5 pkt, Przyroda: 5 pkt.', '5 punktów', NULL, '-1 + (-4) + 5 + 5 = -5 + 10 = 5', 3, 'a', '2-6-7'),
    ('2-6-7-b', '2-6', 'I', 2, 6, 7, 'I.2.6.7', 7, 1, 'Jaki był łączny wynik patrolu "Łosie"?', 'W harcerskim biegu terenowym patrol "Łosie" uzyskał punkty na poszczególnych stacjach: Samarytanka: -2 pkt (kara), Terenoznawstwo: -3 pkt (kara), Historia: 6 pkt, Przyroda: 4 pkt.', '5 punktów', NULL, '-2 + (-3) + 6 + 4 = -5 + 10 = 5', 3, 'b', '2-6-7'),
    ('2-6-7-c', '2-6', 'I', 2, 6, 7, 'I.2.6.7', 7, 1, 'Jaki był łączny wynik patrolu "Łosie"?', 'W harcerskim biegu terenowym patrol "Łosie" uzyskał punkty na poszczególnych stacjach: Samarytanka: -3 pkt (kara), Terenoznawstwo: -2 pkt (kara), Historia: 7 pkt, Przyroda: 6 pkt.', '8 punktów', NULL, '-3 + (-2) + 7 + 6 = -5 + 13 = 8', 3, 'c', '2-6-7'),
    ('2-6-7-d', '2-6', 'I', 2, 6, 7, 'I.2.6.7', 7, 1, 'Jaki był łączny wynik patrolu "Łosie"?', 'W harcerskim biegu terenowym patrol "Łosie" uzyskał punkty na poszczególnych stacjach: Samarytanka: -2 pkt (kara), Terenoznawstwo: -5 pkt (kara), Historia: 8 pkt, Przyroda: 3 pkt.', '4 punkty', NULL, '-2 + (-5) + 8 + 3 = -7 + 11 = 4', 3, 'd', '2-6-7');

-- 2-6-8: Math contest scoring
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, story, correct_answer, hint, explanation, difficulty_level, variant_letter, exercise_base_id
) VALUES 
    ('2-6-8-a', '2-6', 'I', 2, 6, 8, 'I.2.6.8', 8, 1, 'Ile punktów zdobył Tomek?', 'W konkursie matematycznym za dobrą odpowiedź otrzymuje się 4 punkty, za złą odpowiedź -1 punkt, za brak odpowiedzi 0 punktów. Tomek rozwiązał poprawnie 8 zadań, źle rozwiązał 3 zadania, a na 2 zadania nie odpowiedział.', '29 punktów', NULL, '8×4 + 3×(-1) + 2×0 = 32 - 3 + 0 = 29', 4, 'a', '2-6-8'),
    ('2-6-8-b', '2-6', 'I', 2, 6, 8, 'I.2.6.8', 8, 1, 'Ile punktów zdobył uczeń?', 'W konkursie matematycznym za dobrą odpowiedź otrzymuje się 4 punkty, za złą odpowiedź -1 punkt, za brak odpowiedzi 0 punktów. Uczeń rozwiązał poprawnie 7 zadań, źle rozwiązał 4 zadania, a na 1 zadanie nie odpowiedział.', '24 punkty', NULL, '7×4 + 4×(-1) + 1×0 = 28 - 4 + 0 = 24', 4, 'b', '2-6-8'),
    ('2-6-8-c', '2-6', 'I', 2, 6, 8, 'I.2.6.8', 8, 1, 'Ile punktów zdobył uczeń?', 'W konkursie matematycznym za dobrą odpowiedź otrzymuje się 4 punkty, za złą odpowiedź -1 punkt, za brak odpowiedzi 0 punktów. Uczeń rozwiązał poprawnie 9 zadań, źle rozwiązał 2 zadania, a na 3 zadania nie odpowiedział.', '34 punkty', NULL, '9×4 + 2×(-1) + 3×0 = 36 - 2 + 0 = 34', 4, 'c', '2-6-8');

-- 2-6-9: Temperature average problem
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, story, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '2-6-9', '2-6', 'I', 2, 6, 9, 'I.2.6.9', 9, 1,
    'Jaka była temperatura w czwartek?', 'Średnia temperatura w ciągu tygodnia wynosiła -1°C. W dni robocze temperatury były: poniedziałek +1°C, wtorek +1°C, środa +1°C, czwartek x°C, piątek -2°C. W weekend: sobota -3°C, niedziela -3°C.', '-2°C', NULL, 'Suma temperatur = 7×(-1) = -7°C. Znane: 1+1+1+(-2)+(-3)+(-3) = -5. Brakuje: -7-(-5) = -2°C', 5
);

-- 2-6-10: Diver depth changes
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, story, correct_answer, hint, explanation, difficulty_level, variant_letter, exercise_base_id
) VALUES 
    ('2-6-10-a', '2-6', 'I', 2, 6, 10, 'I.2.6.10', 10, 1, 'Na jakiej głębokości znajduje się teraz nurek?', 'Nurek zanurzył się na głębokość 18 metrów (zapisujemy jako -18 m). Następnie wynurzył się o 7 metrów, potem zanurzył się jeszcze o 5 metrów głębiej.', '-16 m', NULL, '-18 + 7 + (-5) = -18 + 7 - 5 = -16', 3, 'a', '2-6-10'),
    ('2-6-10-b', '2-6', 'I', 2, 6, 10, 'I.2.6.10', 10, 1, 'Na jakiej głębokości znajduje się teraz nurek?', 'Nurek zanurzył się na głębokość 20 metrów (zapisujemy jako -20 m). Następnie wynurzył się o 8 metrów, potem zanurzył się jeszcze o 6 metrów głębiej.', '-18 m', NULL, '-20 + 8 + (-6) = -20 + 8 - 6 = -18', 3, 'b', '2-6-10'),
    ('2-6-10-c', '2-6', 'I', 2, 6, 10, 'I.2.6.10', 10, 1, 'Na jakiej głębokości znajduje się teraz nurek?', 'Nurek zanurzył się na głębokość 15 metrów (zapisujemy jako -15 m). Następnie wynurzył się o 5 metrów, potem zanurzył się jeszcze o 8 metrów głębiej.', '-18 m', NULL, '-15 + 5 + (-8) = -15 + 5 - 8 = -18', 3, 'c', '2-6-10'),
    ('2-6-10-d', '2-6', 'I', 2, 6, 10, 'I.2.6.10', 10, 1, 'Na jakiej głębokości znajduje się teraz nurek?', 'Nurek zanurzył się na głębokość 25 metrów (zapisujemy jako -25 m). Następnie wynurzył się o 10 metrów, potem zanurzył się jeszcze o 3 metry głębiej.', '-18 m', NULL, '-25 + 10 + (-3) = -25 + 10 - 3 = -18', 3, 'd', '2-6-10');

-- ===== SECTION 3-1: Zasady mnożenia (exercises 1-13) =====

-- 3-1-1: Basic positive multiplication
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '3-1-1', '3-1', 'I', 3, 1, 1, 'I.3.1.1', 1, 1,
    '3 · 4 = ?', '12', NULL, 'Obie liczby dodatnie, wynik dodatni', 1
);

-- 3-1-2: Negative times positive
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '3-1-2', '3-1', 'I', 3, 1, 2, 'I.3.1.2', 2, 1,
    '(-3) · 4 = ?', '-12', NULL, 'Różne znaki, wynik ujemny', 1
);

-- 3-1-3: Positive times negative
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '3-1-3', '3-1', 'I', 3, 1, 3, 'I.3.1.3', 3, 1,
    '3 · (-4) = ?', '-12', NULL, 'Różne znaki, wynik ujemny', 1
);

-- 3-1-4: Negative times negative
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '3-1-4', '3-1', 'I', 3, 1, 4, 'I.3.1.4', 4, 1,
    '(-3) · (-4) = ?', '12', NULL, 'Te same znaki (oba ujemne), wynik dodatni', 1
);

-- 3-1-5: Another negative times positive
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '3-1-5', '3-1', 'I', 3, 1, 5, 'I.3.1.5', 5, 1,
    '(-5) · 6 = ?', '-30', NULL, 'Różne znaki, wynik ujemny', 1
);

-- 3-1-6: Larger negative multiplication
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '3-1-6', '3-1', 'I', 3, 1, 6, 'I.3.1.6', 6, 1,
    '(-7) · (-8) = ?', '56', NULL, 'Te same znaki, wynik dodatni', 1
);

-- 3-1-7: Positive times negative again
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '3-1-7', '3-1', 'I', 3, 1, 7, 'I.3.1.7', 7, 1,
    '9 · (-2) = ?', '-18', NULL, 'Różne znaki, wynik ujemny', 1
);

-- 3-1-8: Zero multiplication
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '3-1-8', '3-1', 'I', 3, 1, 8, 'I.3.1.8', 8, 1,
    '0 · (-15) = ?', '0', NULL, 'Zero pomnożone przez dowolną liczbę daje zero', 1
);

-- 3-1-9: Zero multiplication reverse
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '3-1-9', '3-1', 'I', 3, 1, 9, 'I.3.1.9', 9, 1,
    '(-10) · 0 = ?', '0', NULL, 'Dowolna liczba pomnożona przez zero daje zero', 1
);

-- 3-1-10: Multiply by -1
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level
) VALUES (
    '3-1-10', '3-1', 'I', 3, 1, 10, 'I.3.1.10', 10, 1,
    '(-1) · 25 = ?', '-25', NULL, 'Mnożenie przez -1 zmienia tylko znak', 1
);

-- 3-1-11: Fraction multiplication with variants
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level, variant_letter, exercise_base_id
) VALUES 
    ('3-1-11-a', '3-1', 'I', 3, 1, 11, 'I.3.1.11', 11, 1, '(-⅔) × ¾ = ?', '-½', NULL, '(-2/3) × (3/4) = -6/12 = -1/2', 4, 'a', '3-1-11'),
    ('3-1-11-b', '3-1', 'I', 3, 1, 11, 'I.3.1.11', 11, 1, '(-¾) × ⅔ = ?', '-½', NULL, '(-3/4) × (2/3) = -6/12 = -1/2', 4, 'b', '3-1-11'),
    ('3-1-11-c', '3-1', 'I', 3, 1, 11, 'I.3.1.11', 11, 1, '(-⅚) × ⅗ = ?', '-½', NULL, '(-5/6) × (3/5) = -15/30 = -1/2', 4, 'c', '3-1-11'),
    ('3-1-11-d', '3-1', 'I', 3, 1, 11, 'I.3.1.11', 11, 1, '(-⅜) × ⅔ = ?', '-¼', NULL, '(-3/8) × (2/3) = -6/24 = -1/4', 4, 'd', '3-1-11');

-- 3-1-12: Mixed number multiplication
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level, variant_letter, exercise_base_id
) VALUES 
    ('3-1-12-a', '3-1', 'I', 3, 1, 12, 'I.3.1.12', 12, 1, '(-1½) × (-⅓) = ?', '½', NULL, '(-3/2) × (-1/3) = 3/6 = 1/2', 4, 'a', '3-1-12'),
    ('3-1-12-b', '3-1', 'I', 3, 1, 12, 'I.3.1.12', 12, 1, '(-2¼) × (-⅔) = ?', '1½', NULL, '(-9/4) × (-2/3) = 18/12 = 3/2 = 1½', 4, 'b', '3-1-12'),
    ('3-1-12-c', '3-1', 'I', 3, 1, 12, 'I.3.1.12', 12, 1, '(-1⅔) × (-¾) = ?', '1¼', NULL, '(-5/3) × (-3/4) = 15/12 = 5/4 = 1¼', 4, 'c', '3-1-12'),
    ('3-1-12-d', '3-1', 'I', 3, 1, 12, 'I.3.1.12', 12, 1, '(-2⅓) × (-⅜) = ?', '⅞', NULL, '(-7/3) × (-3/8) = 21/24 = 7/8', 4, 'd', '3-1-12');

-- 3-1-13: Complex fraction multiplication
INSERT INTO exercises (
    id, section_id, division_roman, chapter_number, section_number, 
    exercise_number, full_id, order_index, input_type_id, 
    question, correct_answer, hint, explanation, difficulty_level, variant_letter, exercise_base_id
) VALUES 
    ('3-1-13-a', '3-1', 'I', 3, 1, 13, 'I.3.1.13', 13, 1, '¾ × (-2⅔) = ?', '-2', NULL, '3/4 × (-8/3) = -24/12 = -2', 4, 'a', '3-1-13'),
    ('3-1-13-b', '3-1', 'I', 3, 1, 13, 'I.3.1.13', 13, 1, '⅔ × (-3) = ?', '-2', NULL, '2/3 × (-3/1) = -6/3 = -2', 4, 'b', '3-1-13'),
    ('3-1-13-c', '3-1', 'I', 3, 1, 13, 'I.3.1.13', 13, 1, '⅝ × (-1⅗) = ?', '-1', NULL, '5/8 × (-8/5) = -40/40 = -1', 4, 'c', '3-1-13'),
    ('3-1-13-d', '3-1', 'I', 3, 1, 13, 'I.3.1.13', 13, 1, '⅚ × (-2⅖) = ?', '-2', NULL, '5/6 × (-12/5) = -60/30 = -2', 4, 'd', '3-1-13');