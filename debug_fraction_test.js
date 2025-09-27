// Test script to debug fraction comparison issue for exercise 3-1-11-a
// This replicates the Fraction logic without TypeScript compilation

class Fraction {
  constructor(numerator, denominator = 1) {
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
  }

  gcd(a, b) {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  equals(other) {
    try {
      const f = typeof other === 'string' ? Fraction.parse(other) : this.toFraction(other);
      if (!f) return false;
      return this.numerator === f.numerator && this.denominator === f.denominator;
    } catch {
      return false;
    }
  }

  toString() {
    if (this.denominator === 1) {
      return String(this.numerator);
    }
    return `${this.numerator}/${this.denominator}`;
  }

  toFraction(value) {
    if (value instanceof Fraction) return value;
    if (typeof value === 'number') return new Fraction(value, 1);
    throw new Error("Cannot convert to fraction");
  }

  static parse(str) {
    str = str.trim();

    // Handle Unicode fractions
    const unicodeMap = {
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

    // Handle whole number
    const wholeMatch = str.match(/^[-+]?\d+$/);
    if (wholeMatch) {
      return new Fraction(parseInt(str), 1);
    }

    return null;
  }

  static areEquivalent(a, b) {
    try {
      const fa = typeof a === 'number' ? new Fraction(a, 1) : Fraction.parse(String(a));
      const fb = typeof b === 'number' ? new Fraction(b, 1) : Fraction.parse(String(b));
      
      // If both are valid fractions, compare them
      if (fa && fb) {
        return fa.equals(fb);
      }
      
      // If neither could be parsed as fractions, use string comparison
      if (!fa && !fb) {
        return String(a).trim() === String(b).trim();
      }
      
      // If one is a fraction and one isn't, they're not equivalent
      return false;
    } catch {
      // Fallback to string comparison
      return String(a).trim() === String(b).trim();
    }
  }
}

// Test cases for exercise 3-1-11-a
console.log('=== DEBUGGING EXERCISE 3-1-11-a ===');
console.log('Question: (-⅔) × ¾ = ?');
console.log('Stored answer: "-½"');
console.log('');

const storedAnswer = '-½';
const testInputs = [
  '-½',
  '-1/2', 
  '- 1/2',
  '-0.5',
  'negative half',
  '−½', // different minus character
  '−1/2'
];

console.log('Testing user inputs against stored answer:');
testInputs.forEach(input => {
  const result = Fraction.areEquivalent(input, storedAnswer);
  console.log(`"${input}" vs "${storedAnswer}" = ${result}`);
  
  // Show parsing details
  const parsed1 = Fraction.parse(input);
  const parsed2 = Fraction.parse(storedAnswer);
  console.log(`  Parsed: ${parsed1?.toString() || 'null'} vs ${parsed2?.toString() || 'null'}`);
  console.log('');
});

// Test the calculation directly
console.log('=== DIRECT CALCULATION TEST ===');
const frac1 = Fraction.parse('-⅔'); // (-2/3)
const frac2 = Fraction.parse('¾');   // (3/4)
console.log(`frac1: ${frac1?.toString()}`);
console.log(`frac2: ${frac2?.toString()}`);

if (frac1 && frac2) {
  const result = new Fraction(frac1.numerator * frac2.numerator, frac1.denominator * frac2.denominator);
  console.log(`Result: ${result.toString()}`);
  console.log(`Expected: -½`);
  console.log(`Match: ${Fraction.areEquivalent(result.toString(), '-½')}`);
}