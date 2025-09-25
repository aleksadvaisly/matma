export interface Fraction {
  numerator?: number;
  denominator?: number;
  whole?: number; // For mixed numbers like 2⅓
}

export class FractionUtils {
  // Unicode fraction mappings
  private static readonly UNICODE_FRACTIONS: Record<string, string> = {
    '1/2': '½',
    '1/3': '⅓',
    '2/3': '⅔',
    '1/4': '¼',
    '3/4': '¾',
    '1/5': '⅕',
    '2/5': '⅖',
    '3/5': '⅗',
    '4/5': '⅘',
    '1/6': '⅙',
    '5/6': '⅚',
    '1/7': '⅐',
    '1/8': '⅛',
    '3/8': '⅜',
    '5/8': '⅝',
    '7/8': '⅞',
    '1/9': '⅑',
    '1/10': '⅒',
  };

  // Reverse mapping for parsing Unicode fractions
  private static readonly UNICODE_TO_FRACTION: Record<string, string> = Object.fromEntries(
    Object.entries(FractionUtils.UNICODE_FRACTIONS).map(([key, value]) => [value, key])
  );

  /**
   * Parse a string input into a Fraction object
   * Supports formats:
   * - "2/3" -> {numerator: 2, denominator: 3}
   * - "1½" or "1 1/2" -> {whole: 1, numerator: 1, denominator: 2}
   * - "⅔" -> {numerator: 2, denominator: 3}
   * - "0.5" -> {numerator: 1, denominator: 2}
   * - "3" -> {whole: 3}
   */
  static parse(input: string): Fraction | null {
    if (!input || typeof input !== 'string') return null;
    
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Handle Unicode fractions first
    if (this.UNICODE_TO_FRACTION[trimmed]) {
      const [num, den] = this.UNICODE_TO_FRACTION[trimmed].split('/').map(Number);
      return { numerator: num, denominator: den };
    }

    // Handle mixed numbers with Unicode fractions like "2⅓"
    const unicodeMixedMatch = trimmed.match(/^(-?\d+)([½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅐⅛⅜⅝⅞])$/);
    if (unicodeMixedMatch) {
      const [, wholeStr, unicodeFrac] = unicodeMixedMatch;
      const whole = parseInt(wholeStr);
      if (this.UNICODE_TO_FRACTION[unicodeFrac]) {
        const [num, den] = this.UNICODE_TO_FRACTION[unicodeFrac].split('/').map(Number);
        return { whole, numerator: num, denominator: den };
      }
    }

    // Handle negative mixed numbers with Unicode fractions like "-2⅓"
    const negativeUnicodeMixedMatch = trimmed.match(/^-(\d+)([⅐-⅞])$/);
    if (negativeUnicodeMixedMatch) {
      const [, wholeStr, unicodeFrac] = negativeUnicodeMixedMatch;
      const whole = -parseInt(wholeStr);
      if (this.UNICODE_TO_FRACTION[unicodeFrac]) {
        const [num, den] = this.UNICODE_TO_FRACTION[unicodeFrac].split('/').map(Number);
        return { whole, numerator: num, denominator: den };
      }
    }

    // Handle mixed numbers like "2 1/3" or "2_1/3"
    const mixedMatch = trimmed.match(/^(-?\d+)[\s_]+(\d+)\/(\d+)$/);
    if (mixedMatch) {
      const [, wholeStr, numStr, denStr] = mixedMatch;
      const whole = parseInt(wholeStr);
      const numerator = parseInt(numStr);
      const denominator = parseInt(denStr);
      if (denominator !== 0) {
        return { whole, numerator, denominator };
      }
    }

    // Handle simple fractions like "2/3"
    const fractionMatch = trimmed.match(/^(-?\d+)\/(\d+)$/);
    if (fractionMatch) {
      const [, numStr, denStr] = fractionMatch;
      const numerator = parseInt(numStr);
      const denominator = parseInt(denStr);
      if (denominator !== 0) {
        return { numerator, denominator };
      }
    }

    // Handle decimal numbers
    const decimalMatch = trimmed.match(/^-?\d*\.?\d+$/);
    if (decimalMatch) {
      const decimal = parseFloat(trimmed);
      if (!isNaN(decimal)) {
        // For whole numbers, return as whole
        if (decimal % 1 === 0) {
          return { whole: decimal };
        }
        // Convert decimal to fraction
        return this.decimalToFraction(decimal);
      }
    }

    // Handle whole numbers
    const wholeMatch = trimmed.match(/^-?\d+$/);
    if (wholeMatch) {
      const whole = parseInt(trimmed);
      if (!isNaN(whole)) {
        return { whole };
      }
    }

    return null;
  }

  /**
   * Convert decimal to fraction
   */
  private static decimalToFraction(decimal: number): Fraction {
    const sign = decimal < 0 ? -1 : 1;
    decimal = Math.abs(decimal);
    
    // Handle whole number part
    const wholePart = Math.floor(decimal);
    const fractionalPart = decimal - wholePart;
    
    if (fractionalPart === 0) {
      return { whole: wholePart * sign };
    }
    
    // Convert fractional part to fraction
    const precision = 1000000; // Handle up to 6 decimal places
    let numerator = Math.round(fractionalPart * precision);
    let denominator = precision;
    
    // Simplify the fraction
    const gcd = this.greatestCommonDivisor(numerator, denominator);
    numerator /= gcd;
    denominator /= gcd;
    
    if (wholePart === 0) {
      return { numerator: numerator * sign, denominator };
    } else {
      return { whole: wholePart * sign, numerator, denominator };
    }
  }

