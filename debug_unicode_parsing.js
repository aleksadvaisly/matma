// Focused test on Unicode parsing issue

class Fraction {
  static parse(str) {
    str = str.trim();
    console.log(`Parsing: "${str}"`);

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
      console.log(`  Checking for unicode: "${unicode}"`);
      if (str.includes(unicode)) {
        console.log(`  Found unicode "${unicode}" in "${str}"`);
        const parts = str.split(unicode);
        console.log(`  Split parts:`, parts);
        
        if (parts.length === 2 && parts[0]) {
          console.log(`  Case 1: Mixed number - parts[0]="${parts[0]}"`);
          const whole = parseInt(parts[0]);
          const frac = Fraction.parse(fraction);
          if (!isNaN(whole) && frac) {
            const sign = whole < 0 ? -1 : 1;
            return { numerator: sign * (Math.abs(whole) * frac.denominator + frac.numerator), denominator: frac.denominator };
          }
        } else if (parts.length === 2 && !parts[0]) {
          console.log(`  Case 2: Pure unicode - returning equivalent of "${fraction}"`);
          return Fraction.parse(fraction);
        } else if (parts.length === 2 && parts[0] === '-') {
          console.log(`  Case 3: Negative unicode - parts[0]="${parts[0]}"`);
          // Handle negative Unicode fractions like "-½"
          const frac = Fraction.parse(fraction);
          if (frac) {
            return { numerator: -frac.numerator, denominator: frac.denominator };
          }
        }
      }
    }

    // Handle simple fraction (e.g., "1/3", "-2/5")
    const fractionMatch = str.match(/^([-+]?\d+)\/(\d+)$/);
    if (fractionMatch) {
      console.log(`  Matched simple fraction pattern: ${fractionMatch[1]}/${fractionMatch[2]}`);
      return { numerator: parseInt(fractionMatch[1]), denominator: parseInt(fractionMatch[2]) };
    }

    // Handle whole number
    const wholeMatch = str.match(/^[-+]?\d+$/);
    if (wholeMatch) {
      console.log(`  Matched whole number pattern: ${str}`);
      return { numerator: parseInt(str), denominator: 1 };
    }

    console.log(`  No pattern matched, returning null`);
    return null;
  }
}

console.log('=== UNICODE PARSING DEBUG ===');

const testCases = ['-½', '-1/2', '½', '¾', '-⅔'];

testCases.forEach(test => {
  console.log(`\n--- Testing "${test}" ---`);
  const result = Fraction.parse(test);
  console.log(`Result:`, result);
});