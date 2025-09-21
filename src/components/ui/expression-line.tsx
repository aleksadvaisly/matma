'use client';

import { cn } from '@/lib/utils';

interface ExpressionLineProps {
  terms: number[];
  className?: string;
}

export function ExpressionLine({ terms, className }: ExpressionLineProps) {
  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-2 text-3xl font-bold', className)}>
      {terms.map((term, idx) => {
        const signPrefix = idx === 0 ? '' : '+';
        const display = idx === 0
          ? term.toString()
          : term < 0
            ? `(${term})`
            : term.toString();
        const colorClass = term < 0 ? 'text-red-600' : 'text-green-600';

        return (
          <span key={`${term}-${idx}`} className={cn('px-1', colorClass)}>
            {idx === 0 ? display : `${signPrefix} ${display}`}
          </span>
        );
      })}
    </div>
  );
}
