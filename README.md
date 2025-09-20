# MATMA - Portal Edukacyjny do Nauki Matematyki

## O projekcie

Projekt łączy tradycyjną naukę matematyki z książki z równoległym tworzeniem nowoczesnego portalu edukacyjnego. Powstaje w trakcie przygotowań mojego dziecka do klasówki z liczb całkowitych (6. klasa szkoły podstawowej).

### Podwójny cel
1. **Nauka tradycyjna**: Przygotowanie dziecka do klasówki według planu 4-dniowego
2. **Rozwój technologiczny**: Budowa portalu wspierającego naukę matematyki

## Funkcjonalności portalu

### MVP (Minimum Viable Product)
- Generator zadań z liczbami całkowitymi
- Stopniowanie trudności (łatwy → średni → trudny)
- Śledzenie postępów i wyników
- Zadania z treścią osadzone w kontekście życiowym

### Planowane rozszerzenia
- Asystent AI do wyjaśniania błędów
- System adaptacyjny dostosowujący poziom trudności
- Wizualizacje na osi liczbowej
- Gamifikacja (punkty, osiągnięcia, rankingi)

## Stack technologiczny

### Frontend
- React z TypeScript
- shadcn/ui - komponenty UI
- Tailwind CSS

### Backend
- Node.js + Express
- SQLite (development)
- Supabase (production)

### Deployment
- Vercel (docelowo)

## Struktura projektu

```
matma/
├── docs/               # Dokumentacja i strategie nauki
│   ├── strategia_1.md  # Pierwszy plan nauki (4-dniowy)
│   └── strategia_2.md  # Zoptymalizowana strategia po konsultacji AI
├── src/                # Kod źródłowy aplikacji
├── main.py            # Legacy - wersja CLI w Pythonie
└── README.md          # Ten plik
```

## Harmonogram

### Faza 1: Przygotowanie do klasówki (4 dni)
- Sobota-Wtorek: Intensywna nauka według strategii
- Środa: Klasówka

### Faza 2: Rozwój portalu (równolegle)
- MVP przed klasówką
- Iteracyjny rozwój funkcjonalności
- Testy z rzeczywistym użytkownikiem (dziecko)

## Materiał edukacyjny

Portal pokrywa następujące zagadnienia z liczb całkowitych:
- Liczby na osi, porównywanie
- Liczby przeciwne i odwrotne, wartość bezwzględna
- Dodawanie liczb całkowitych
- Mnożenie i dzielenie liczb całkowitych
- Odejmowanie liczb całkowitych
- Własności działań
- Zadania z treścią (geografia, życie codzienne, humor)

## Uruchomienie

```bash
# Tymczasowo - stara wersja CLI
python3 main.py

# Docelowo
npm install
npm run dev
```

## Kontakt i rozwój

Projekt open source. Powstaje jako praktyczne narzędzie edukacyjne z prawdziwą wartością dla uczniów.