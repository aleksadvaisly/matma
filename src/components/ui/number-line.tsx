'use client';

import React from 'react';

interface NumberLineProps {
  min?: number;
  max?: number;
  selectedNumber?: number | null;
  onNumberClick?: (number: number) => void;
  showHints?: boolean;
  correctAnswer?: number;
  step?: number;
  markedNumbers?: { value: number; color: string; label?: string }[];
  enableAllClicks?: boolean;
  clickedNumbers?: number[];
}

export function NumberLine({ 
  min = -10, 
  max = 10, 
  selectedNumber, 
  onNumberClick,
  showHints = false,
  correctAnswer,
  markedNumbers = [],
  enableAllClicks = false,
  clickedNumbers = []
}: NumberLineProps) {
  const range = max - min;
  const step = range > 30 ? 5 : range > 15 ? 2 : 1;
  
  // Calculate actual display range (exclude first and last values)
  const displayMin = min + step;
  const displayMax = max - step;
  
  return (
    <div className="w-full overflow-x-auto pb-4">
      <svg width={Math.max(800, range * 40)} height="120" className="min-w-full">
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
        <polygon points={`${range * 40 + 50},60 ${range * 40 + 40},55 ${range * 40 + 40},65`} fill="black" />
        
        {/* Render all clickable units if enabled */}
        {enableAllClicks && onNumberClick && Array.from({ length: range + 1 }, (_, i) => {
          const value = min + i;
          if (value < displayMin || value > displayMax) return null;
          
          const x = 40 + ((value - min) / range) * (range * 40);
          const hasLabel = value % step === 0;
          const isClicked = clickedNumbers.includes(value);
          
          return (
            <g key={`click-${value}`}>
              {/* Clickable invisible area for each unit */}
              <rect
                x={x - 10}
                y={40}
                width={20}
                height={40}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onClick={() => onNumberClick(value)}
              />
              {/* Show label if clicked but not normally labeled */}
              {isClicked && !hasLabel && (
                <>
                  <line 
                    x1={x} 
                    y1="58" 
                    x2={x} 
                    y2="62" 
                    stroke="gray" 
                    strokeWidth="1"
                  />
                  <text 
                    x={x} 
                    y={90} 
                    textAnchor="middle" 
                    fontSize="12"
                    fill="gray"
                    style={{ pointerEvents: 'none' }}
                  >
                    {value}
                  </text>
                </>
              )}
            </g>
          );
        })}
        
        {/* Regular ticks and numbers */}
        {Array.from({ length: Math.floor(range/step) + 1 }, (_, i) => {
          const value = min + i * step;
          // Skip first and last values
          if (value < displayMin || value > displayMax) return null;
          
          const x = 40 + ((value - min) / range) * (range * 40);
          const isSelected = selectedNumber === value;
          const markedNumber = markedNumbers.find(m => m.value === value);
          
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
                  {/* Yellow hint dot when showHints is on and this is the correct answer */}
                  {showHints && correctAnswer === value && (
                    <circle
                      cx={x}
                      cy={60}
                      r="8"
                      fill="rgb(250 204 21)"
                      className="animate-pulse"
                    />
                  )}
                  {/* Selection highlight */}
                  <circle
                    cx={x}
                    cy={60}
                    r="15"
                    fill={isSelected ? 'blue' : 'transparent'}
                    fillOpacity={isSelected ? 0.3 : 0}
                  />
                </g>
              ) : (
                <>
                  {/* Non-clickable highlights */}
                  {showHints && correctAnswer === value && (
                    <circle
                      cx={x}
                      cy={60}
                      r="8"
                      fill="rgb(250 204 21)"
                      className="animate-pulse"
                    />
                  )}
                </>
              )}
              
              {/* Marked numbers (for specific visualizations) */}
              {markedNumber && (
                <circle
                  cx={x}
                  cy={60}
                  r="8"
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
                  isSelected ? 'blue' : 
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
  );
}