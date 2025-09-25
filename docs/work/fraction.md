# Fraction Class Test Plan

## Overview
Comprehensive test plan for the Clojure-style Fraction class implementation.

## Test Categories

### 1. Construction & Normalization
- [ ] Create fraction from numerator and denominator
- [ ] Auto-reduction via GCD (2/4 → 1/2)
- [ ] Sign normalization (1/-3 → -1/3)
- [ ] Whole number optimization (5/1 → 5)
- [ ] Zero handling (0/5 → 0/1)
- [ ] Divide by zero error

### 2. Parsing
- [ ] Parse simple fractions: "1/3", "2/5"
- [ ] Parse negative fractions: "-1/3", "-2/5"
- [ ] Parse whole numbers: "5", "-3"
- [ ] Parse mixed numbers: "2 1/3", "-1 3/4"
- [ ] Parse decimals: "0.5" → 1/2, "0.333..." → 1/3
- [ ] Parse Unicode fractions: "½", "⅓", "⅔"
- [ ] Parse mixed Unicode: "2⅓", "1½"
- [ ] Invalid input returns null

### 3. Arithmetic Operations
#### Addition
- [ ] 1/3 + 1/3 = 2/3
- [ ] 1/2 + 1/4 = 3/4
- [ ] 2/3 + 1/6 = 5/6
- [ ] Mixed: 1½ + 2⅓
- [ ] Negative: -1/3 + 1/2

#### Subtraction
- [ ] 2/3 - 1/3 = 1/3
- [ ] 1/2 - 1/4 = 1/4
- [ ] 1/3 - 1/2 = -1/6

#### Multiplication
- [ ] 1/2 × 1/3 = 1/6
- [ ] 2/3 × 3/4 = 1/2
- [ ] 3 × 2/3 = 2

#### Division
- [ ] 1/2 ÷ 1/3 = 3/2
- [ ] 2/3 ÷ 2 = 1/3
- [ ] Division by zero error

### 4. Equivalence Testing
- [ ] 1/2 equals 2/4 (reduction)
- [ ] 1/2 equals 0.5 (decimal)
- [ ] ½ equals "1/2" (Unicode)
- [ ] 4/3 equals "1 1/3" (mixed)
- [ ] -1/2 equals "-0.5"
- [ ] Different fractions not equal

### 5. Conversion Functions
#### toDecimal()
- [ ] 1/3 → 0.333...
- [ ] 1/2 → 0.5
- [ ] 5/4 → 1.25
- [ ] -2/3 → -0.666...

#### toString()
- [ ] 1/3 → "1/3"
- [ ] 5/1 → "5"
- [ ] -2/3 → "-2/3"

#### toUnicode()
- [ ] 1/3 → "⅓"
- [ ] 2/3 → "⅔"
- [ ] 7/3 → "2⅓" (mixed)
- [ ] 2/7 → "2/7" (no Unicode)
- [ ] 5/1 → "5"

#### toMixedNumber()
- [ ] 7/3 → {whole: 2, fraction: 1/3}
- [ ] 1/3 → {whole: 0, fraction: 1/3}
- [ ] 5/1 → {whole: 5, fraction: null}

### 6. Static Methods
#### fromDecimal()
- [ ] 0.5 → 1/2
- [ ] 0.333... → 1/3 (with denominator hint)
- [ ] 0.25 → 1/4
- [ ] 1.5 → 3/2
- [ ] 2.333... → 7/3 (with denominator = 3)

#### areEquivalent()
- [ ] String vs string: "1/2" = "2/4"
- [ ] Number vs string: 0.5 = "1/2"
- [ ] Fraction vs string: Fraction(1,2) = "½"
- [ ] Mixed formats: "1 1/3" = 1.333... = "4/3"

### 7. Edge Cases
- [ ] Very large fractions (overflow protection)
- [ ] Very small fractions (underflow)
- [ ] Irrational approximations (π, e)
- [ ] Negative zero handling
- [ ] Empty string parsing
- [ ] Malformed input strings

### 8. Integration Tests
- [ ] Number line displays correct Unicode
- [ ] Exercise validation accepts equivalent answers
- [ ] Database values parse correctly
- [ ] User input feedback shows Unicode

## Test Implementation Structure

```typescript
describe('Fraction', () => {
  describe('Construction', () => {
    test('reduces fractions via GCD', () => {
      const f = new Fraction(2, 4);
      expect(f.numerator).toBe(1);
      expect(f.denominator).toBe(2);
    });
    // ... more tests
  });
  
  describe('Parsing', () => {
    // ... tests
  });
  
  describe('Arithmetic', () => {
    // ... tests
  });
  
  // ... more categories
});
```

## Coverage Goals
- Line coverage: 100%
- Branch coverage: 95%+
- Edge case coverage: All identified cases
- Integration coverage: All touch points

## Test Data Sets

### Common Fractions
- Halves: 1/2
- Thirds: 1/3, 2/3
- Quarters: 1/4, 3/4
- Fifths: 1/5, 2/5, 3/5, 4/5
- Sixths: 1/6, 5/6
- Eighths: 1/8, 3/8, 5/8, 7/8

### Exercise Answers
- 5/3 (1⅔)
- 7/3 (2⅓)
- 4/3 (1⅓)
- -2/3 (-⅔)
- 3/2 (1½)
- 5/2 (2½)

### Problem Cases
- 0.333333 (should be 1/3)
- 0.666667 (should be 2/3)
- 1.333333 (should be 4/3)
- 2.333333 (should be 7/3)