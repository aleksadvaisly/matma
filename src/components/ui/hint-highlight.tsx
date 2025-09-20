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
        // Primarily use children text for buttons
        const childValue = (typeof child.props.children === 'string' ? child.props.children : null) ||
                          child.props.value || 
                          child.props['data-value'] ||
                          child.key;
        
        const shouldHighlight = showHints && childValue && hintValues.includes(childValue);
        
        if (!shouldHighlight) return child;
        
        // Clone element with additional hint classes - green pulsing
        const existingClassName = child.props.className || '';
        const newClassName = `${existingClassName} bg-green-200 border-green-200 hover:bg-green-300 hover:border-green-300 animate-pulse`.trim();
        
        return React.cloneElement(child as React.ReactElement<any>, {
          ...child.props,
          className: newClassName
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