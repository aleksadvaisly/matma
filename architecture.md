# Architecture - Portal Edukacyjny MATMA

## Executive Summary

Portal edukacyjny do nauki matematyki dla 6 klasy, łączący tradycyjną naukę z interaktywnym portalem. Architektura oparta o Next.js + shadcn/ui + Prisma z migracją SQLite → Supabase.

## Tech Stack

### Current (Development)
- **Frontend**: Next.js 15 + React 18 + TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite + Prisma ORM
- **State**: React Query + Zustand

### Target (Production)
- **Hosting**: Vercel
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Edge Functions**: Supabase Functions
- **CDN**: Vercel Edge Network

## Project Structure

```
matma/
├── apps/
│   └── web/                      # Next.js application
│       ├── src/
│       │   ├── app/              # App Router pages
│       │   │   ├── (auth)/       # Authentication flows
│       │   │   ├── (student)/    # Student dashboard
│       │   │   └── api/          # API endpoints
│       │   ├── components/
│       │   │   ├── ui/           # shadcn/ui components
│       │   │   ├── math/         # Math-specific components
│       │   │   └── layout/       # Layout components
│       │   ├── lib/              # Utilities and configs
│       │   ├── hooks/            # Custom React hooks
│       │   └── services/         # Business logic
│       └── prisma/               # Database schema
├── packages/
│   ├── math-engine/              # Problem generation engine
│   │   ├── generators/           # Problem generators
│   │   ├── validators/           # Answer validators
│   │   └── types/                # Math types
│   └── types/                    # Shared TypeScript types
└── docs/                         # Documentation
```

## Database Schema

### Core Entities

```prisma
model Student {
  id              String    @id @default(cuid())
  email           String    @unique
  name            String
  gradeLevel      Int       @default(6)
  createdAt       DateTime  @default(now())
  
  sessions        Session[]
  attempts        Attempt[]
  progress        Progress[]
}

model Topic {
  id              String    @id @default(cuid())
  name            String    // "Liczby całkowite"
  orderIndex      Int
  
  subtopics       Subtopic[]
}

model Subtopic {
  id              String    @id @default(cuid())
  topicId         String
  name            String    // "Dodawanie liczb całkowitych"
  orderIndex      Int
  
  topic           Topic     @relation(fields: [topicId])
  problemTypes    ProblemType[]
  progress        Progress[]
}

model ProblemType {
  id              String    @id @default(cuid())
  subtopicId      String
  type            String    // "arithmetic", "word_problem", "number_line"
  difficulty      Int       // 1-5
  template        Json      // Problem generation parameters
  
  subtopic        Subtopic  @relation(fields: [subtopicId])
  problems        Problem[]
}

model Problem {
  id              String    @id @default(cuid())
  typeId          String
  question        String
  answer          String
  solution        Json      // Step-by-step solution
  hints           Json[]    // Progressive hints
  metadata        Json      // Additional data
  
  type            ProblemType @relation(fields: [typeId])
  attempts        Attempt[]
}

model Session {
  id              String    @id @default(cuid())
  studentId       String
  startedAt       DateTime  @default(now())
  completedAt     DateTime?
  mode            String    // "practice", "test", "review"
  
  student         Student   @relation(fields: [studentId])
  attempts        Attempt[]
}

model Attempt {
  id              String    @id @default(cuid())
  sessionId       String
  studentId       String
  problemId       String
  submittedAnswer String
  isCorrect       Boolean
  timeSpent       Int       // seconds
  hintsUsed       Int       @default(0)
  attemptNumber   Int       @default(1)
  createdAt       DateTime  @default(now())
  
  session         Session   @relation(fields: [sessionId])
  student         Student   @relation(fields: [studentId])
  problem         Problem   @relation(fields: [problemId])
}

model Progress {
  id              String    @id @default(cuid())
  studentId       String
  subtopicId      String
  masteryScore    Float     @default(0) // 0-100
  currentLevel    Int       @default(1) // 1-5
  streak          Int       @default(0)
  lastPracticed   DateTime?
  
  student         Student   @relation(fields: [studentId])
  subtopic        Subtopic  @relation(fields: [subtopicId])
  
  @@unique([studentId, subtopicId])
}
```

## Component Architecture

### Math Components Hierarchy

```
<ProblemContainer>
  <ProblemDisplay>
    <NumberLineProblem />
    <ArithmeticProblem />
    <WordProblem />
  </ProblemDisplay>
  
  <AnswerInput>
    <NumericInput />
    <MultipleChoice />
    <DragAndDrop />
  </AnswerInput>
  
  <ProblemControls>
    <HintButton />
    <SubmitButton />
    <SkipButton />
  </ProblemControls>
  
  <Feedback>
    <CorrectFeedback />
    <IncorrectFeedback />
    <SolutionExplanation />
  </Feedback>
</ProblemContainer>
```

### UI Components (shadcn/ui)

- **Card**: Problem display containers
- **Button**: Actions and controls
- **Progress**: Mastery indicators
- **Dialog**: Explanations and hints
- **Toast**: Feedback notifications
- **Tabs**: Topic navigation
- **Badge**: Achievement display

## Math Engine

### Problem Generation Pipeline

```typescript
// packages/math-engine/generators/integer-addition.ts
export interface GeneratorParams {
  minValue: number
  maxValue: number
  operandCount: number
  allowNegative: boolean
  difficulty: 1 | 2 | 3 | 4 | 5
}

export function generateIntegerAddition(params: GeneratorParams): MathProblem {
  // 1. Generate operands based on difficulty
  // 2. Create question string
  // 3. Calculate answer
  // 4. Generate hints
  // 5. Create solution steps
  return {
    question,
    answer,
    hints,
    solution,
    metadata
  }
}
```

