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
  feedbackState?: 'idle' | 'correct' | 'incorrect';
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
  clickedNumbers = [],
  feedbackState = 'idle'
}: NumberLineProps) {
  const range = max - min;
  const step = range > 30 ? 5 : range > 15 ? 2 : 1;
  
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
        <polygon points={`${range * 40 + 50},60 ${range * 40 + 40},55 ${range * 40 + 40},65`} fill="black" />
        
        
        {/* Minor ticks for all units (without labels) - only show if not enableAllClicks */}
        {!enableAllClicks && Array.from({ length: range + 1 }, (_, i) => {
          const value = min + i;
          if (value < displayMin || value > displayMax) return null;
          
          // Skip if this is a major tick (with label)
          if (value % step === 0) return null;
          
          const x = 40 + ((value - min) / range) * (range * 40);
          
          return (
            <line 
              key={`minor-tick-${value}`}
              x1={x} 
              y1="57"
              y2="63"
              x2={x} 
              stroke="gray" 
              strokeWidth="1"
              opacity="0.5"
            />
          );
        })}
        
        {/* Minor ticks with click areas when enableAllClicks is true */}
        {enableAllClicks && Array.from({ length: range + 1 }, (_, i) => {
          const value = min + i;
          if (value < displayMin || value > displayMax) return null;
          
          // Skip if this is a major tick (with label)
          if (value % step === 0) return null;
          
          const x = 40 + ((value - min) / range) * (range * 40);
          const isSelected = selectedNumber === value;
          const isClicked = clickedNumbers.includes(value);
          
          return (
            <g key={`minor-click-${value}`}>
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
                  {/* Additional visual feedback for clicked numbers if needed */}
                  {!isSelected && isClicked && (
                    <circle
                      cx={x}
                      cy={60}
                      r="8"
                      fill="gray"
                      fillOpacity="0.2"
                    />
                  )}
                </g>
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
                  {/* Green hint dot when showHints is on and this is the correct answer */}
                  {showHints && correctAnswer === value && (
                    <circle
                      cx={x}
                      cy={60}
                      r="8"
                      fill="rgb(34 197 94)"
                      className="animate-pulse"
                    />
                  )}
                  {/* Selection highlight - yellow */}
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
                <>
                  {/* Non-clickable highlights */}
                  {showHints && correctAnswer === value && (
                    <circle
                      cx={x}
                      cy={60}
                      r="8"
                      fill="rgb(34 197 94)"
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
