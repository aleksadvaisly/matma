import { Fraction } from './fraction';

describe('Fraction', () => {
  describe('areEquivalent', () => {
    // Test case for the original bug: comparing a float from the number line to a fraction string
    it('should correctly compare a float to a fraction string using a target denominator', () => {
      // Simulate the value from clicking 1 2/3 on a number line with subdivision 3
      const numberLineClickValue = 1.6666666666666667;
      const databaseAnswer = '5/3';
      const subdivision = 3;

      // This should now pass with the fix
      expect(Fraction.areEquivalent(numberLineClickValue, databaseAnswer, subdivision)).toBe(true);
    });

    it('should return true for equivalent fractions like "1/2" and "2/4"', () => {
      expect(Fraction.areEquivalent('1/2', '2/4')).toBe(true);
    });

    it('should return true for equivalent mixed and simple fractions like "1 1/2" and "3/2"', () => {
      expect(Fraction.areEquivalent('1 1/2', '3/2')).toBe(true);
    });

    it('should return true for equivalent unicode and simple fractions like "⅔" and "2/3"', () => {
      expect(Fraction.areEquivalent('⅔', '2/3')).toBe(true);
    });

    it('should return true for a whole number and its fractional representation', () => {
      expect(Fraction.areEquivalent(2, '2/1')).toBe(true);
    });

    it('should return false for non-equivalent fractions', () => {
      expect(Fraction.areEquivalent('1/2', '1/3')).toBe(false);
    });

    it('should handle negative numbers correctly', () => {
      expect(Fraction.areEquivalent('-1/2', '-2/4')).toBe(true);
      expect(Fraction.areEquivalent(-0.5, '-1/2')).toBe(true);
    });

    it('should return true when comparing a decimal to a fraction string', () => {
        expect(Fraction.areEquivalent(0.75, "3/4")).toBe(true);
    });
  });
});