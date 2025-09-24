# Zadania z aplikacji MATMA - Treści hardcoded z git

Poniżej znajdują się wszystkie zadania z czasów gdy były jeszcze zahardcodowane w komponentach React. Dane pochodzą z commit 8f7f161 (przed migracją do bazy danych).

---

## Rozdział 1: Liczby całkowite

### 1.1 Liczby na osi liczbowej

**Opis:** Naucz się umieszczać liczby całkowite na osi liczbowej

**Wskazówki:**
- Oś liczbowa to linia, na której liczby są uporządkowane od najmniejszej do największej
- Liczby ujemne znajdują się po lewej stronie zera
- Liczby dodatnie znajdują się po prawej stronie zera
- Im dalej na prawo, tym liczba jest większa
- Zero jest większe od wszystkich liczb ujemnych i mniejsze od wszystkich dodatnich

**Zadania:**

1. **1-1-1**: Która liczba znajduje się 3 jednostki na prawo od zera?
   - **Odpowiedź:** 3
   - **Typ:** Oś liczbowa (zakres: -2 do 7)

2. **1-1-2**: Która liczba znajduje się 5 jednostek na lewo od zera?
   - **Odpowiedź:** -5
   - **Typ:** Oś liczbowa (zakres: -7 do 2)

3. **1-1-3**: Wskaż liczbę -3 na osi liczbowej.
   - **Odpowiedź:** -3
   - **Typ:** Oś liczbowa (zakres: -5 do 5)

4. **1-1-4**: Która liczba jest większa: -2 czy -7?
   - **Odpowiedź:** -2
   - **Typ:** Oś liczbowa (zakres: -9 do 2)

5. **1-1-5**: Znajdź liczbę, która znajduje się dokładnie pomiędzy -4 i 2.
   - **Odpowiedź:** -1
   - **Typ:** Oś liczbowa (zakres: -5 do 3)

6. **1-1-6**: Wskaż liczbę 5 na osi liczbowej.
   - **Odpowiedź:** 5
   - **Typ:** Oś liczbowa (zakres: -2 do 7)

7. **1-1-7**: Która liczba znajduje się 8 jednostek na prawo od -3?
   - **Odpowiedź:** 5
   - **Typ:** Oś liczbowa (zakres: -5 do 7)

---

### 1.2 Porównywanie liczb

**Opis:** Naucz się porównywać liczby całkowite używając znaków <, = i >

**Wskazówki:**
- Im bardziej na prawo na osi, tym liczba większa
- Liczby dodatnie są zawsze większe od liczb ujemnych
- Zero jest większe od wszystkich liczb ujemnych
- Z dwóch liczb ujemnych większa jest ta bliższa zeru
- Przykład: -2 > -5 bo -2 jest bliżej zera

**Zadania:**

1. **1-2-1**: Porównaj liczby: -3 ? 2
   - **Odpowiedź:** <
   - **Opcje:** <, =, >
   - **Wskazówka:** Każda liczba ujemna jest mniejsza od każdej liczby dodatniej.

2. **1-2-2**: Porównaj liczby: 5 ? -1
   - **Odpowiedź:** >
   - **Opcje:** <, =, >
   - **Wskazówka:** Liczby dodatnie są zawsze większe od ujemnych.

3. **1-2-3**: Porównaj liczby: -7 ? -4
   - **Odpowiedź:** <
   - **Opcje:** <, =, >
   - **Wskazówka:** Z dwóch liczb ujemnych większa jest ta, która jest bliżej zera.

4. **1-2-4**: Porównaj liczby: -2 ? -8
   - **Odpowiedź:** >
   - **Opcje:** <, =, >
   - **Wskazówka:** -2 jest bliżej zera niż -8, więc jest większe.

5. **1-2-5**: Porównaj liczby: 0 ? -5
   - **Odpowiedź:** >
   - **Opcje:** <, =, >
   - **Wskazówka:** Zero jest większe od każdej liczby ujemnej.

6. **1-2-6**: Porównaj liczby: -3 ? -3
   - **Odpowiedź:** =
   - **Opcje:** <, =, >
   - **Wskazówka:** To ta sama liczba, więc są sobie równe.

7. **1-2-7**: Porównaj liczby: 4 ? 7
   - **Odpowiedź:** <
   - **Opcje:** <, =, >
   - **Wskazówka:** Na osi liczbowej 4 znajduje się po lewej stronie od 7.

---

### 1.3 Liczby przeciwne

**Opis:** Poznaj pojęcie liczby przeciwnej i odwrotnej

