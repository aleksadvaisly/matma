/**
 * Exact fraction representation system inspired by Clojure's Ratio type.
 * Maintains fractions as numerator/denominator pairs for exact arithmetic.
 */

export class Fraction {
  readonly numerator: number;
  readonly denominator: number;
  
  private static readonly MAX_DENOMINATOR = 1000000;

  constructor(numerator: number, denominator: number = 1) {
    if (denominator === 0) {
      throw new Error("Divide by zero");
    }

    // Reduce to lowest terms
    const gcd = this.gcd(Math.abs(numerator), Math.abs(denominator));
    numerator = numerator / gcd;
    denominator = denominator / gcd;

    // Normalize sign to numerator
    if (denominator < 0) {
      numerator = -numerator;
      denominator = -denominator;
    }

    this.numerator = numerator;
    this.denominator = denominator;
    
    Object.freeze(this);
  }

  private gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  /**
   * Add two fractions
   */
  add(other: Fraction | number): Fraction {
    const f = this.toFraction(other);
    return new Fraction(
      this.numerator * f.denominator + f.numerator * this.denominator,
      this.denominator * f.denominator
    );
  }

  /**
   * Subtract two fractions
   */
  subtract(other: Fraction | number): Fraction {
    const f = this.toFraction(other);
    return new Fraction(
      this.numerator * f.denominator - f.numerator * this.denominator,
      this.denominator * f.denominator
    );
  }

  /**
   * Multiply two fractions
   */
  multiply(other: Fraction | number): Fraction {
    const f = this.toFraction(other);
    return new Fraction(
      this.numerator * f.numerator,
      this.denominator * f.denominator
    );
  }

  /**
   * Divide two fractions
   */
  divide(other: Fraction | number): Fraction {
    const f = this.toFraction(other);
    return new Fraction(
      this.numerator * f.denominator,
      this.denominator * f.numerator
    );
  }

  /**
   * Check equality (works for equivalent fractions like 1/2 = 2/4)
   */
  equals(other: Fraction | number | string): boolean {
    try {
      const f = typeof other === 'string' ? Fraction.parse(other) : this.toFraction(other);
      if (!f) return false;
      return this.numerator === f.numerator && this.denominator === f.denominator;
    } catch {
      return false;
    }
  }

  /**
   * Convert to decimal
   */
  toDecimal(): number {
    return this.numerator / this.denominator;
  }

  /**
   * Check if this is a whole number
   */
  isWhole(): boolean {
    return this.denominator === 1;
  }

  /**
   * Get whole and fractional parts for mixed numbers
   */
  toMixedNumber(): { whole: number; fraction: Fraction | null } {
    if (Math.abs(this.numerator) < this.denominator) {
      return { whole: 0, fraction: this };
    }

    const whole = Math.trunc(this.numerator / this.denominator);
    const remainder = Math.abs(this.numerator) % this.denominator;
    
    if (remainder === 0) {
      return { whole, fraction: null };
    }

    return {
      whole,
      fraction: new Fraction(remainder, this.denominator)
    };
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    if (this.denominator === 1) {
      return String(this.numerator);
    }
    return `${this.numerator}/${this.denominator}`;
  }

  /**
   * Convert to Unicode representation if possible
   */
  toUnicode(): string {
    const unicodeFractions: Record<string, string> = {
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
      '1/10': '⅒'
    };

    const mixed = this.toMixedNumber();
    
    if (mixed.whole === 0 && mixed.fraction) {
      const key = mixed.fraction.toString();
      return unicodeFractions[key] || key;
    }

    if (mixed.fraction) {
      const key = mixed.fraction.toString();
      const fractionPart = unicodeFractions[key] || key;
      return `${mixed.whole}${unicodeFractions[key] || (' ' + key)}`;
    }

    return String(mixed.whole);
  }

