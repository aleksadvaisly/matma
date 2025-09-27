'use client';

import { useState, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { X, Undo2 } from 'lucide-react';

interface SequenceBuilderProps {
  choices: string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  separator?: string;
}

export function SequenceBuilder({ 
  choices, 
  value, 
  onChange, 
  disabled = false,
  separator = ';'
}: SequenceBuilderProps) {
  const [availableChoices, setAvailableChoices] = useState<string[]>(choices);
  const [selectedSequence, setSelectedSequence] = useState<string[]>([]);

  useEffect(() => {
    const currentSequence = value ? value.split(separator).map(s => s.trim()).filter(Boolean) : [];
    setSelectedSequence(currentSequence);
    setAvailableChoices(choices.filter(choice => !currentSequence.includes(choice)));
  }, [value, choices, separator]);

  const handleButtonClick = (clickedValue: string) => {
    if (disabled) return;
    
    const newSequence = [...selectedSequence, clickedValue];
    setSelectedSequence(newSequence);
    setAvailableChoices(prev => prev.filter(item => item !== clickedValue));
    onChange(newSequence.join(separator));
  };

  const handleClear = () => {
    if (disabled) return;
    
    setAvailableChoices(choices);
    setSelectedSequence([]);
    onChange('');
  };

  const handleUndo = () => {
    if (disabled || selectedSequence.length === 0) return;
    
    const lastItem = selectedSequence[selectedSequence.length - 1];
    const newSequence = selectedSequence.slice(0, -1);
    
    setSelectedSequence(newSequence);
    setAvailableChoices(prev => [...prev, lastItem].sort((a, b) => {
      const indexA = choices.indexOf(a);
      const indexB = choices.indexOf(b);
      return indexA - indexB;
    }));
    onChange(newSequence.join(separator));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Input 
          value={selectedSequence.join(separator)} 
          readOnly 
          placeholder="Kliknij przyciski poniżej w odpowiedniej kolejności"
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleUndo}
          disabled={disabled || selectedSequence.length === 0}
          title="Cofnij ostatni wybór"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleClear}
          disabled={disabled || selectedSequence.length === 0}
          title="Wyczyść wszystko"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {availableChoices.map(choice => (
          <Button
            key={choice}
            type="button"
            variant="outline"
            onClick={() => handleButtonClick(choice)}
            disabled={disabled}
            className="min-w-[4rem] px-3 py-2"
          >
            {choice}
          </Button>
        ))}
      </div>

      {selectedSequence.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Wybrane: {selectedSequence.length} z {choices.length}
        </div>
      )}
    </div>
  );
}