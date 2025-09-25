// Test FractionUtils.areEquivalent for exercise 1-1-8-f
// Simulating the exact values being compared in the validation

console.log('=== DEBUG TEST: Exercise 1-1-8-f Validation ===');

// Simulating the FractionUtils logic
const UNICODE_TO_FRACTION = {
  '½': '1/2',
  '⅓': '1/3',
  '⅔': '2/3',
  '¼': '1/4',
  '¾': '3/4',
  // ... other mappings
};

function parse(input) {
  console.log(`Parsing input: "${input}" (type: ${typeof input})`);
  
  if (!input || typeof input !== 'string') {
    console.log('  -> Input is null/undefined or not string, returning null');
    return null;
  }
  
  const trimmed = input.trim();
  if (!trimmed) {
    console.log('  -> Trimmed input is empty, returning null');
    return null;
  }
  
  // Handle Unicode fractions first
  if (UNICODE_TO_FRACTION[trimmed]) {
    console.log(`  -> Found Unicode fraction: ${trimmed} -> ${UNICODE_TO_FRACTION[trimmed]}`);
    const [num, den] = UNICODE_TO_FRACTION[trimmed].split('/').map(Number);
    return { numerator: num, denominator: den };
  }
  
  // Handle decimal numbers
  const decimalMatch = trimmed.match(/^-?\d*\.?\d+$/);
  if (decimalMatch) {
    console.log(`  -> Matched decimal pattern: ${trimmed}`);
    const decimal = parseFloat(trimmed);
    if (!isNaN(decimal)) {
      console.log(`  -> Parsed decimal: ${decimal}`);
      // For whole numbers, return as whole
      if (decimal % 1 === 0) {
        console.log(`  -> Whole number: {whole: ${decimal}}`);
        return { whole: decimal };
      }
      // Convert decimal to fraction
      console.log(`  -> Converting decimal to fraction...`);
      return decimalToFraction(decimal);
    }
  }
  
  console.log('  -> No match found, returning null');
  return null;
}

function decimalToFraction(decimal) {
  console.log(`  Converting decimal ${decimal} to fraction:`);
  
  const sign = decimal < 0 ? -1 : 1;
  decimal = Math.abs(decimal);
  
  // Handle whole number part
  const wholePart = Math.floor(decimal);
  const fractionalPart = decimal - wholePart;
  
  console.log(`    wholePart: ${wholePart}, fractionalPart: ${fractionalPart}`);
  
  if (fractionalPart === 0) {
    console.log(`    -> Pure whole number: {whole: ${wholePart * sign}}`);
    return { whole: wholePart * sign };
  }
  
  // Convert fractional part to fraction
  const precision = 1000000; // Handle up to 6 decimal places
  let numerator = Math.round(fractionalPart * precision);
  let denominator = precision;
  
  console.log(`    Before GCD: numerator=${numerator}, denominator=${denominator}`);
  
  // Simplify the fraction
  const gcd = greatestCommonDivisor(numerator, denominator);
  numerator /= gcd;
  denominator /= gcd;
  
  console.log(`    After GCD(${gcd}): numerator=${numerator}, denominator=${denominator}`);
  
  if (wholePart === 0) {
    const result = { numerator: numerator * sign, denominator };
    console.log(`    -> Proper fraction: ${JSON.stringify(result)}`);
    return result;
  } else {
    const result = { whole: wholePart * sign, numerator, denominator };
    console.log(`    -> Mixed number: ${JSON.stringify(result)}`);
    return result;
  }
}

function greatestCommonDivisor(a, b) {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

function toDecimal(fraction) {
  console.log(`Converting fraction to decimal: ${JSON.stringify(fraction)}`);
  
  let result = 0;
  
  if (fraction.whole !== undefined) {
    result += fraction.whole;
    console.log(`  Added whole part: ${result}`);
  }
  
  if (fraction.numerator !== undefined && fraction.denominator !== undefined) {
    const fracValue = fraction.numerator / fraction.denominator;
    console.log(`  Fraction value: ${fraction.numerator}/${fraction.denominator} = ${fracValue}`);
    
    // Add or subtract based on the sign of whole number
    if (fraction.whole !== undefined && fraction.whole < 0) {
      result -= fracValue;
      console.log(`  Subtracted fraction (negative whole): ${result}`);
    } else {
      result += fracValue;
      console.log(`  Added fraction: ${result}`);
    }
  }
  
  console.log(`  Final decimal: ${result}`);
  return result;
}

function areEquivalent(a, b) {
  console.log(`\n=== Testing areEquivalent("${a}", "${b}") ===`);
  
  const fractionA = parse(String(a));
  const fractionB = parse(String(b));
  
  console.log(`fractionA: ${JSON.stringify(fractionA)}`);
  console.log(`fractionB: ${JSON.stringify(fractionB)}`);
  
  if (!fractionA || !fractionB) {
    console.log('One or both fractions failed to parse, falling back to string comparison');
    const stringResult = String(a).trim() === String(b).trim();
    console.log(`String comparison result: ${stringResult}`);
    return stringResult;
  }
  
  const decimalA = toDecimal(fractionA);
  const decimalB = toDecimal(fractionB);
  
  const difference = Math.abs(decimalA - decimalB);
  const result = difference < 1e-6;
  
  console.log(`Decimal comparison: ${decimalA} vs ${decimalB}`);
  console.log(`Difference: ${difference}`);
  console.log(`Result (< 1e-6): ${result}`);
  
  return result;
}

// Test the exact scenario from exercise 1-1-8-f
console.log('\n=== TESTING EXERCISE 1-1-8-f SCENARIO ===');
console.log('Question: "Na osi liczbowej zaznacz liczbę: 1½"');
console.log('Stored answer: "1.5"');
console.log('User clicks on 1.5 on number line (selectedAnswer = 1.5 as number)');

// Test the actual comparison that happens in ExerciseCard
const selectedAnswer = 1.5; // Number from NumberLine click
const correctAnswer = "1.5"; // String from database
const result = areEquivalent(selectedAnswer, correctAnswer);

console.log(`\nFINAL RESULT: areEquivalent(${selectedAnswer}, "${correctAnswer}") = ${result}`);

console.log('\n=== ADDITIONAL TESTS ===');

// Test other potential formats
console.log('\n1. Testing with "1½" as stored answer:');
areEquivalent(1.5, "1½");

console.log('\n2. Testing string "1.5" vs string "1.5":');
areEquivalent("1.5", "1.5");

console.log('\n3. Testing number 1.5 vs number 1.5:');
areEquivalent(1.5, 1.5);