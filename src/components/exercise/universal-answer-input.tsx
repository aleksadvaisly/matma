'use client';

import { Input } from '@/components/ui/input';
import { NumberLine } from '@/components/ui/number-line';
import { ChoiceButton, type ChoiceFeedbackState } from '@/components/ui/choice-button';
import { HintHighlightGroup } from '@/components/ui/hint-highlight';

type InputType = 'text' | 'choices' | 'number-line' | 'choice-grid';

interface BaseInputProps {
  value: string | number | null;
  onChange: (value: string | number) => void;
  disabled?: boolean;
  showHints?: boolean;
  correctAnswer?: string | number;
  showFeedback?: boolean;
  isCorrect?: boolean;
}

interface TextInputProps extends BaseInputProps {
  type: 'text';
  placeholder?: string;
  className?: string;
}

interface ChoicesInputProps extends BaseInputProps {
  type: 'choices';
  options: string[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  buttonSize?: 'sm' | 'md' | 'lg';
}

interface NumberLineInputProps extends BaseInputProps {
  type: 'number-line';
  min: number;
  max: number;
  markedNumbers?: Array<{ value: number; color: string }>;
  enableAllClicks?: boolean;
}

interface ChoiceGridInputProps extends BaseInputProps {
  type: 'choice-grid';
  choices: Array<{ value: string; label?: string }>;
  columns?: number;
}

type UniversalAnswerInputProps = 
  | TextInputProps 
  | ChoicesInputProps 
  | NumberLineInputProps
  | ChoiceGridInputProps;

export function UniversalAnswerInput(props: UniversalAnswerInputProps) {
  switch (props.type) {
    case 'text':
      return (
        <div className={`flex items-center gap-2 ${props.className || ''}`}>
          <Input
            type="text"
            value={props.value || ''}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            disabled={props.disabled}
            className={`${
              props.showHints && !props.showFeedback 
                ? 'bg-green-100 border-green-300 animate-pulse' 
                : ''
            }`}
          />
        </div>
      );

    case 'choices':
      const layoutClass = props.layout === 'horizontal' 
        ? 'flex-row' 
        : props.layout === 'grid'
        ? 'grid grid-cols-2 gap-2'
        : 'flex-col';
        
      const sizeClass = props.buttonSize === 'lg' 
        ? 'w-16 h-16'
        : props.buttonSize === 'sm'
        ? 'w-12 h-12'
        : 'w-14 h-14';

      return (
        <div className={`flex ${layoutClass} gap-4 items-center justify-center`}>
          <HintHighlightGroup 
            showHints={props.showHints || false} 
            correctAnswer={String(props.correctAnswer)}
          >
            {props.options.map((option) => {
              const selected = props.value === option;
              const isCorrectChoice = props.correctAnswer === option;
              const state: ChoiceFeedbackState = props.showFeedback && selected
                ? (props.isCorrect ? 'correct' : 'incorrect')
                : 'idle';

              return (
                <ChoiceButton
                  key={option}
                  data-value={option}
                  size={props.buttonSize}
                  selected={selected}
                  state={state}
                  revealCorrect={props.showFeedback}
                  isCorrectChoice={isCorrectChoice}
                  onClick={() => !props.disabled && props.onChange(option)}
                  className={sizeClass}
                >
                  {option}
                </ChoiceButton>
              );
            })}
          </HintHighlightGroup>
        </div>
      );

    case 'number-line':
      return (
        <NumberLine
          min={props.min}
          max={props.max}
          selectedNumber={props.value as number | null}
          onNumberClick={(num) => !props.disabled && props.onChange(num)}
          markedNumbers={props.markedNumbers}
          showHints={props.showHints}
          correctAnswer={props.correctAnswer as number}
          feedbackState={props.showFeedback 
            ? (props.isCorrect ? 'correct' : 'incorrect') 
            : 'idle'}
          enableAllClicks={props.enableAllClicks}
        />
      );

    case 'choice-grid':
      return (
        <div className={`grid grid-cols-${props.columns || 3} gap-3 max-w-2xl mx-auto`}>
          {props.choices.map((choice) => {
            const selected = props.value === choice.value;
            const isCorrectChoice = props.correctAnswer === choice.value;
            const state: ChoiceFeedbackState = props.showFeedback && selected
              ? (props.isCorrect ? 'correct' : 'incorrect')
              : 'idle';

            return (
              <ChoiceButton
                key={choice.value}
                selected={selected}
                state={state}
                revealCorrect={props.showFeedback}
                isCorrectChoice={isCorrectChoice}
                onClick={() => !props.disabled && props.onChange(choice.value)}
                className="h-20 text-lg"
              >
                {choice.label || choice.value}
              </ChoiceButton>
            );
          })}
        </div>
      );
  }
}