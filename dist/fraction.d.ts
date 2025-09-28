/**
 * Exact fraction representation system inspired by Clojure's Ratio type.
 * Maintains fractions as numerator/denominator pairs for exact arithmetic.
 */
export declare class Fraction {
    readonly numerator: number;
    readonly denominator: number;
    private static readonly MAX_DENOMINATOR;
    constructor(numerator: number, denominator?: number);
    private gcd;
    /**
     * Add two fractions
     */
    add(other: Fraction | number): Fraction;
    /**
     * Subtract two fractions
     */
    subtract(other: Fraction | number): Fraction;
    /**
     * Multiply two fractions
     */
    multiply(other: Fraction | number): Fraction;
    /**
     * Divide two fractions
     */
    divide(other: Fraction | number): Fraction;
    /**
     * Check equality (works for equivalent fractions like 1/2 = 2/4)
     */
    equals(other: Fraction | number | string): boolean;
    /**
     * Convert to decimal
     */
    toDecimal(): number;
    /**
     * Check if this is a whole number
     */
    isWhole(): boolean;
    /**
     * Get whole and fractional parts for mixed numbers
     */
    toMixedNumber(): {
        whole: number;
        fraction: Fraction | null;
    };
    /**
     * Convert to string representation
     */
    toString(): string;
    /**
     * Convert to Unicode representation if possible
     */
    toUnicode(): string;
    /**
     * Parse various string representations
     */
    static parse(str: string): Fraction | null;
    /**
     * Create fraction from decimal with optional target denominator
     */
    static fromDecimal(decimal: number, targetDenominator?: number): Fraction;
    private toFraction;
    /**
     * Check if a value is mathematically equivalent
     * Handles fractions, decimals, mixed formats, and multi-value answers
     */
    static areEquivalent(a: string | number, b: string | number): boolean;
}