**Wskazówki:**
- Liczba przeciwna to liczba o tej samej wartości bezwzględnej, ale przeciwnym znaku
- Liczba przeciwna do a to -a
- Suma liczby i jej liczby przeciwnej wynosi 0
- Liczba przeciwna do 0 to 0
- Liczba odwrotna to 1 podzielone przez tę liczbę

**Zadania:**

1. **1-3-1**: Znajdź liczbę przeciwną do 5
   - **Odpowiedź:** -5
   - **Typ:** Pole tekstowe

2. **1-3-2**: Znajdź liczbę przeciwną do -3
   - **Odpowiedź:** 3
   - **Typ:** Pole tekstowe

3. **1-3-3**: Znajdź liczbę przeciwną do -8
   - **Odpowiedź:** 8
   - **Typ:** Pole tekstowe

4. **1-3-4**: Znajdź liczbę przeciwną do 12
   - **Odpowiedź:** -12
   - **Typ:** Pole tekstowe

5. **1-3-5**: Znajdź liczbę przeciwną do 0
   - **Odpowiedź:** 0
   - **Typ:** Pole tekstowe

6. **1-3-6**: Znajdź liczbę odwrotną do 2
   - **Odpowiedź:** 1/2
   - **Typ:** Pole tekstowe

7. **1-3-7**: Znajdź liczbę odwrotną do 1/3
   - **Odpowiedź:** 3
   - **Typ:** Pole tekstowe

---

### 1.4 Wartość bezwzględna

**Opis:** Naucz się obliczać wartość bezwzględną liczb

**Wskazówki:**
- Wartość bezwzględna to odległość liczby od zera na osi liczbowej
- Wartość bezwzględna jest zawsze nieujemna
- |a| = a dla a ≥ 0, |a| = -a dla a < 0
- Liczby przeciwne mają tę samą wartość bezwzględną
- Im większa wartość bezwzględna, tym liczba jest dalej od zera

**Zadania:**

1. **1-4-1**: Znajdź wartość bezwzględną liczby -7
   - **Odpowiedź:** 7
   - **Typ:** Pole tekstowe

2. **1-4-2**: Ile wynosi |5|?
   - **Odpowiedź:** 5
   - **Typ:** Pole tekstowe

3. **1-4-3**: Oblicz |-12|
   - **Odpowiedź:** 12
   - **Typ:** Pole tekstowe

4. **1-4-4**: Która liczba ma większą wartość bezwzględną: -8 czy 6?
   - **Odpowiedź:** -8
   - **Typ:** Pole tekstowe

5. **1-4-5**: Ile wynosi |0|?
   - **Odpowiedź:** 0
   - **Typ:** Pole tekstowe

6. **1-4-6**: Znajdź liczbę, której wartość bezwzględna wynosi 15
   - **Odpowiedź:** 15
   - **Typ:** Pole tekstowe

7. **1-4-7**: Która liczba jest dalej od zera: -10 czy 9?
   - **Odpowiedź:** -10
   - **Typ:** Pole tekstowe

---

### 1.5 Zbiór liczb całkowitych

**Opis:** Poznaj oznaczenia i własności zbioru liczb całkowitych

**Wskazówki:**
- Z - zbiór liczb całkowitych (..., -2, -1, 0, 1, 2, ...)
- N - zbiór liczb naturalnych (0, 1, 2, 3, ...)
- Z+ - liczby całkowite dodatnie (1, 2, 3, ...)
- Z- - liczby całkowite ujemne (-1, -2, -3, ...)
- Liczby przeciwne: a + (-a) = 0

**Zadania:**

1. **1-5-1**: Wskaż symbol oznaczający zbiór wszystkich liczb całkowitych.
   - **Odpowiedź:** Z
   - **Opcje:** Z, N, Q
   - **Wyjaśnienie:** Litera Z (z niemieckiego Zahlen) opisuje całą rodzinę liczb całkowitych.

2. **1-5-2**: Który zestaw zawiera wyłącznie liczby należące do zbioru Z?
   - **Odpowiedź:** -4, 0, 7
   - **Opcje:** -4, 0, 7 | -1/2, 0, 5/2 | π, 1, -3/2
   - **Wyjaśnienie:** Liczby całkowite to wartości bez części ułamkowej: ..., -2, -1, 0, 1, 2, ...

3. **1-5-3**: Jak nazywamy część zbioru Z złożoną z liczb większych od zera?
   - **Odpowiedź:** Z+
   - **Opcje:** Z+, Z-, N-
   - **Wyjaśnienie:** Z+ oznacza liczby całkowite dodatnie: 1, 2, 3, ...

4. **1-5-4**: Która para tworzy liczby przeciwne należące do Z?
   - **Odpowiedź:** -6 i 6
   - **Opcje:** -6 i 6 | 2 i 5 | -4 i -4
   - **Wyjaśnienie:** Liczby przeciwne to pary liczb, których suma daje zero.

