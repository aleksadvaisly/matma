'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProgressDisplayProps {
  current: number;
  total: number;
  onPrevious?: () => void;
  onNext?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
}

export function ProgressDisplay({ 
  current, 
  total, 
  onPrevious, 
  onNext, 
  canGoPrevious = false, 
  canGoNext = false 
}: ProgressDisplayProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        style={{ cursor: canGoPrevious ? 'pointer' : 'not-allowed' }}
        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="text-sm font-medium text-muted-foreground px-2">
        {current}/{total}
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onNext}
        disabled={!canGoNext}
        style={{ cursor: canGoNext ? 'pointer' : 'not-allowed' }}
        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}