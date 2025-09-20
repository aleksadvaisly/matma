'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InfoBoxProps {
  title: string;
  items: string[];
}

export function InfoBox({ title, items }: InfoBoxProps) {
  return (
    <Card className="mt-6 bg-muted/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
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