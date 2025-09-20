'use client';

import React from 'react';

interface HintHighlightProps {
  showHints?: boolean;
  hintValues?: (string | number)[];
  children: React.ReactNode;
}

export function HintHighlight({ 
  showHints = false, 
  hintValues = [], 
  children 
}: HintHighlightProps) {
  return (
    <>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        
        // Check if this child's value should be highlighted
        const childValue = child.props.value || child.props.children;
        const shouldHighlight = showHints && hintValues.includes(childValue);
        
        if (!shouldHighlight) return child;
        
        // Clone element with additional hint classes
        return React.cloneElement(child as React.ReactElement<any>, {
          className: `${child.props.className || ''} bg-yellow-200 border-yellow-200 hover:bg-yellow-300 hover:border-yellow-300 animate-pulse`.trim()
        });
      })}
    </>
  );
}

interface HintHighlightGroupProps {
  showHints?: boolean;
  correctAnswer?: string | number;
  children: React.ReactNode;
}

export function HintHighlightGroup({ 
  showHints = false, 
  correctAnswer, 
  children 
}: HintHighlightGroupProps) {
  return (
    <HintHighlight 
      showHints={showHints} 
      hintValues={correctAnswer ? [correctAnswer] : []}
    >
      {children}
    </HintHighlight>
  );
}