5. **1-5-5**: W którym przedziale znajdują się liczby całkowite 1, 2, 3, ... , 9?
   - **Odpowiedź:** [1, 9]
   - **Opcje:** (0, 10) | [1, 9] | (0, 9]
   - **Wyjaśnienie:** Nawias kwadratowy [ ] oznacza, że liczba brzegowa należy do przedziału.

6. **1-5-6**: Jakie liczby całkowite są większe od -3 i mniejsze od 2?
   - **Odpowiedź:** -2, -1, 0, 1
   - **Opcje:** -2, -1, 0, 1 | -3, -2, -1, 0, 1, 2 | -2, -1, 0
   - **Wyjaśnienie:** Szukamy liczb całkowitych spełniających: -3 < x < 2, czyli x ∈ {-2, -1, 0, 1}.

7. **1-5-7**: Czym różni się zbiór N od zbioru Z+?
   - **Odpowiedź:** N zawiera zero, Z+ nie
   - **Opcje:** N zawiera zero, Z+ nie | Z+ zawiera zero, N nie | Nie ma różnicy
   - **Wyjaśnienie:** N = {0, 1, 2, 3, ...}, natomiast Z+ = {1, 2, 3, ...} (bez zera).

---

## Rozdział 2: Dodawanie liczb całkowitych

### 2.1 Zasady dodawania

**Opis:** Utrwal zasady dodawania liczb całkowitych o różnych znakach

**Wskazówki:**
- Liczby o tym samym znaku dodajemy, zachowując ich znak
- Przy przeciwnych znakach odejmujemy moduły i bierzemy znak liczby o większym module
- Liczby przeciwne zawsze dają w sumie zero

**Zadania:**

1. **2-1-1**: (-3) + (-5) = ?
   - **Odpowiedź:** -8
   - **Opcje:** -8, -2, 2
   - **Wyjaśnienie:** Liczby mają ten sam znak, więc dodajemy moduły: 3 + 5 = 8 i zachowujemy znak minus.
   - **Wskazówka:** Przy tym samym znaku dodaj moduły i zachowaj znak liczb.

2. **2-1-2**: 7 + (-4) = ?
   - **Odpowiedź:** 3
   - **Opcje:** 11, 3, -3
   - **Wyjaśnienie:** Znaki są różne. Odejmij mniejszy moduł od większego: 7 - 4 = 3. Wynik ma znak liczby o większym module, czyli dodatni.
   - **Wskazówka:** Porównaj, która liczba jest dalej od zera.

3. **2-1-3**: (-12) + 9 = ?
   - **Odpowiedź:** -3
   - **Opcje:** -21, -3, 21
   - **Wyjaśnienie:** Moduły różnią się o 3. Większy moduł ma liczba ujemna, więc wynik jest -3.
   - **Wskazówka:** 12 jest dalej od zera niż 9, dlatego wynik będzie ujemny.

4. **2-1-4**: 15 + 8 = ?
   - **Odpowiedź:** 23
   - **Opcje:** 7, 23, -23
   - **Wyjaśnienie:** Dodajemy dwa dodatnie składniki: 15 + 8 = 23.
   - **Wskazówka:** Przy tym samym znaku po prostu dodaj wartości.

5. **2-1-5**: (-6) + (-9) = ?
   - **Odpowiedź:** -15
   - **Opcje:** -15, 15, -3
   - **Wyjaśnienie:** Suma liczb ujemnych to liczba ujemna. 6 + 9 = 15, więc wynik to -15.
   - **Wskazówka:** Dodaj moduły, znak pozostaje ujemny.

6. **2-1-6**: (-4) + 4 = ?
   - **Odpowiedź:** 0
   - **Opcje:** 8, 0, -8
   - **Wyjaśnienie:** Liczby przeciwne sumują się do zera.
   - **Wskazówka:** Gdy liczby są przeciwne, znoszą się.

---

### 2.2 Techniki dodawania

**Opis:** Poznaj sprytne metody dodawania wielu liczb całkowitych

**Wskazówki:**
- Zmiana kolejności składników nie wpływa na wynik (łączność i przemienność)
- Warto wyszukiwać par liczb przeciwnych, które dają 0
- Można grupować dodatnie liczby, by zbudować liczbę przeciwną do ujemnej

**Zadania:**

1. **2-2-1**: (-6) + 4 + 6 + (-4) = ?
   - **Odpowiedź:** 0
   - **Opcje:** 0, 2, -2
   - **Wyjaśnienie:** Sparuj liczby przeciwne: (-6 + 6) = 0 oraz (4 + -4) = 0. Cała suma to 0.
   - **Wskazówka:** Połącz liczby o przeciwnych znakach, aby się zniosły.

