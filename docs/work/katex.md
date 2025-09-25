# KaTeX Integration Plan (Future)

## Current State
- Fraction display via Unicode mappings (½, ⅓, ⅔) in `Fraction.toUnicode()`
- Fallback to text "11/37" for unmapped fractions
- Zero rendering dependencies
- Optimal for current 6th grade exercises

## Future Requirements
When exercises expand to include:
- Complex expressions with parentheses: (2/3 + 1/4) × 5
- Multi-level fractions: ½ ÷ ⅓ 
- Order of operations visualization
- Algebraic expressions with variables
- Equation solving steps

## Implementation Plan

### 1. Add Dependencies
```json
{
  "dependencies": {
    "katex": "^0.16.9"
  },
  "devDependencies": {
    "@types/katex": "^0.16.7"
  }
}
```

### 2. Import Styles
In `src/app/layout.tsx`:
```typescript
import 'katex/dist/katex.min.css'
```

### 3. Create MathRender Component
```typescript
// src/components/math/math-render.tsx
import katex from 'katex'

interface MathRenderProps {
  latex: string
  displayMode?: boolean
  throwOnError?: boolean
}

export function MathRender({ latex, displayMode = false, throwOnError = false }: MathRenderProps) {
  const html = katex.renderToString(latex, {
    displayMode,
    throwOnError,
    output: 'html'
  })
  
  return (
    <span 
      dangerouslySetInnerHTML={{ __html: html }}
      className="math-content"
    />
  )
}
```

### 4. Extend Fraction Class
```typescript
// Add to src/lib/fraction.ts
export class Fraction {
  // ... existing code ...
  
  /**
   * Convert to LaTeX representation
   */
  toLatex(): string {
    if (this.denominator === 1) {
      return String(this.numerator)
    }
    
    const mixed = this.toMixedNumber()
    if (mixed.whole !== 0 && mixed.fraction) {
      // Mixed number: 2\frac{1}{3}
      return `${mixed.whole}\\frac{${mixed.fraction.numerator}}{${mixed.fraction.denominator}}`
    }
    
    // Simple fraction: \frac{1}{3}
    return `\\frac{${this.numerator}}{${this.denominator}}`
  }
}
```

### 5. Progressive Migration Strategy

#### Phase 1: Keep Current System (NOW)
- Continue using `Fraction.toUnicode()` for simple fractions
- No KaTeX dependency yet
- Focus on implementing missing exercises

#### Phase 2: Hybrid Approach (WHEN NEEDED)
- Add KaTeX only for complex expressions
- Keep Unicode for simple fractions (performance)
- Use MathRender only where necessary:
```typescript
// Simple: use Unicode
<span>{fraction.toUnicode()}</span>

// Complex: use KaTeX
<MathRender latex="\\frac{2}{3} + \\frac{1}{4} = \\frac{11}{12}" />
```

#### Phase 3: Full LaTeX (IF REQUIRED)
- When majority of content needs complex rendering
- Consider server-side rendering for performance
- Cache rendered LaTeX strings

## Alternative Lightweight Solutions

### 1. CSS-Only Fractions
```css
.fraction {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.9em;
  vertical-align: middle;
}

.fraction-num {
  border-bottom: 1px solid currentColor;
  padding: 0 0.2em;
}

.fraction-den {
  padding: 0 0.2em;
}
```

### 2. SVG Fraction Generator
```typescript
function fractionToSVG(num: number, den: number): string {
  return `<svg viewBox="0 0 ${Math.max(num.toString().length, den.toString().length) * 10} 30">
    <text x="50%" y="10" text-anchor="middle">${num}</text>
    <line x1="0" y1="15" x2="100%" y2="15" stroke="black"/>
    <text x="50%" y="25" text-anchor="middle">${den}</text>
  </svg>`
}
```

### 3. OpenType Fraction Features
```css
.math-text {
  font-feature-settings: "frac" 1;
  /* Automatically converts 1/2 to ½ in supporting fonts */
}
```

## Performance Considerations

| Solution | Bundle Size | Runtime Cost | Complexity |
|----------|------------|--------------|------------|
| Current Unicode | 0 KB | Instant | Low |
| CSS Fractions | 0 KB | Instant | Low |
| SVG Generator | ~1 KB | Minimal | Medium |
| KaTeX | 300 KB | High | High |

## Decision Criteria for KaTeX

Add KaTeX ONLY when:
1. Exercises require multi-line equations
2. Need matrix notation
3. Complex algebraic expressions become primary content
4. Current Unicode approach fails >50% of use cases

## Current Recommendation: WAIT

- System works perfectly for 6th grade level
- Focus on implementing remaining 178 exercises
- Revisit when content complexity demands it
- Monitor actual user needs vs hypothetical requirements

## Notes
- Package.json currently missing katex dependency (line 11)
- Next.js config supports CSS imports from node_modules
- SSR considerations needed for KaTeX to avoid hydration issues
- Consider MathJax as alternative (better accessibility, larger bundle)