### Validation System

```typescript
// packages/math-engine/validators/answer-validator.ts
export function validateAnswer(
  submitted: string,
  expected: string,
  type: ProblemType
): ValidationResult {
  // 1. Parse submitted answer
  // 2. Apply type-specific validation
  // 3. Check for partial credit scenarios
  // 4. Return detailed feedback
  return {
    isCorrect,
    partialCredit,
    feedback,
    commonMistake
  }
}
```

## State Management

### Frontend State Architecture

```typescript
// React Query for server state
const { data: problem } = useQuery({
  queryKey: ['problem', subtopicId, difficulty],
  queryFn: fetchNextProblem
})

// Zustand for local UI state
const useProblemStore = create((set) => ({
  currentAnswer: '',
  hintsShown: 0,
  timeElapsed: 0,
  setAnswer: (answer) => set({ currentAnswer: answer }),
  showHint: () => set((state) => ({ hintsShown: state.hintsShown + 1 }))
}))
```

## API Design

### RESTful Endpoints

```
POST   /api/problems/generate       # Generate new problem
POST   /api/problems/:id/validate   # Validate answer
GET    /api/progress/:studentId     # Get student progress
POST   /api/sessions/start          # Start practice session
POST   /api/sessions/:id/complete   # Complete session
GET    /api/topics                  # List all topics
GET    /api/subtopics/:topicId      # List subtopics
```

### Request/Response Examples

```typescript
// Generate Problem
POST /api/problems/generate
{
  "subtopicId": "addition",
  "difficulty": 3,
  "excludeIds": ["prob1", "prob2"]  // Already attempted
}

Response:
{
  "problem": {
    "id": "prob3",
    "question": "Oblicz: (-15) + 23 + (-8)",
    "type": "arithmetic",
    "hints": [
      "Zgrupuj liczby o tym samym znaku",
      "(-15) + (-8) = -23",
      "-23 + 23 = ?"
    ]
  }
}
```

## Migration Strategy

### Phase 1: Local Development (Current)
- SQLite with Prisma
- Next.js dev server
- Local file storage

### Phase 2: Staging Environment
1. Set up Supabase project
2. Migrate schema to PostgreSQL
3. Update connection strings
4. Test RLS policies

### Phase 3: Production Deployment
1. Deploy to Vercel
2. Connect Supabase production
3. Configure environment variables
4. Set up monitoring

### Migration Checklist
- [ ] Export SQLite data to SQL dump
- [ ] Create Supabase project
- [ ] Run Prisma migrations on Supabase
- [ ] Import data to Supabase
- [ ] Update environment variables
- [ ] Test all endpoints
- [ ] Configure Supabase Auth
- [ ] Set up RLS policies
- [ ] Deploy to Vercel

## Adaptive Learning Algorithm

### Difficulty Adjustment

```typescript
function adjustDifficulty(progress: Progress, attempt: Attempt): number {
  const { masteryScore, currentLevel, streak } = progress
  const { isCorrect, hintsUsed, timeSpent } = attempt
  
  if (isCorrect && hintsUsed === 0) {
    // Quick correct answer - increase difficulty
    if (streak >= 3) return Math.min(currentLevel + 1, 5)
  } else if (!isCorrect && hintsUsed > 2) {
    // Struggled - decrease difficulty
    return Math.max(currentLevel - 1, 1)
  }
  
  return currentLevel // No change
}
```

### Mastery Calculation

```typescript
function updateMastery(
  current: number,
  isCorrect: boolean,
  hintsUsed: number
): number {
  const baseChange = isCorrect ? 10 : -5
  const hintPenalty = hintsUsed * 2
  const newScore = current + baseChange - hintPenalty
  
  return Math.max(0, Math.min(100, newScore))
}
```

## Testing Strategy

### Unit Tests
- Math engine generators
- Validators
- Mastery algorithms
- API handlers

### Integration Tests
- Database operations
- Problem generation pipeline
- Progress tracking flow

### E2E Tests
- Student registration
- Complete practice session
- Progress visualization
- Difficulty adaptation

## Security Considerations

### Current (SQLite)
- Input validation with Zod
- SQL injection prevention via Prisma
- Rate limiting on API routes

### Future (Supabase)
- Row Level Security (RLS)
- JWT authentication
- API key management
- CORS configuration

## Performance Optimization

### Frontend
- Problem prefetching
- Image lazy loading
- Component code splitting
- Optimistic UI updates

### Backend
- Database query optimization
- Problem generation caching
- Session-based problem pools
- CDN for static assets

## Monitoring & Analytics

### Metrics to Track
- Problem completion rate
- Average time per problem
- Hint usage patterns
- Difficulty progression
- Error rates by topic

### Tools
- Vercel Analytics
- Sentry for errors
- Custom event tracking
- Supabase Dashboard

## Development Workflow

### Local Setup
```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Seed initial data
npm run db:seed

# Start development
npm run dev
```

### Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel deploy --prod
```

## Future Enhancements

### Phase 1 (MVP)
- [x] Basic problem generation
- [x] Answer validation
- [ ] Progress tracking
- [ ] Session management

### Phase 2
- [ ] AI-powered hints
- [ ] Detailed explanations
- [ ] Parent dashboard
- [ ] Achievement system

### Phase 3
- [ ] Multiplayer challenges
- [ ] Teacher tools
- [ ] Custom problem sets
- [ ] Mobile app

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Prisma with SQLite](https://www.prisma.io/docs/concepts/database-connectors/sqlite)
- [Supabase Migration Guide](https://supabase.com/docs/guides/migrations)
- [Vercel Deployment](https://vercel.com/docs)