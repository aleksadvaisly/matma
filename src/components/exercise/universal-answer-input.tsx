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
  options: (string | { text: string; value: string })[];
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
        
      // Calculate max text length for dynamic width
      const allTexts = props.options.map((opt) => 
        typeof opt === 'string' ? opt : opt.text || opt.value
      );
      const maxLength = Math.max(...allTexts.map((text) => text.length));
      
      // Base size classes with padding instead of fixed width
      const sizeClass = props.buttonSize === 'lg' 
        ? 'px-4 py-3 text-lg'
        : props.buttonSize === 'sm'
        ? 'px-3 py-2 text-sm'
        : 'px-3 py-2.5 text-base';
      
      // Dynamic width class based on longest text
      const widthClass = maxLength > 10 ? 'min-w-[10rem]' :
                        maxLength > 8 ? 'min-w-[8rem]' :
                        maxLength > 6 ? 'min-w-[6rem]' : 
                        'min-w-[4rem]';

      return (
        <div className={`flex ${layoutClass} gap-4 items-center justify-center`}>
          <HintHighlightGroup 
            showHints={props.showHints || false} 
            correctAnswer={String(props.correctAnswer)}
          >
            {props.options.map((option) => {
              const optionValue = typeof option === 'string' ? option : option.value;
              const optionText = typeof option === 'string' ? option : option.text;
              const selected = props.value === optionValue;
              const isCorrectChoice = props.correctAnswer === optionValue;
              const state: ChoiceFeedbackState = props.showFeedback && selected
                ? (props.isCorrect ? 'correct' : 'incorrect')
                : 'idle';

              return (
                <ChoiceButton
                  key={optionValue}
                  data-value={optionValue}
                  size={props.buttonSize}
                  selected={selected}
                  state={state}
                  revealCorrect={props.showFeedback}
                  isCorrectChoice={isCorrectChoice}
                  onClick={() => !props.disabled && props.onChange(optionValue)}
                  className={`${sizeClass} ${widthClass}`}
                >
                  {optionText}
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