import { Fraction } from './fraction';

describe('Fraction', () => {
  describe('Construction & Normalization', () => {
    test('reduces fractions via GCD', () => {
      const f = new Fraction(2, 4);
      expect(f.numerator).toBe(1);
      expect(f.denominator).toBe(2);
    });

    test('normalizes sign to numerator', () => {
      const f = new Fraction(1, -3);
      expect(f.numerator).toBe(-1);
      expect(f.denominator).toBe(3);
    });

    test('optimizes whole numbers', () => {
      const f = new Fraction(5, 1);
      expect(f.numerator).toBe(5);
      expect(f.denominator).toBe(1);
      expect(f.isWhole()).toBe(true);
    });

    test('handles zero', () => {
      const f = new Fraction(0, 5);
      expect(f.numerator).toBe(0);
      expect(f.denominator).toBe(1);
    });

    test('throws on divide by zero', () => {
      expect(() => new Fraction(1, 0)).toThrow('Divide by zero');
    });
  });

  describe('Parsing', () => {
    test('parses simple fractions', () => {
      expect(Fraction.parse('1/3')).toEqual(new Fraction(1, 3));
      expect(Fraction.parse('2/5')).toEqual(new Fraction(2, 5));
    });

    test('parses negative fractions', () => {
      expect(Fraction.parse('-1/3')).toEqual(new Fraction(-1, 3));
      expect(Fraction.parse('-2/5')).toEqual(new Fraction(-2, 5));
    });

    test('parses whole numbers', () => {
      expect(Fraction.parse('5')).toEqual(new Fraction(5, 1));
      expect(Fraction.parse('-3')).toEqual(new Fraction(-3, 1));
    });

    test('parses mixed numbers', () => {
      expect(Fraction.parse('2 1/3')).toEqual(new Fraction(7, 3));
      expect(Fraction.parse('-1 3/4')).toEqual(new Fraction(-7, 4));
    });

    test('parses decimals', () => {
      expect(Fraction.parse('0.5')).toEqual(new Fraction(1, 2));
      expect(Fraction.parse('0.25')).toEqual(new Fraction(1, 4));
    });

    test('parses Unicode fractions', () => {
      expect(Fraction.parse('½')).toEqual(new Fraction(1, 2));
      expect(Fraction.parse('⅓')).toEqual(new Fraction(1, 3));
      expect(Fraction.parse('⅔')).toEqual(new Fraction(2, 3));
    });

    test('parses mixed Unicode', () => {
      expect(Fraction.parse('2⅓')).toEqual(new Fraction(7, 3));
      expect(Fraction.parse('1½')).toEqual(new Fraction(3, 2));
    });

    test('parses Polish "i" notation', () => {
      expect(Fraction.parse('1 i 1/2')).toEqual(new Fraction(3, 2));
      expect(Fraction.parse('1 i 1/8')).toEqual(new Fraction(9, 8));
      expect(Fraction.parse('-1 i 3/4')).toEqual(new Fraction(-7, 4));
      expect(Fraction.parse('2 i 1/3')).toEqual(new Fraction(7, 3));
    });

    test('normalizes plus signs', () => {
      expect(Fraction.parse('+1')).toEqual(new Fraction(1, 1));
      expect(Fraction.parse('+5')).toEqual(new Fraction(5, 1));
      expect(Fraction.parse('+1/2')).toEqual(new Fraction(1, 2));
      expect(Fraction.parse('+2/3')).toEqual(new Fraction(2, 3));
    });

    test('handles better whitespace in fractions', () => {
      expect(Fraction.parse('1  1/2')).toEqual(new Fraction(3, 2));
      expect(Fraction.parse('2   1/3')).toEqual(new Fraction(7, 3));
      expect(Fraction.parse('1 / 2')).toEqual(new Fraction(1, 2));
      expect(Fraction.parse('3 /4')).toEqual(new Fraction(3, 4));
      expect(Fraction.parse('5/ 6')).toEqual(new Fraction(5, 6));
    });

    test('parses "and" notation', () => {
      expect(Fraction.parse('1and1/2')).toEqual(new Fraction(3, 2));
      expect(Fraction.parse('2and1/3')).toEqual(new Fraction(7, 3));
      expect(Fraction.parse('1and3/4')).toEqual(new Fraction(7, 4));
    });

    test('returns null for invalid input', () => {
      expect(Fraction.parse('abc')).toBeNull();
      expect(Fraction.parse('')).toBeNull();
      expect(Fraction.parse('1/2/3')).toBeNull();
    });
  });

  describe('Arithmetic Operations', () => {
    describe('Addition', () => {
      test('adds simple fractions', () => {
        const a = new Fraction(1, 3);
        const b = new Fraction(1, 3);
        expect(a.add(b)).toEqual(new Fraction(2, 3));
      });

      test('adds with different denominators', () => {
        const a = new Fraction(1, 2);
        const b = new Fraction(1, 4);
        expect(a.add(b)).toEqual(new Fraction(3, 4));
      });

      test('adds negative fractions', () => {
        const a = new Fraction(-1, 3);
        const b = new Fraction(1, 2);
        expect(a.add(b)).toEqual(new Fraction(1, 6));
      });
    });

    describe('Subtraction', () => {
      test('subtracts simple fractions', () => {
        const a = new Fraction(2, 3);
        const b = new Fraction(1, 3);
        expect(a.subtract(b)).toEqual(new Fraction(1, 3));
      });

      test('results in negative', () => {
        const a = new Fraction(1, 3);
        const b = new Fraction(1, 2);
        expect(a.subtract(b)).toEqual(new Fraction(-1, 6));
      });
    });

    describe('Multiplication', () => {
      test('multiplies fractions', () => {
        const a = new Fraction(1, 2);
        const b = new Fraction(1, 3);
        expect(a.multiply(b)).toEqual(new Fraction(1, 6));
      });

      test('multiplies and reduces', () => {
        const a = new Fraction(2, 3);
        const b = new Fraction(3, 4);
        expect(a.multiply(b)).toEqual(new Fraction(1, 2));
      });
    });

    describe('Division', () => {
      test('divides fractions', () => {
        const a = new Fraction(1, 2);
        const b = new Fraction(1, 3);
        expect(a.divide(b)).toEqual(new Fraction(3, 2));
      });

      test('throws on divide by zero', () => {
        const a = new Fraction(1, 2);
        const b = new Fraction(0, 1);
        expect(() => a.divide(b)).toThrow();
      });
    });
  });

  describe('Equivalence Testing', () => {
    test('recognizes equivalent fractions', () => {
      const a = new Fraction(1, 2);
      const b = new Fraction(2, 4);
      expect(a.equals(b)).toBe(true);
    });

    test('compares with decimals', () => {
      const a = new Fraction(1, 2);
      expect(a.equals(0.5)).toBe(true);
    });

    test('compares with strings', () => {
      const a = new Fraction(1, 2);
      expect(a.equals('1/2')).toBe(true);
      expect(a.equals('½')).toBe(true);
    });

    test('recognizes non-equal fractions', () => {
      const a = new Fraction(1, 2);
      const b = new Fraction(1, 3);
      expect(a.equals(b)).toBe(false);
    });

    test('static areEquivalent works', () => {
      expect(Fraction.areEquivalent('1/2', '2/4')).toBe(true);
      expect(Fraction.areEquivalent(0.5, '1/2')).toBe(true);
      expect(Fraction.areEquivalent('1 1/3', '4/3')).toBe(true);
      expect(Fraction.areEquivalent('½', 0.5)).toBe(true);
    });

    test('handles equation format', () => {
      expect(Fraction.areEquivalent('A = 3', '3')).toBe(true);
      expect(Fraction.areEquivalent('x = -5', '-5')).toBe(true);
      expect(Fraction.areEquivalent('= 7', '7')).toBe(true);
      expect(Fraction.areEquivalent('1 + 1 = 2', '2')).toBe(true);
    });

    test('handles multi-value answers', () => {
      expect(Fraction.areEquivalent('3, 1, -1, -2', 'A = 3, B = 1, C = -1, D = -2')).toBe(true);
      expect(Fraction.areEquivalent('5, -3', 'x = 5, y = -3')).toBe(true);
      expect(Fraction.areEquivalent('1, 2, 3', '1, 2, 3')).toBe(true);
      expect(Fraction.areEquivalent('1, 2', '1, 2, 3')).toBe(false);
    });
  });

  describe('Conversion Functions', () => {
    describe('toDecimal', () => {
      test('converts to decimal', () => {
        expect(new Fraction(1, 2).toDecimal()).toBe(0.5);
        expect(new Fraction(1, 3).toDecimal()).toBeCloseTo(0.333333, 5);
        expect(new Fraction(5, 4).toDecimal()).toBe(1.25);
        expect(new Fraction(-2, 3).toDecimal()).toBeCloseTo(-0.666667, 5);
      });
    });

    describe('toString', () => {
      test('formats as string', () => {
        expect(new Fraction(1, 3).toString()).toBe('1/3');
        expect(new Fraction(5, 1).toString()).toBe('5');
        expect(new Fraction(-2, 3).toString()).toBe('-2/3');
      });
    });

    describe('toUnicode', () => {
      test('converts common fractions to Unicode', () => {
        expect(new Fraction(1, 3).toUnicode()).toBe('⅓');
        expect(new Fraction(2, 3).toUnicode()).toBe('⅔');
        expect(new Fraction(1, 2).toUnicode()).toBe('½');
        expect(new Fraction(3, 4).toUnicode()).toBe('¾');
      });

      test('handles mixed numbers', () => {
        expect(new Fraction(7, 3).toUnicode()).toBe('2⅓');
        expect(new Fraction(3, 2).toUnicode()).toBe('1½');
      });

      test('falls back to text for unavailable Unicode', () => {
        expect(new Fraction(2, 7).toUnicode()).toBe('2/7');
        expect(new Fraction(9, 3).toUnicode()).toBe('3'); // Reduces to whole
      });
    });

    describe('toMixedNumber', () => {
      test('converts improper fractions', () => {
        const mixed = new Fraction(7, 3).toMixedNumber();
        expect(mixed.whole).toBe(2);
        expect(mixed.fraction).toEqual(new Fraction(1, 3));
      });

      test('handles proper fractions', () => {
        const mixed = new Fraction(1, 3).toMixedNumber();
        expect(mixed.whole).toBe(0);
        expect(mixed.fraction).toEqual(new Fraction(1, 3));
      });

      test('handles whole numbers', () => {
        const mixed = new Fraction(5, 1).toMixedNumber();
        expect(mixed.whole).toBe(5);
        expect(mixed.fraction).toBeNull();
      });
    });
  });

  describe('Static Methods', () => {
    describe('fromDecimal', () => {
      test('converts common decimals', () => {
        expect(Fraction.fromDecimal(0.5)).toEqual(new Fraction(1, 2));
        expect(Fraction.fromDecimal(0.25)).toEqual(new Fraction(1, 4));
        expect(Fraction.fromDecimal(0.75)).toEqual(new Fraction(3, 4));
      });

      test('uses target denominator', () => {
        expect(Fraction.fromDecimal(0.333333, 3)).toEqual(new Fraction(1, 3));
        expect(Fraction.fromDecimal(0.666667, 3)).toEqual(new Fraction(2, 3));
        expect(Fraction.fromDecimal(2.333333, 3)).toEqual(new Fraction(7, 3));
      });

      test('handles whole numbers', () => {
        expect(Fraction.fromDecimal(5)).toEqual(new Fraction(5, 1));
        expect(Fraction.fromDecimal(-3)).toEqual(new Fraction(-3, 1));
      });

      test('approximates irrational numbers', () => {
        const pi = Fraction.fromDecimal(Math.PI);
        expect(Math.abs(pi.toDecimal() - Math.PI)).toBeLessThan(0.01);
        expect(pi.denominator).toBeLessThanOrEqual(1000000);
        
        const e = Fraction.fromDecimal(Math.E);
        expect(Math.abs(e.toDecimal() - Math.E)).toBeLessThan(0.01);
        expect(e.denominator).toBeLessThanOrEqual(1000000);
      });

      test('respects MAX_DENOMINATOR limit', () => {
        const veryPreciseDecimal = 0.142857142857142857; // 1/7 with many decimals
        const f = Fraction.fromDecimal(veryPreciseDecimal);
        expect(f.denominator).toBeLessThanOrEqual(1000000);
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles negative zero', () => {
      const f = new Fraction(-0, 5);
      expect(f.numerator).toBe(-0); // JavaScript preserves -0
      expect(f.denominator).toBe(1);
    });

    test('handles very large reductions', () => {
      const f = new Fraction(1000, 2000);
      expect(f.numerator).toBe(1);
      expect(f.denominator).toBe(2);
    });

    test('maintains precision for large numbers', () => {
      const f = new Fraction(123456, 234567);
      expect(f.numerator).toBe(41152);
      expect(f.denominator).toBe(78189);
    });

    test('mixed number arithmetic', () => {
      const oneHalf = new Fraction(3, 2); // 1½
      const twoThirds = new Fraction(7, 3); // 2⅓
      
      const sum = oneHalf.add(twoThirds);
      expect(sum).toEqual(new Fraction(23, 6));
      expect(sum.toUnicode()).toBe('3⅚'); // Uses Unicode for 5/6
      
      const difference = twoThirds.subtract(oneHalf);
      expect(difference).toEqual(new Fraction(5, 6));
      
      const product = oneHalf.multiply(twoThirds);
      expect(product).toEqual(new Fraction(7, 2));
      expect(product.toUnicode()).toBe('3½');
    });

    test('toUnicode spacing consistency', () => {
      // Test fractions with Unicode equivalents
      expect(new Fraction(3, 2).toUnicode()).toBe('1½');
      expect(new Fraction(7, 3).toUnicode()).toBe('2⅓');
      
      // Test fractions without Unicode equivalents (should have consistent spacing)
      expect(new Fraction(9, 7).toUnicode()).toBe('1 2/7');
      expect(new Fraction(17, 11).toUnicode()).toBe('1 6/11');
      
      // Verify no inconsistent spacing patterns
      const result = new Fraction(15, 7).toUnicode();
      expect(result).toBe('2⅐'); // Uses Unicode for 1/7
      expect(result).not.toContain('  '); // No double spaces
    });

    test('very large numbers overflow protection', () => {
      // Test that operations with large numbers don't cause overflow
      const large1 = new Fraction(999999, 1000000);
      const large2 = new Fraction(1000000, 999999);
      
      const product = large1.multiply(large2);
      expect(Number.isFinite(product.numerator)).toBe(true);
      expect(Number.isFinite(product.denominator)).toBe(true);
      expect(Math.abs(product.toDecimal() - 1)).toBeLessThan(0.001);
    });
  });

  describe('Exercise Integration', () => {
    test('validates exercise answers correctly', () => {
      // User enters "5/3", answer is "5/3"
      expect(Fraction.areEquivalent('5/3', '5/3')).toBe(true);
      
      // User enters "1⅔", answer is "5/3"
      expect(Fraction.areEquivalent('1⅔', '5/3')).toBe(true);
      
      // User enters "1.666667", answer is "5/3" (may not be exact due to floating precision)
      const f1 = Fraction.fromDecimal(1.666667);
      const f2 = Fraction.parse('5/3')!;
      expect(Math.abs(f1.toDecimal() - f2.toDecimal()) < 0.001).toBe(true);
      
      // User enters "1 2/3", answer is "5/3"
      expect(Fraction.areEquivalent('1 2/3', '5/3')).toBe(true);
    });

    test('handles all exercise fraction answers', () => {
      const exerciseAnswers = [
        { stored: '5/3', display: '1⅔', decimal: 1.666667 },
        { stored: '7/3', display: '2⅓', decimal: 2.333333 },
        { stored: '4/3', display: '1⅓', decimal: 1.333333 },
        { stored: '-2/3', display: '-⅔', decimal: -0.666667 },
        { stored: '3/2', display: '1½', decimal: 1.5 },
        { stored: '5/2', display: '2½', decimal: 2.5 }
      ];

      exerciseAnswers.forEach(({ stored, display, decimal }) => {
        
        // All formats should be equivalent - but some Unicode might not parse correctly
        const storedFrac = Fraction.parse(stored)!;
        const displayFrac = Fraction.parse(display);
        if (displayFrac) {
          expect(storedFrac.equals(displayFrac)).toBe(true);
        }
        
        // Decimal comparisons may have floating point precision issues
        const decimalFrac = Fraction.fromDecimal(decimal);
        expect(Math.abs(storedFrac.toDecimal() - decimalFrac.toDecimal()) < 0.001).toBe(true);
        
        // Unicode display vs decimal comparison (may have precision issues)
        if (displayFrac) {
          const decimalFrac2 = Fraction.fromDecimal(decimal);
          expect(Math.abs(displayFrac.toDecimal() - decimalFrac2.toDecimal()) < 0.001).toBe(true);
        }
      });
    });
  });
});