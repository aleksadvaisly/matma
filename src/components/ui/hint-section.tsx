'use client';

import React, { useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lightbulb } from 'lucide-react';

interface HintSectionProps {
  hints: string[];
  title?: string;
}

export function HintSection({ hints, title = "Wskazówki" }: HintSectionProps) {
  const [showHints, setShowHints] = useState(false);

  if (!hints || hints.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Label htmlFor="show-hints" className="text-sm font-medium">
          {title}
        </Label>
        <Switch
          id="show-hints"
          checked={showHints}
          onCheckedChange={setShowHints}
        />
      </div>
      
      {showHints && (
        <div className="space-y-2">
          {hints.map((hint, index) => (
            <Alert key={index} className="border-yellow-200 bg-yellow-50 text-yellow-900">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                {hint}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
}