# Zadania z aplikacji MATMA - Kompletny zestaw

Poniżej znajduje się kompletny zestaw zadań do aplikacji MATMA dla klasy 6, oparty na:
- Oryginalnych zadaniach z docs/work/zadania.md
- Skanach podręcznika z docs/scan/
- Strukturze bazy danych matma.db

---

---

## Struktura dla bazy danych

Każde zadanie powinno zawierać:
- **id**: Unikalny identyfikator (np. "1-1-1-a" dla wariantu)
- **section_id**: ID sekcji (np. "1-1")
- **exercise_base_id**: ID bazowego zadania (dla wariantów)
- **variant_letter**: Litera wariantu (a, b, c, d)
- **question**: Treść pytania
- **story**: Treść zadania tekstowego (opcjonalne)
- **correct_answer**: Prawidłowa odpowiedź
- **hint**: Wskazówka (opcjonalne)
- **explanation**: Wyjaśnienie (opcjonalne)
- **input_type_id**: ID typu odpowiedzi (1=text, 2=choices, 3=number-line)
- **options**: Opcje do wyboru (dla choices)
- **difficulty_level**: Poziom trudności (1-5)
- **order_index**: Kolejność w sekcji

## Mapowanie poziomów trudności

- **Poziom 1**: Podstawowy (zadania 1-1 do 1-5)
- **Poziom 2**: Średni - Poziom A i B ze skanów
- **Poziom 3**: Zaawansowany - Poziom C ze skanów  
- **Poziom 4**: Trudny - Poziom D ze skanów
- **Poziom 5**: Mistrzowski - Poziom MISTRZ ze skanów

## Mapowanie input_type na input_type_id

W bazie danych używamy ID zamiast nazw tekstowych:
- `input_type_id = 1` dla typu "text" (pole tekstowe)
- `input_type_id = 2` dla typu "choices" (wybór wielokrotny)
- `input_type_id = 3` dla typu "number-line" (oś liczbowa)

## Kolejność zadań (order_index)

Dla każdej sekcji numeracja zaczyna się od 1:
- Sekcja 1-1: zadania 1-11
- Sekcja 1-2: zadania 1-3
- Sekcja 1-3: zadania 1-7
- Sekcja 1-4: zadania 1-13
- Sekcja 1-5: zadania 1-16
- Sekcja 2-1: zadania 1-6
- Sekcja 2-2: zadania 1-7
- Sekcja 2-3: zadania 1-6
- Sekcja 2-4: zadania 1-4
- Sekcja 2-5: zadania 1-5
- Sekcja 2-6: zadania 1-10
- Sekcja 3-1: zadania 1-13
- Sekcja 3-2: zadania 1-5
- Sekcja 3-3: zadania 1-3
- Sekcja 4-1: zadania 1-13
- Sekcja 4-2: zadania 1-3
- Sekcja 5-1: zadania 1-10
- Sekcja 5-2: zadania 1-5
- Sekcja 5-3: zadania 1-4
- Sekcja 5-4: zadania 1-7
- Sekcja 6-1: zadania 1-10
- Sekcja 7-1: zadania 1-9
- Sekcja 7-2: zadania 1-8
- Sekcja 7-3: zadania 1-8

## Spis rozdziałów

- [Rozdział 1: Liczby całkowite](zadania_1.md)
- [Rozdział 2: Dodawanie liczb całkowitych](zadania_2.md)
- [Rozdział 3: Mnożenie liczb całkowitych](zadania_3.md)
- [Rozdział 4: Dzielenie liczb całkowitych](zadania_4.md)
- [Rozdział 5: Odejmowanie liczb całkowitych](zadania_5.md)
- [Rozdział 6: Działania łączone i kolejność wykonywania działań](zadania_6.md)
- [Rozdział 7: Powtórki i zadania dodatkowe](zadania_7.md)