  /**
   * Convert Fraction to decimal number
   */
  static toDecimal(fraction: Fraction): number {
    let result = 0;
    
    if (fraction.whole !== undefined) {
      result += fraction.whole;
    }
    
    if (fraction.numerator !== undefined && fraction.denominator !== undefined) {
      const fracValue = fraction.numerator / fraction.denominator;
      // Add or subtract based on the sign of whole number
      if (fraction.whole !== undefined && fraction.whole < 0) {
        result -= fracValue;
      } else {
        result += fracValue;
      }
    }
    
    return result;
  }

  /**
   * Convert Fraction to Unicode display string if possible
   */
  static toUnicode(fraction: Fraction): string {
    // Handle whole numbers
    if (fraction.numerator === undefined || fraction.denominator === undefined) {
      return String(fraction.whole || 0);
    }

    // Simplify the fraction first
    const simplified = this.simplify(fraction);
    
    // Check for mixed numbers
    if (simplified.whole !== undefined && simplified.whole !== 0) {
      const fractionPart = `${simplified.numerator}/${simplified.denominator}`;
      const unicodeFraction = this.UNICODE_FRACTIONS[fractionPart];
      if (unicodeFraction) {
        return `${simplified.whole}${unicodeFraction}`;
      }
      return `${simplified.whole} ${simplified.numerator}/${simplified.denominator}`;
    }

    // Check for simple fractions
    const fractionKey = `${simplified.numerator}/${simplified.denominator}`;
    const unicodeFraction = this.UNICODE_FRACTIONS[fractionKey];
    if (unicodeFraction) {
      return unicodeFraction;
    }

    // Fallback to regular fraction notation
    return `${simplified.numerator}/${simplified.denominator}`;
  }

  /**
   * Convert Fraction to regular string notation
   */
  static toString(fraction: Fraction): string {
    if (fraction.numerator === undefined || fraction.denominator === undefined) {
      return String(fraction.whole || 0);
    }

    const simplified = this.simplify(fraction);

    if (simplified.whole !== undefined && simplified.whole !== 0) {
      return `${simplified.whole} ${simplified.numerator}/${simplified.denominator}`;
    }

    return `${simplified.numerator}/${simplified.denominator}`;
  }

  /**
   * Check if two values are mathematically equivalent
   */
  static areEquivalent(a: string | number, b: string | number): boolean {
    const fractionA = this.parse(String(a));
    const fractionB = this.parse(String(b));
    
    if (!fractionA || !fractionB) {
      // Fallback to string comparison if parsing fails
      return String(a).trim() === String(b).trim();
    }
    
    const decimalA = this.toDecimal(fractionA);
    const decimalB = this.toDecimal(fractionB);
    
    // Use small epsilon for floating point comparison
    return Math.abs(decimalA - decimalB) < 1e-6; // More reasonable tolerance for user input
  }

  /**
   * Simplify a fraction by reducing to lowest terms
   */
  static simplify(fraction: Fraction): Fraction {
    if (fraction.numerator === undefined || fraction.denominator === undefined) {
      return { ...fraction };
    }

    let { numerator, denominator, whole } = fraction;
    
    // Convert improper fractions to mixed numbers if needed
    if (Math.abs(numerator) >= denominator) {
      const additionalWhole = Math.floor(Math.abs(numerator) / denominator);
      const sign = numerator < 0 ? -1 : 1;
      
      whole = (whole || 0) + (additionalWhole * sign);
      numerator = (Math.abs(numerator) % denominator) * sign;
      
      if (numerator === 0) {
        return { whole };
      }
    }
    
    // Reduce fraction to lowest terms
    const gcd = this.greatestCommonDivisor(Math.abs(numerator), denominator);
    numerator /= gcd;
    denominator /= gcd;
    
    if (whole !== undefined && whole !== 0) {
      return { whole, numerator, denominator };
    }
    
    return { numerator, denominator };
  }

  /**
   * Calculate greatest common divisor
   */
  private static greatestCommonDivisor(a: number, b: number): number {
    return b === 0 ? a : this.greatestCommonDivisor(b, a % b);
  }

  /**
   * Get fractional positions for number line
   * Returns array of decimal positions between min and max with given subdivision
   */
  static getFractionalPositions(min: number, max: number, subdivision: number): number[] {
    const positions: number[] = [];
    const step = 1 / subdivision;
    
    // Start from the first position after min
    let current = Math.ceil(min / step) * step;
    
    while (current <= max) {
      if (current >= min) {
        positions.push(Math.round(current * subdivision) / subdivision); // Avoid floating point errors
      }
      current += step;
    }
    
    return positions;
  }

  /**
   * Format number for display on number line (with fractions)
   */
  static formatForNumberLine(value: number, subdivision: number = 1): string {
    // For whole numbers, just return the number
    if (value % 1 === 0) {
      return String(value);
    }

    // Try to represent as a simple fraction
    const fraction = this.decimalToFraction(value);
    
    // If it's a clean fraction with the expected denominator, use Unicode if possible
    if (fraction.denominator === subdivision) {
      return this.toUnicode(fraction);
    }
    
    // For other cases, use the best Unicode representation available
    return this.toUnicode(fraction);
  }

  /**
   * Check if a number can be represented as a fraction with given subdivision
   */
  static isValidFractionalPosition(value: number, subdivision: number): boolean {
    const step = 1 / subdivision;
    const remainder = Math.abs(value % step);
    return remainder < 1e-6 || Math.abs(remainder - step) < 1e-6;
  }
}