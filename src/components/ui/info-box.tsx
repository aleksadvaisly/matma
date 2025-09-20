'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface InfoBoxProps {
  title: string;
  items: string[];
}

export function InfoBox({ title, items }: InfoBoxProps) {
  return (
    <Card className="mt-6 bg-yellow-50/70">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, index) => (
          <p key={index} className="text-sm text-muted-foreground">
            • {item}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}