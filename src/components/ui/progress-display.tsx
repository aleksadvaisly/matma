'use client';

interface ProgressDisplayProps {
  current: number;
  total: number;
}

export function ProgressDisplay({ current, total }: ProgressDisplayProps) {
  return (
    <div className="text-sm font-medium text-muted-foreground">
      {current}/{total}
    </div>
  );
}