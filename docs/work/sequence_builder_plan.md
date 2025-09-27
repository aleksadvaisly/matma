# Plan for Implementing Sequence Builder Input Type

Date: 2025-09-26
Status: To be implemented

## Overview
Implement a new input type for ordering exercises (like 1-1-11) where students click buttons in sequence to build their answer, instead of typing semicolon-separated values.

## User Requirements
- Exercise shows: "Uporządkuj liczby od najmniejszej do największej:"
- Below are clickable buttons, each showing one value (-1,9  -0,4  ⅖  etc.)
- Clicking a button appends that value to an input field
- If input already has values, append with semicolon separator
- User builds the answer by clicking buttons in correct order

## Implementation Plan

### 1. Create New Input Type: `sequence-builder`

Add to `universal-answer-input.tsx`:
```typescript
interface SequenceBuilderInputProps extends BaseInputProps {
  type: 'sequence-builder';
  choices: string[];  // Available values to order
  separator?: string; // Default: ';'
}
```

### 2. Create New Component: `sequence-builder.tsx`

Location: `/src/components/ui/sequence-builder.tsx`

**Features:**
- Display available choices as clickable buttons
- Show current sequence in a read-only input field
- Click button → append to sequence (with semicolon separator)
- Clicked buttons become disabled/hidden
- Clear button to reset
- Undo button to remove last selection

**State Management:**
- Track available choices (not yet selected)
- Track selected sequence (order matters)
- Convert sequence to semicolon-separated string for the answer

**Component Structure:**
```jsx
const SequenceBuilder = ({ choices, value, onChange, disabled }) => {
  const [availableChoices, setAvailableChoices] = useState(choices);
  const [selectedSequence, setSelectedSequence] = useState([]);

  const handleButtonClick = (clickedValue) => {
    // Add to sequence
    const newSequence = [...selectedSequence, clickedValue];
    setSelectedSequence(newSequence);
    
    // Remove from available
    setAvailableChoices(prev => prev.filter(item => item !== clickedValue));
    
    // Update parent
    onChange(newSequence.join(';'));
  };

  const handleClear = () => {
    setAvailableChoices(choices);
    setSelectedSequence([]);
    onChange('');
  };

  const handleUndo = () => {
    // Remove last item and add it back to available
  };

  return (
    <div>
      <div className="sequence-display">
        <input value={selectedSequence.join(';')} readOnly />
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleUndo}>Undo</button>
      </div>
      <div className="choices-buttons">
        {availableChoices.map(choice => (
          <button key={choice} onClick={() => handleButtonClick(choice)}>
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
};
```

### 3. Update `universal-answer-input.tsx`

- Import the new `SequenceBuilder` component
- Add `SequenceBuilderInputProps` to the union type
- Add new case in the switch statement:
```typescript
case 'sequence-builder':
  return <SequenceBuilder {...props} />;
```

### 4. Update Database

**Add new input type:**
```sql
INSERT INTO input_types (id, type_name) VALUES (5, 'sequence-builder');
```

**Update exercises 1-1-11:**
```sql
UPDATE exercises 
SET input_type_id = 5 
WHERE id LIKE '1-1-11-%';
```

**Add visual configs:**
```sql
INSERT OR REPLACE INTO visual_configs (exercise_id, config_type, config_json) VALUES
('1-1-11-a', 'sequence-builder', '{"choices": ["-2,8", "⅝", "-0,5", "0,05", "-0,1", "-2", "-1"]}'),
('1-1-11-b', 'sequence-builder', '{"choices": ["-3,2", "¾", "-0,7", "0,1", "-0,3", "-2,5", "-1,5"]}'),
('1-1-11-c', 'sequence-builder', '{"choices": ["-1,9", "⅖", "-0,4", "0,02", "-0,2", "-1,5", "-0,8"]}');
```

### 5. Update exercise-card.tsx

Add support for parsing sequence-builder configuration from numberLineConfig/visualConfig.

### 6. Update API route

Ensure the API passes through the choices array for sequence-builder exercises.

## Benefits

1. **Better UX** - No typing errors, clear visual feedback
2. **Clean Architecture** - Follows existing patterns
3. **Reusable** - Can be used for any ordering task
4. **Accessible** - Buttons are easier than typing for many students
5. **Maintainable** - Self-contained component with clear responsibilities

## Testing Considerations

- Test with different number of choices
- Test clear/undo functionality
- Test disabled state
- Test answer validation
- Test with fractions and decimals

## Future Enhancements

- Drag and drop reordering
- Visual preview of the number line
- Animation when selecting/removing items
- Sound feedback for selections