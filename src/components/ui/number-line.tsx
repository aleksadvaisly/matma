'use client';

import React from 'react';
import { Fraction } from '@/lib/fraction';

interface NumberLineProps {
  min?: number;
  max?: number;
  selectedNumber?: Fraction | number | null;
  onNumberClick?: (value: Fraction | number) => void;
  showHints?: boolean;
  correctAnswer?: Fraction | number | string; // Allow string for parsing from DB
  step?: number;
  markedNumbers?: { value: Fraction | number; color: string; label?: string }[];
  enableAllClicks?: boolean;
  clickedNumbers?: (Fraction | number)[];
  feedbackState?: 'idle' | 'correct' | 'incorrect';
  tickSpacing?: number; // Override automatic tick spacing for integers
  // Fraction support - NEW APPROACH
  resolution?: string; // e.g., "1/2", "1/4" - defines clickable granularity
  captionOnEvery?: number; // e.g., 1 - show labels every N units
  // Legacy support (will be deprecated)
  subdivision?: number; // 1 for integers, 2 for halves, 3 for thirds, etc.
  fractionDisplay?: boolean; // Whether to show fractions in Unicode format
  allowFractionalClick?: boolean; // Whether clicking on fractional positions is allowed
}

export function NumberLine({ 
  min = -10, 
  max = 10, 
  selectedNumber, 
  onNumberClick,
  showHints = false,
  correctAnswer,
  markedNumbers = [],
  enableAllClicks = true,
  clickedNumbers = [],
  feedbackState = 'idle',
  tickSpacing,
  resolution,
  captionOnEvery,
  subdivision = 1,
  fractionDisplay = true,
  allowFractionalClick = true
}: NumberLineProps) {
  const range = max - min;
  
  // Helper to parse correctAnswer to Fraction if needed
  const correctAnswerFraction = correctAnswer !== undefined
    ? (typeof correctAnswer === 'string' 
        ? Fraction.parse(correctAnswer)
        : correctAnswer instanceof Fraction 
          ? correctAnswer
          : new Fraction(correctAnswer as number))
    : null;
  
  // NEW: Determine effective subdivision from resolution string
  let effectiveSubdivision = subdivision;
  if (resolution) {
    const resFraction = Fraction.parse(resolution);
    if (resFraction) {
      // subdivision = denominator / numerator
      // e.g., "1/2" -> subdivision = 2, "1/4" -> subdivision = 4
      effectiveSubdivision = resFraction.denominator / resFraction.numerator;
    }
  }
  
  // Use captionOnEvery if provided, otherwise default to showing all integers
  const labelEvery = captionOnEvery || 1;
  
  // Helper to parse selectedNumber to Fraction if needed for comparison
  const selectedFraction = selectedNumber !== null && selectedNumber !== undefined
    ? (selectedNumber instanceof Fraction
        ? selectedNumber
        : new Fraction(selectedNumber as number))
    : null;
  
  // Helper function to compare values (Fraction or number)
  const areValuesEqual = (a: Fraction | number | null | undefined, b: Fraction | number | null | undefined): boolean => {
    if (a === null || a === undefined || b === null || b === undefined) return false;
    
    // Convert both to Fractions for comparison
    const fa = a instanceof Fraction ? a : new Fraction(a);
    const fb = b instanceof Fraction ? b : new Fraction(b);
    
    return fa.equals(fb);
  };
  
  // Separate logic for fractions vs integers
  if (effectiveSubdivision > 1) {
    // FRACTION PATH - use exact Fraction objects
    // Generate positions as Fractions
    const positions: Fraction[] = [];
    for (let i = min * effectiveSubdivision; i <= max * effectiveSubdivision; i++) {
      positions.push(new Fraction(i, effectiveSubdivision));
    }
    const majorPositions = positions.filter(pos => pos.isWhole());
    const minorPositions = positions.filter(pos => !pos.isWhole());
    
    return (
      <div className="w-full flex justify-center pb-4">
        <div className="overflow-x-auto">
          <svg width={Math.max(800, range * 80 + 80)} height="120" className="block mx-auto">
            {/* Main line */}
            <line 
              x1="40" 
              y1="60" 
              x2={range * 80 + 40} 
              y2="60" 
              stroke="black" 
              strokeWidth="2"
            />
            
            {/* Arrow end - only right */}
            <polygon 
              points={`${range * 80 + 50},60 ${range * 80 + 40},55 ${range * 80 + 40},65`} 
              fill="black" 
            />
            
            {/* Minor (fractional) ticks */}
            {minorPositions.map((position) => {
              const x = 40 + ((position.toDecimal() - min) / range) * (range * 80);
              const isSelected = areValuesEqual(selectedFraction, position);
              const isClicked = clickedNumbers.some(num => areValuesEqual(num, position));
              const markedNumber = markedNumbers.find(m => areValuesEqual(m.value, position));
              const isCorrectAnswer = areValuesEqual(correctAnswerFraction, position);
              
              return (
                <g key={`minor-${position.toString()}`}>
                  {/* Minor tick mark */}
                  <line 
                    x1={x} 
                    y1="57"
                    y2="63"
                    x2={x} 
                    stroke="gray" 
                    strokeWidth="1"
                    opacity="0.7"
                  />
                  
                  {/* Clickable area for minor tick */}
                  {onNumberClick && allowFractionalClick && (
                    <g
                      onClick={() => onNumberClick(position)}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect
                        x={x - 15}
                        y={40}
                        width={30}
                        height={40}
                        fill="transparent"
                      />
                      
                      {/* Green hint dot */}
                      {showHints && isCorrectAnswer && (
                        <circle
                          cx={x}
                          cy={60}
                          r="6"
                          fill="rgb(34 197 94)"
                          className="animate-pulse"
                        />
                      )}
                      
                      {/* Selection highlight */}
                      {isSelected && (
                        <>
                          <circle
                            cx={x}
                            cy={60}
                            r="12"
                            fill={feedbackState === 'correct'
                              ? 'rgb(34 197 94)'
                              : feedbackState === 'incorrect'
                                ? 'rgb(239 68 68)'
                                : 'rgb(250 204 21)'}
                            fillOpacity="0.25"
                          />
                          <text 
                            x={x} 
                            y={90} 
                            textAnchor="middle" 
                            fontSize="12"
                            fontWeight="bold"
                            fill={feedbackState === 'correct'
                              ? 'rgb(34 197 94)'
                              : feedbackState === 'incorrect'
                                ? 'rgb(239 68 68)'
                                : 'rgb(250 204 21)'}
                            style={{ pointerEvents: 'none' }}
                          >
                            {fractionDisplay 
                              ? position.toUnicode()
                              : position.toDecimal().toFixed(3).replace(/\.?0+$/, '')
                            }
                          </text>
                        </>
                      )}
                    </g>
                  )}
                </g>
              );
            })}
            
            {/* Major (integer) ticks and numbers */}
            {majorPositions.map((position) => {
              const x = 40 + ((position.toDecimal() - min) / range) * (range * 80);
              const isSelected = areValuesEqual(selectedFraction, position);
              const markedNumber = markedNumbers.find(m => areValuesEqual(m.value, position));
              const isCorrectAnswer = areValuesEqual(correctAnswerFraction, position);
              
              return (
                <g key={`major-${position.toString()}`}>
                  {/* Major tick mark - hide at edges */}
                  {position.toDecimal() !== min && position.toDecimal() !== max && (
                    <line 
                      x1={x} 
                      y1="55" 
                      x2={x} 
                      y2="65" 
                      stroke="black" 
                      strokeWidth="2"
                    />
                  )}
                  
                  {/* Clickable area and highlights */}
                  {onNumberClick && (
                    <g
                      onClick={() => onNumberClick(position)}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect
                        x={x - 20}
                        y={40}
                        width={40}
                        height={40}
                        fill="transparent"
                      />
                      
                      {/* Green hint dot */}
                      {showHints && isCorrectAnswer && (
                        <circle
                          cx={x}
                          cy={60}
                          r="8"
                          fill="rgb(34 197 94)"
                          className="animate-pulse"
                        />
                      )}
                      
                      {/* Selection highlight */}
                      <circle
                        cx={x}
                        cy={60}
                        r="15"
                        fill={isSelected
                          ? feedbackState === 'correct'
                            ? 'rgb(34 197 94)'
                            : feedbackState === 'incorrect'
                              ? 'rgb(239 68 68)'
                              : 'rgb(250 204 21)'
                          : 'transparent'}
                        fillOpacity={isSelected ? 0.25 : 0}
                      />
                    </g>
                  )}
                  
                  {/* Number label - hide at edges and show based on captionOnEvery */}
                  {position.toDecimal() !== min && position.toDecimal() !== max && 
                   position.numerator % labelEvery === 0 && (
                    <text 
                      x={x} 
                      y={90} 
                      textAnchor="middle" 
                      fontSize="14"
                      fontWeight={isSelected || markedNumber ? 'bold' : 'normal'}
                      fill={
                        markedNumber ? markedNumber.color :
                        isSelected ? (
                          feedbackState === 'correct'
                            ? 'rgb(34 197 94)'
                            : feedbackState === 'incorrect'
                              ? 'rgb(239 68 68)'
                              : 'rgb(250 204 21)'
                        ) : 
                        'black'
                      }
                      style={{ pointerEvents: 'none' }}
                    >
                      {position.numerator}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  } else {
    // INTEGER PATH - restore original simple logic with minor ticks
    const step = tickSpacing || (range > 30 ? 5 : range > 15 ? 2 : 1);
    
    // Calculate actual display range (exclude first and last values)
    const displayMin = min + step;
    const displayMax = max - step;
    
    return (
      <div className="w-full flex justify-center pb-4">
        <div className="overflow-x-auto">
          <svg width={Math.max(800, range * 40 + 80)} height="120" className="block mx-auto">
            {/* Main line */}
            <line 
              x1="40" 
              y1="60" 
              x2={range * 40 + 40} 
              y2="60" 
              stroke="black" 
              strokeWidth="2"
            />
            
            {/* Arrow end - only right */}
            <polygon 
              points={`${range * 40 + 50},60 ${range * 40 + 40},55 ${range * 40 + 40},65`} 
              fill="black" 
            />
            
            {/* Minor ticks for ALL integers when enableAllClicks is true */}
            {enableAllClicks && Array.from({ length: range + 1 }, (_, i) => {
              const value = min + i;
              if (value < displayMin || value > displayMax) return null;
              
              // Skip if this is a major tick (with label)
              if (value % step === 0) return null;
              
              const x = 40 + ((value - min) / range) * (range * 40);
              const isSelected = selectedNumber === value;
              const isClicked = clickedNumbers.includes(value);
              const isCorrectAnswer = correctAnswer === value;
              
              return (
                <g key={`minor-${value}`}>
                  {/* Minor tick mark */}
                  <line 
                    x1={x} 
                    y1="57"
                    y2="63"
                    x2={x} 
                    stroke="gray" 
                    strokeWidth="1"
                    opacity="0.5"
                  />
                  
                  {/* Clickable area for minor tick */}
                  {onNumberClick && (
                    <g
                      onClick={() => onNumberClick(value)}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect
                        x={x - 10}
                        y={40}
                        width={20}
                        height={40}
                        fill="transparent"
                      />
                      
                      {/* Green hint dot for correct answer */}
                      {showHints && isCorrectAnswer && (
                        <circle
                          cx={x}
                          cy={60}
                          r="6"
                          fill="rgb(34 197 94)"
                          className="animate-pulse"
                        />
                      )}
                      
                      {/* Yellow circle when selected */}
                      {isSelected && (
                        <>
                          <circle
                            cx={x}
                            cy={60}
                            r="15"
                            fill={feedbackState === 'correct'
                              ? 'rgb(34 197 94)'
                              : feedbackState === 'incorrect'
                                ? 'rgb(239 68 68)'
                                : 'rgb(250 204 21)'}
                            fillOpacity="0.25"
                          />
                          <text 
                            x={x} 
                            y={90} 
                            textAnchor="middle" 
                            fontSize="14"
                            fontWeight="bold"
                            fill={feedbackState === 'correct'
                              ? 'rgb(34 197 94)'
                              : feedbackState === 'incorrect'
                                ? 'rgb(239 68 68)'
                                : 'rgb(250 204 21)'}
                            style={{ pointerEvents: 'none' }}
                          >
                            {value}
                          </text>
                        </>
                      )}
                      
                      {/* Gray feedback for clicked but not selected */}
                      {!isSelected && isClicked && (
                        <circle
                          cx={x}
                          cy={60}
                          r="6"
                          fill="gray"
                          fillOpacity="0.2"
                        />
                      )}
                    </g>
                  )}
                </g>
              );
            })}
            
            {/* Regular ticks and numbers at step intervals */}
            {Array.from({ length: Math.floor(range/step) + 1 }, (_, i) => {
              const value = min + i * step;
              // Skip first and last values
              if (value < displayMin || value > displayMax) return null;
              
              const x = 40 + ((value - min) / range) * (range * 40);
              const isSelected = selectedNumber === value;
              const markedNumber = markedNumbers.find(m => m.value === value);
              const isCorrectAnswer = correctAnswer === value;
              
              return (
                <g key={value}>
                  {/* Tick mark */}
                  <line 
                    x1={x} 
                    y1="55" 
                    x2={x} 
                    y2="65" 
                    stroke="black" 
                    strokeWidth="2"
                  />
                  
                  {/* Clickable area and highlights */}
                  {onNumberClick ? (
                    <g
                      onClick={() => onNumberClick(value)}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect
                        x={x - 20}
                        y={40}
                        width={40}
                        height={40}
                        fill="transparent"
                      />
                      
                      {/* Green hint dot */}
                      {showHints && isCorrectAnswer && (
                        <circle
                          cx={x}
                          cy={60}
                          r="8"
                          fill="rgb(34 197 94)"
                          className="animate-pulse"
                        />
                      )}
                      
                      {/* Selection highlight */}
                      <circle
                        cx={x}
                        cy={60}
                        r="15"
                        fill={isSelected
                          ? feedbackState === 'correct'
                            ? 'rgb(34 197 94)'
                            : feedbackState === 'incorrect'
                              ? 'rgb(239 68 68)'
                              : 'rgb(250 204 21)'
                          : 'transparent'}
                        fillOpacity={isSelected ? 0.25 : 0}
                      />
                    </g>
                  ) : (
                    <circle
                      cx={x}
                      cy={60}
                      r="15"
                      fill={isSelected
                        ? feedbackState === 'correct'
                          ? 'rgb(34 197 94)'
                          : feedbackState === 'incorrect'
                            ? 'rgb(239 68 68)'
                            : 'rgb(250 204 21)'
                        : 'transparent'}
                      fillOpacity={isSelected ? 0.25 : 0}
                    />
                  )}
                  
                  {/* Marked numbers (for specific visualizations) */}
                  {markedNumber && (
                    <circle
                      cx={x}
                      cy={60}
                      r="5.6"
                      fill={markedNumber.color}
                      style={{ pointerEvents: 'none' }}
                    />
                  )}
                  
                  {/* Number label */}
                  <text 
                    x={x} 
                    y={90} 
                    textAnchor="middle" 
                    fontSize="14"
                    fontWeight={isSelected || markedNumber ? 'bold' : 'normal'}
                    fill={
                      markedNumber ? markedNumber.color :
                      isSelected ? (
                        feedbackState === 'correct'
                          ? 'rgb(34 197 94)'
                          : feedbackState === 'incorrect'
                            ? 'rgb(239 68 68)'
                            : 'rgb(250 204 21)'
                      ) : 
                      'black'
                    }
                    style={{ pointerEvents: 'none' }}
                  >
                    {value}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  }
}