  /**
   * Parse various string representations
   */
  static parse(str: string): Fraction | null {
    str = str.trim();
    
    // Handle equation format: extract value after equals sign
    // Examples: "A = 3" → "3", "1 + 1 = 2" → "2", "= 5" → "5"
    if (str.includes('=')) {
      const parts = str.split('=');
      // Take the last part after equals sign
      str = parts[parts.length - 1].trim();
    }
    
    // Normalize minus characters: convert mathematical minus sign (−) to hyphen-minus (-)
    str = str.replace(/−/g, '-');

    // Normalize Polish "i" notation: "1 i 1/2" → "1 1/2"
    str = str.replace(/\s+i\s+/g, ' ');

    // Normalize plus sign: "+1" → "1", "+1/2" → "1/2"
    str = str.replace(/^\+/, '');

    // Normalize "and" notation: "1and1/2" → "1 1/2"
    str = str.replace(/and/g, ' ');

    // Better whitespace handling: normalize multiple spaces and spaces around /
    str = str.replace(/\s+/g, ' ').replace(/\s*\/\s*/g, '/');
    
    // Strip common units for comparison (°C, m, km, zł, PLN, etc.)
    // This allows comparing "-15" with "-15°C" as equal
    str = str.replace(/\s*(°C|°F|°K|m|km|cm|mm|zł|PLN|USD|EUR|kg|g|mg|l|ml|s|min|h)$/i, '');

    // Handle Unicode fractions
    const unicodeMap: Record<string, string> = {
      '½': '1/2',
      '⅓': '1/3',
      '⅔': '2/3',
      '¼': '1/4',
      '¾': '3/4',
      '⅕': '1/5',
      '⅖': '2/5',
      '⅗': '3/5',
      '⅘': '4/5',
      '⅙': '1/6',
      '⅚': '5/6',
      '⅐': '1/7',
      '⅛': '1/8',
      '⅜': '3/8',
      '⅝': '5/8',
      '⅞': '7/8',
      '⅑': '1/9',
      '⅒': '1/10'
    };

    // Check for mixed numbers with Unicode (e.g., "2½", "-⅔")
    for (const [unicode, fraction] of Object.entries(unicodeMap)) {
      if (str.includes(unicode)) {
        const parts = str.split(unicode);
        if (parts.length === 2 && parts[0] === '-') {
          // Handle negative Unicode fractions like "-½"
          const frac = Fraction.parse(fraction);
          if (frac) {
            return new Fraction(-frac.numerator, frac.denominator);
          }
        } else if (parts.length === 2 && !parts[0]) {
          return Fraction.parse(fraction);
        } else if (parts.length === 2 && parts[0]) {
          const whole = parseInt(parts[0]);
          const frac = Fraction.parse(fraction);
          if (!isNaN(whole) && frac) {
            const sign = whole < 0 ? -1 : 1;
            return new Fraction(sign * (Math.abs(whole) * frac.denominator + frac.numerator), frac.denominator);
          }
        }
      }
    }

    // Handle simple fraction (e.g., "1/3", "-2/5")
    const fractionMatch = str.match(/^([-+]?\d+)\/(\d+)$/);
    if (fractionMatch) {
      return new Fraction(parseInt(fractionMatch[1]), parseInt(fractionMatch[2]));
    }

    // Handle mixed number (e.g., "2 1/3", "-1 3/4")
    const mixedMatch = str.match(/^([-+]?\d+)\s+(\d+)\/(\d+)$/);
    if (mixedMatch) {
      const whole = parseInt(mixedMatch[1]);
      const num = parseInt(mixedMatch[2]);
      const den = parseInt(mixedMatch[3]);
      const sign = whole < 0 ? -1 : 1;
      return new Fraction(Math.abs(whole) * den + num, den).multiply(sign);
    }

    // Handle whole number
    const wholeMatch = str.match(/^[-+]?\d+$/);
    if (wholeMatch) {
      return new Fraction(parseInt(str), 1);
    }

    // Handle decimal
    const decimalMatch = str.match(/^[-+]?\d*\.?\d+$/);
    if (decimalMatch) {
      return Fraction.fromDecimal(parseFloat(str));
    }

    return null;
  }

  /**
   * Create fraction from decimal with optional target denominator
   */
  static fromDecimal(decimal: number, targetDenominator?: number): Fraction {
    if (targetDenominator) {
      // Use specific denominator (e.g., for thirds, halves)
      const numerator = Math.round(decimal * targetDenominator);
      return new Fraction(numerator, targetDenominator);
    }

    // Try common denominators first
    const commonDenominators = [2, 3, 4, 5, 6, 8, 10];
    for (const den of commonDenominators) {
      const num = decimal * den;
      if (Math.abs(num - Math.round(num)) < 1e-9) {
        return new Fraction(Math.round(num), den);
      }
    }

    // Fallback: convert using continued fractions algorithm
    const sign = decimal < 0 ? -1 : 1;
    decimal = Math.abs(decimal);
    
    const whole = Math.floor(decimal);
    let frac = decimal - whole;
    
    if (frac < 1e-9) {
      return new Fraction(whole * sign, 1);
    }

    // Continued fractions with max denominator limit
    let n0 = 1, d0 = 0;
    let n1 = whole, d1 = 1;
    
    let current = frac;
    while (current > 1e-9 && d1 <= Fraction.MAX_DENOMINATOR) {
      current = 1 / current;
      const b = Math.floor(current);
      current = current - b;
      
      const n2 = b * n1 + n0;
      const d2 = b * d1 + d0;
      
      if (d2 > Fraction.MAX_DENOMINATOR) break;
      
      n0 = n1; n1 = n2;
      d0 = d1; d1 = d2;
    }
    
    return new Fraction(n1 * sign, d1);
  }

  private toFraction(value: Fraction | number): Fraction {
    if (value instanceof Fraction) return value;
    if (typeof value === 'number') return new Fraction(value, 1);
    throw new Error("Cannot convert to fraction");
  }

  /**
   * Check if a value is mathematically equivalent
   * Handles fractions, decimals, mixed formats, and multi-value answers
   */
  static areEquivalent(a: string | number, b: string | number): boolean {
    try {
      // Convert to strings for processing
      const strA = String(a).trim();
      const strB = String(b).trim();
      
      // Check if these are multi-value answers (comma-separated)
      if (strA.includes(',') || strB.includes(',')) {
        const partsA = strA.split(',').map(s => s.trim());
        const partsB = strB.split(',').map(s => s.trim());
        
        // Must have same number of parts
        if (partsA.length !== partsB.length) {
          return false;
        }
        
        // Each part must be equivalent
        return partsA.every((partA, i) => {
          const partB = partsB[i];
          return Fraction.areEquivalent(partA, partB);
        });
      }
      
      // Single value comparison
      const fa = typeof a === 'number' ? new Fraction(a, 1) : Fraction.parse(strA);
      const fb = typeof b === 'number' ? new Fraction(b, 1) : Fraction.parse(strB);
      
      // If both are valid fractions, compare them
      if (fa && fb) {
        return fa.equals(fb);
      }
      
      // If neither could be parsed as fractions, use string comparison
      if (!fa && !fb) {
        return strA === strB;
      }
      
      // If one is a fraction and one isn't, they're not equivalent
      return false;
    } catch {
      // Fallback to string comparison
      return String(a).trim() === String(b).trim();
    }
  }
}