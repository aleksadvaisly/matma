'use client';

import { ReactNode } from 'react';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { ProgressDisplay } from '@/components/ui/progress-display';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

interface ExerciseHeaderProps {
  title: string;
  description: string;
  current: number;
  total: number;
  showHints: boolean;
  onHintsToggle: (checked: boolean) => void;
}

export function ExerciseHeader({ 
  title, 
  description, 
  current, 
  total, 
  showHints, 
  onHintsToggle 
}: ExerciseHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      <div className="flex items-center gap-4">
        <ProgressDisplay current={current} total={total} />
        <div className="flex items-center gap-2">
          <Label htmlFor="show-hints" className="text-sm">
            <Sparkles className="h-4 w-4" />
          </Label>
          <Switch
            id="show-hints"
            checked={showHints}
            onCheckedChange={onHintsToggle}
          />
        </div>
      </div>
    </div>
  );
}