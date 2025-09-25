'use client';

import React from 'react';
import { FractionUtils } from '@/lib/fraction-utils';

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
  tickSpacing?: number; // Override automatic tick spacing for integers
  // Fraction support
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
  subdivision = 1,
  fractionDisplay = true,
  allowFractionalClick = true
}: NumberLineProps) {
  const range = max - min;
  
  // Separate logic for fractions vs integers
  if (subdivision > 1) {
    // FRACTION PATH - use fractional positions and wider spacing
    const positions = FractionUtils.getFractionalPositions(min, max, subdivision);
    const majorPositions = positions.filter(pos => pos % 1 === 0);
    const minorPositions = positions.filter(pos => pos % 1 !== 0);
    
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
              const x = 40 + ((position - min) / range) * (range * 80);
              const isSelected = Math.abs((selectedNumber || 0) - position) < 1e-6;
              const isClicked = clickedNumbers.some(num => Math.abs(num - position) < 1e-6);
              const markedNumber = markedNumbers.find(m => Math.abs(m.value - position) < 1e-6);
              const isCorrectAnswer = Math.abs((correctAnswer || 0) - position) < 1e-6;
              
              return (
                <g key={`minor-${position}`}>
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
                              ? FractionUtils.formatForNumberLine(position, subdivision)
                              : position.toFixed(3).replace(/\.?0+$/, '')
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
              const x = 40 + ((position - min) / range) * (range * 80);
              const isSelected = Math.abs((selectedNumber || 0) - position) < 1e-6;
              const markedNumber = markedNumbers.find(m => Math.abs(m.value - position) < 1e-6);
              const isCorrectAnswer = Math.abs((correctAnswer || 0) - position) < 1e-6;
              
              return (
                <g key={`major-${position}`}>
                  {/* Major tick mark */}
                  <line 
                    x1={x} 
                    y1="55" 
                    x2={x} 
                    y2="65" 
                    stroke="black" 
                    strokeWidth="2"
                  />
                  
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
                    {position}
                  </text>
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
}