2. **2-2-2**: 8 + (-3) + (-5) + 10 = ?
   - **Odpowiedź:** 10
   - **Opcje:** 10, 0, -10
   - **Wyjaśnienie:** Najpierw dodaj 8 i -3, otrzymasz 5. 5 + (-5) = 0, więc zostaje tylko 10.
   - **Wskazówka:** Szukaj par dających 0, aby uprościć działanie.

3. **2-2-3**: (-7) + (-5) + 12 + 3 = ?
   - **Odpowiedź:** 3
   - **Opcje:** 3, 7, -7
   - **Wyjaśnienie:** Dodaj 12 i -5, otrzymasz 7. 7 + (-7) = 0, zostaje 3.
   - **Wskazówka:** Grupuj liczby tak, by powstały zera.

4. **2-2-4**: (-9) + 4 + (-1) + 6 = ?
   - **Odpowiedź:** 0
   - **Opcje:** 0, -10, 10
   - **Wyjaśnienie:** Dodaj -9 i 6, masz -3. -3 + 4 = 1, 1 + (-1) = 0.
   - **Wskazówka:** Zmieniając kolejność, możesz szybciej dojść do zera.

5. **2-2-5**: (-15) + 8 + 2 + 5 = ?
   - **Odpowiedź:** 0
   - **Opcje:** 0, -20, 10
   - **Wyjaśnienie:** Połącz 8 i 2, to 10. 10 + 5 = 15. 15 + (-15) = 0.
   - **Wskazówka:** Łącz dodatnie składniki, aby utworzyć liczbę przeciwną do ujemnej.

---

### 2.3 Zadania z treścią

**Opis:** Zastosuj dodawanie liczb całkowitych w praktycznych sytuacjach

**Wskazówki:**
- Wzrost, zysk, w górę = dodawanie liczby dodatniej
- Spadek, strata, w dół = dodawanie liczby ujemnej
- Pod ziemią/wodą = liczby ujemne
- Nad ziemią/wodą = liczby dodatnie

**Zadania:**

1. **2-3-1**: 
   - **Treść:** Temperatura o godzinie 6:00 wynosiła -3°C. Do południa wzrosła o 8°C.
   - **Pytanie:** Jaka była temperatura w południe?
   - **Odpowiedź:** 5°C
   - **Opcje:** 5°C, 11°C, -11°C
   - **Wskazówka:** Wzrost temperatury oznacza dodawanie: -3 + 8

2. **2-3-2**: 
   - **Treść:** Nurek znajduje się 12 metrów pod powierzchnią wody. Wynurza się o 7 metrów.
   - **Pytanie:** Na jakiej głębokości znajduje się teraz?
   - **Odpowiedź:** -5m
   - **Opcje:** -5m, -19m, 5m
   - **Wskazówka:** Pod wodą to liczby ujemne: -12 + 7

3. **2-3-3**: 
   - **Treść:** Na koncie bankowym masz -50 zł (debet). Wpłacasz 120 zł.
   - **Pytanie:** Ile masz teraz na koncie?
   - **Odpowiedź:** 70 zł
   - **Opcje:** 70 zł, 170 zł, -170 zł
   - **Wskazówka:** Debet to liczba ujemna: -50 + 120

4. **2-3-4**: 
   - **Treść:** W grze zdobyłeś 15 punktów, potem straciłeś 9 punktów.
   - **Pytanie:** Ile masz punktów łącznie?
   - **Odpowiedź:** 6
   - **Opcje:** 6, 24, -6
   - **Wskazówka:** Strata to odejmowanie: 15 + (-9)

5. **2-3-5**: 
   - **Treść:** Winda jest na 3 piętrze. Jedzie 5 pięter w dół.
   - **Pytanie:** Na którym piętrze jest teraz winda?
   - **Odpowiedź:** -2
   - **Opcje:** -2, 8, 2
   - **Wskazówka:** Piętra pod ziemią to liczby ujemne: 3 + (-5)

---

## Podsumowanie

**Łączna liczba zadań:** 41

**Rozkład:**
- Rozdział 1: 29 zadań (5 sekcji)
- Rozdział 2: 16 zadań (3 sekcje)

**Typy zadań:**
- Wybór wielokrotny: 27 zadań
- Pole tekstowe: 7 zadań  
- Oś liczbowa: 7 zadań

**Źródło:** Dane wyekstraktowane z commit 8f7f161 - ostatni commit z hardcoded exercise data przed migracją do bazy danych.