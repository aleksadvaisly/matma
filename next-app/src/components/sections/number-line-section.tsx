'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useExerciseStore, Exercise } from '@/lib/store';
import { CheckCircle, Circle, ArrowRight, RefreshCw, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface NumberLineVisualizationProps {
  mode?: 'integer' | 'advanced';
  referencedNumbers?: number[];
  selectedNumber?: number;
  onNumberClick?: (number: number) => void;
  showLabels?: boolean;
}

function NumberLineVisualization({
  mode = 'integer',
  referencedNumbers = [],
  selectedNumber,
  onNumberClick,
  showLabels = true
}: NumberLineVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: -50, y: -60, width: 100, height: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Calculate appropriate range based on referenced numbers
  const calculateRange = useCallback(() => {
    if (referencedNumbers.length === 0) {
      return { min: -10, max: 10 };
    }
    
    const min = Math.min(...referencedNumbers);
    const max = Math.max(...referencedNumbers);
    const padding = Math.max(3, Math.ceil((max - min) * 0.3));
    
    return {
      min: min - padding,
      max: max + padding
    };
  }, [referencedNumbers]);

  const { min, max } = calculateRange();

  // Reset view when mode changes or referenced numbers change
  useEffect(() => {
    if (mode === 'integer') {
      const range = max - min;
      setViewBox({ x: min - 5, y: -60, width: range + 10, height: 120 });
      setZoom(1);
    }
  }, [mode, min, max]);

  // Generate tick marks based on zoom level
  const generateTicks = useCallback(() => {
    const viewWidth = viewBox.width;
    const tickSpacing = mode === 'integer' ? 1 : getTickSpacing(zoom);
    
    const startTick = Math.floor(viewBox.x / tickSpacing) * tickSpacing;
    const endTick = Math.ceil((viewBox.x + viewWidth) / tickSpacing) * tickSpacing;
    
    const ticks = [];
    for (let value = startTick; value <= endTick; value += tickSpacing) {
      // Round to avoid floating point precision issues
      const roundedValue = Math.round(value / tickSpacing) * tickSpacing;
      ticks.push(roundedValue);
    }
    
    return ticks;
  }, [viewBox, zoom, mode]);

  const getTickSpacing = (zoomLevel: number) => {
    if (zoomLevel >= 4) return 0.1;
    if (zoomLevel >= 2) return 0.2;
    if (zoomLevel >= 1.5) return 0.5;
    return 1;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === 'integer') return;
    
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || mode === 'integer') return;
    
    const dx = e.clientX - lastMousePos.x;
    const scale = viewBox.width / (svgRef.current?.clientWidth || 800);
    
    setViewBox(prev => ({
      ...prev,
      x: prev.x - dx * scale
    }));
    
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (mode === 'integer') return;
    
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.2 : 0.8;
    const newZoom = Math.max(0.1, Math.min(10, zoom * zoomFactor));
    
    if (newZoom !== zoom) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = e.clientX - rect.left;
        const svgMouseX = viewBox.x + (mouseX / rect.width) * viewBox.width;
        
        const newWidth = viewBox.width * zoomFactor;
        const newX = svgMouseX - (mouseX / rect.width) * newWidth;
        
        setViewBox(prev => ({
          ...prev,
          x: newX,
          width: newWidth
        }));
        setZoom(newZoom);
      }
    }
  };

  const handleNumberClick = (value: number) => {
    if (onNumberClick) {
      onNumberClick(value);
    }
  };

  const handleZoomIn = () => {
    if (mode === 'integer') return;
    const newZoom = Math.min(10, zoom * 1.5);
    const newWidth = viewBox.width / 1.5;
    const centerX = viewBox.x + viewBox.width / 2;
    
    setViewBox(prev => ({
      ...prev,
      x: centerX - newWidth / 2,
      width: newWidth
    }));
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    if (mode === 'integer') return;
    const newZoom = Math.max(0.1, zoom / 1.5);
    const newWidth = viewBox.width * 1.5;
    const centerX = viewBox.x + viewBox.width / 2;
    
    setViewBox(prev => ({
      ...prev,
      x: centerX - newWidth / 2,
      width: newWidth
    }));
    setZoom(newZoom);
  };

  const handleReset = () => {
    if (mode === 'integer') return;
    const range = max - min;
    setViewBox({ x: min - 5, y: -60, width: range + 10, height: 120 });
    setZoom(1);
  };

  const ticks = generateTicks();

  return (
    <div className="flex flex-col items-center my-6 space-y-3">
      {mode === 'advanced' && (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Zoom: {zoom.toFixed(1)}x
          </span>
        </div>
      )}
      
      <div className="border rounded-lg bg-background overflow-hidden">
        <svg
          ref={svgRef}
          width={800}
          height={120}
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
          className={mode === 'advanced' ? 'cursor-grab' : ''}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Main line */}
          <line
            x1={viewBox.x}
            y1={0}
            x2={viewBox.x + viewBox.width}
            y2={0}
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
          />
          
          {/* Arrow */}
          <polygon
            points={`${viewBox.x + viewBox.width - 2},0 ${viewBox.x + viewBox.width - 12},-5 ${viewBox.x + viewBox.width - 12},5`}
            fill="hsl(var(--foreground))"
          />
          
          {/* Tick marks and numbers */}
          {ticks.map((value) => {
            const isSelected = selectedNumber === value;
            const isReferenced = referencedNumbers.includes(value);
            const isZero = value === 0;
            const isInteger = value % 1 === 0;
            
            return (
              <g key={value}>
                {/* Tick mark */}
                <line
                  x1={value}
                  y1={isZero ? -15 : (isInteger ? -10 : -5)}
                  x2={value}
                  y2={isZero ? 15 : (isInteger ? 10 : 5)}
                  stroke="hsl(var(--foreground))"
                  strokeWidth={isZero ? "3" : (isInteger ? "2" : "1")}
                />
                
                {/* Number circle (clickable) */}
                {onNumberClick && isInteger && (
                  <circle
                    cx={value}
                    cy={0}
                    r="12"
                    fill={isSelected ? "hsl(var(--primary))" : isReferenced ? "hsl(var(--accent))" : "transparent"}
                    stroke={isReferenced || isSelected ? "hsl(var(--primary))" : "transparent"}
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-accent"
                    onClick={() => handleNumberClick(value)}
                  />
                )}
                
                {/* Number label */}
                {showLabels && isInteger && (
                  <text
                    x={value}
                    y={35}
                    textAnchor="middle"
                    fontSize="14"
                    fill={isSelected ? "hsl(var(--primary))" : "hsl(var(--foreground))"}
                    fontWeight={isZero ? "bold" : "normal"}
                    className={onNumberClick ? "cursor-pointer" : ""}
                    onClick={onNumberClick ? () => handleNumberClick(value) : undefined}
                  >
                    {value}
                  </text>
                )}
                
                {/* Fractional labels for advanced mode */}
                {showLabels && !isInteger && mode === 'advanced' && zoom >= 2 && (
                  <text
                    x={value}
                    y={30}
                    textAnchor="middle"
                    fontSize="10"
                    fill="hsl(var(--muted-foreground))"
                  >
                    {value.toFixed(1)}
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Zero label */}
          {ticks.includes(0) && (
            <text
              x={0}
              y={-25}
              textAnchor="middle"
              fontSize="12"
              fill="hsl(var(--muted-foreground))"
              fontWeight="bold"
            >
              0
            </text>
          )}
        </svg>
      </div>
      
      {mode === 'advanced' && (
        <p className="text-xs text-muted-foreground text-center">
          Przeciągnij aby przesunąć • Kółko myszy aby powiększyć/pomniejszyć
        </p>
      )}
    </div>
  );
}

const generateExercises = (): Exercise[] => [
  {
    id: '1-1-1',
    question: 'Gdzie na osi liczbowej znajduje się liczba -3?',
    correctAnswer: -3,
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-1-2', 
    question: 'Gdzie na osi liczbowej znajduje się liczba 5?',
    correctAnswer: 5,
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-1-3',
    question: 'Gdzie na osi liczbowej znajduje się liczba -7?',
    correctAnswer: -7,
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-1-4',
    question: 'Jaką odległość od zera ma liczba -4?',
    correctAnswer: 4,
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-1-5',
    question: 'Jaką odległość od zera ma liczba 6?',
    correctAnswer: 6,
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-1-6',
    question: 'Gdzie na osi liczbowej znajduje się liczba 15?',
    correctAnswer: 15,
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
  {
    id: '1-1-7',
    question: 'Gdzie na osi liczbowej znajduje się liczba -12?',
    correctAnswer: -12,
    completed: false,
    attempts: 0,
    timeSpent: 0,
  },
];

export function NumberLineSection() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState<number | undefined>();
  const [feedback, setFeedback] = useState<string>('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [visualizationMode, setVisualizationMode] = useState<'integer' | 'advanced'>('integer');

  const {
    initializeSection,
    getSectionProgress,
    submitAnswer,
    completeExercise,
    completeSection,
    updateTimeSpent,
    resetSection,
  } = useExerciseStore();

  const sectionId = '1-1';
  const exercises = generateExercises();
  const sectionProgress = getSectionProgress(sectionId);
  const currentExercise = exercises[currentExerciseIndex];

  useEffect(() => {
    initializeSection(sectionId, exercises);
  }, [initializeSection]);

  useEffect(() => {
    setStartTime(Date.now());
    setSelectedNumber(undefined);
    setFeedback('');
    setShowAnswer(false);
    
    // Auto-determine visualization mode based on exercise
    const answerValue = Math.abs(currentExercise.correctAnswer as number);
    if (answerValue > 12 || currentExercise.question.includes('odległość')) {
      setVisualizationMode('integer');
    }
  }, [currentExerciseIndex, currentExercise]);

  const handleNumberClick = (number: number) => {
    setSelectedNumber(number);
  };

  // Extract all numbers mentioned in the current exercise
  const getReferencedNumbers = (exercise: Exercise) => {
    const numbers: number[] = [];
    
    // Always include the correct answer
    numbers.push(exercise.correctAnswer as number);
    
    // Extract numbers from the question text
    const numberMatches = exercise.question.match(/-?\d+/g);
    if (numberMatches) {
      numberMatches.forEach(match => {
        const num = parseInt(match);
        if (!numbers.includes(num)) {
          numbers.push(num);
        }
      });
    }
    
    return numbers;
  };

  const handleSubmit = () => {
    if (selectedNumber === undefined) {
      setFeedback('Wybierz liczbę na osi liczbowej!');
      return;
    }

    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    updateTimeSpent(currentExercise.id, timeSpent);
    submitAnswer(currentExercise.id, selectedNumber);

    const isCorrect = selectedNumber === currentExercise.correctAnswer;
    
    if (isCorrect) {
      setFeedback('Świetnie! Prawidłowa odpowiedź!');
      completeExercise(currentExercise.id);
      setShowAnswer(true);
    } else {
      if (currentExercise.id.includes('distance')) {
        setFeedback(`Nieprawidłowo. Odległość to zawsze liczba dodatnia. Spróbuj ponownie.`);
      } else {
        setFeedback(`Nieprawidłowo. Liczba ${currentExercise.correctAnswer} znajduje się ${
          currentExercise.correctAnswer > 0 ? 'po prawej' : 'po lewej'
        } stronie zera.`);
      }
    }
  };

  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      completeSection(sectionId);
    }
  };

  const handleReset = () => {
    resetSection(sectionId);
    setCurrentExerciseIndex(0);
    setSelectedNumber(undefined);
    setFeedback('');
    setShowAnswer(false);
  };

  const progress = sectionProgress ? (sectionProgress.completedExercises / sectionProgress.totalExercises) * 100 : 0;
  const isCompleted = sectionProgress?.completed || false;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">1.1 Liczby na osi liczbowej</h1>
        <p className="text-muted-foreground">
          Naucz się umieszczać liczby całkowite na osi liczbowej i obliczać ich odległość od zera.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle>Oś liczbowa</CardTitle>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <div className="flex items-center space-x-1 p-1 bg-muted rounded-lg">
                    <Button
                      variant={visualizationMode === 'integer' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setVisualizationMode('integer')}
                      className="h-8"
                    >
                      Podstawowy
                    </Button>
                    <Button
                      variant={visualizationMode === 'advanced' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setVisualizationMode('advanced')}
                      className="h-8"
                    >
                      Zaawansowany
                    </Button>
                  </div>
                  <Badge variant="outline">
                    {currentExerciseIndex + 1} / {exercises.length}
                  </Badge>
                </div>
              </div>
              <CardDescription>
                Kliknij na liczbę na osi, żeby ją wybrać. {visualizationMode === 'advanced' ? 'Tryb zaawansowany umożliwia powiększanie i przesuwanie.' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NumberLineVisualization
                mode={visualizationMode}
                referencedNumbers={getReferencedNumbers(currentExercise)}
                selectedNumber={selectedNumber}
                onNumberClick={handleNumberClick}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Zadanie {currentExerciseIndex + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">{currentExercise.question}</p>
              
              {selectedNumber !== undefined && (
                <div className="p-3 bg-muted rounded-lg">
                  <p>Wybrana liczba: <strong>{selectedNumber}</strong></p>
                </div>
              )}

              {feedback && (
                <Alert className={showAnswer ? "border-green-500" : "border-orange-500"}>
                  <AlertDescription>{feedback}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                {!showAnswer ? (
                  <Button onClick={handleSubmit} disabled={selectedNumber === undefined}>
                    Sprawdź odpowiedź
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="flex items-center gap-2">
                    {currentExerciseIndex < exercises.length - 1 ? (
                      <>
                        Następne zadanie
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      'Zakończ sekcję'
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Postęp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Ukończone zadania</span>
                  <span>{sectionProgress?.completedExercises || 0}/{exercises.length}</span>
                </div>
                <Progress value={progress} />
              </div>
              
              {sectionProgress && (
                <div className="text-sm text-muted-foreground">
                  <p>Wynik: {sectionProgress.score}%</p>
                  <p>Czas: {Math.round(sectionProgress.timeSpent / 60)} min</p>
                </div>
              )}

              {isCompleted && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Zacznij od nowa
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lista zadań</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {exercises.map((exercise, index) => {
                  const isCurrentExercise = index === currentExerciseIndex;
                  const exerciseProgress = sectionProgress?.exercises.find(ex => ex.id === exercise.id);
                  const isCompleted = exerciseProgress?.completed || false;
                  
                  return (
                    <div
                      key={exercise.id}
                      className={`flex items-center gap-3 p-2 rounded-lg ${
                        isCurrentExercise ? 'bg-accent' : ''
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={`text-sm ${isCurrentExercise ? 'font-medium' : ''}`}>
                        Zadanie {index + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wskazówki</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Liczby dodatnie znajdują się po prawej stronie zera</p>
              <p>• Liczby ujemne znajdują się po lewej stronie zera</p>
              <p>• Odległość od zera to zawsze liczba dodatnia</p>
              <p>• Im dalej od zera, tym większa odległość</p>
              <div className="mt-4 pt-3 border-t">
                <p className="font-medium mb-2">Tryby wizualizacji:</p>
                <p>• <strong>Podstawowy:</strong> Stały zakres dopasowany do zadania</p>
                <p>• <strong>Zaawansowany:</strong> Powiększanie (kółko myszy) i przesuwanie (przeciągnij)</p>
                <p>• W trybie zaawansowanym można zobaczyć również ułamki przy dużym powiększeniu</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}