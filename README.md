# Math Learning App Prototype

Next.js + React + shadcn/ui + SQLite prototype for 6th grade math practice.

## Technologies
- Next.js 15 with TypeScript
- React with hooks  
- shadcn/ui components
- Prisma ORM with SQLite
- Tailwind CSS

## Setup Commands

```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Features
- Math problem generator (addition, subtraction, multiplication)
- Interactive UI with shadcn/ui components
- SQLite database with Prisma ORM
- API endpoints for math problems
- Real-time feedback on answers

## API Endpoints
- `GET /api/test-db` - Test database connection
- `GET /api/math-problems` - Get all problems
- `POST /api/math-problems` - Create new problem

## File Structure
```
src/
├── app/
│   ├── api/
│   │   ├── math-problems/route.ts
│   │   └── test-db/route.ts
│   └── page.tsx
├── components/ui/
│   ├── card.tsx
│   └── button.tsx
└── lib/
    └── prisma.ts
```
