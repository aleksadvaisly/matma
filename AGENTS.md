# Repository Guidelines

## Project Structure & Module Organization
This Next.js 15 app-router project keeps all feature code under `src`. Routes live in `src/app` (e.g. `dashboard/` and API handlers), shared UI in `src/components` with `ui/` primitives and `sections/` domain modules, and cross-cutting logic in `src/lib` (`prisma.ts`, Zustand `store.ts`, helpers). Static assets belong in `public/`. Product briefs and exploratory notes sit in `docs/`. Database schema and the local SQLite bundle live in `prisma/`.

## Build, Test, and Development Commands
- `npm run dev` — start the turbopack dev server on port 9005; respect `.env.local`.
- `npm run build` — produce a production bundle; run before shipping any infra changes.
- `npm run start` — serve the last build locally for final smoke checks.
- `npm run lint` — run the ESLint suite; commit only after it passes.
- `./run.sh` — one-stop setup that installs deps, generates the Prisma client, applies schema changes, and boots the dev server.

## Coding Style & Naming Conventions
Follow the TypeScript defaults enforced by ESLint and Next.js: 2-space indentation, single quotes, and functional React components. Component files live in PascalCase (`ProgressMeter.tsx`), hooks in camelCase (`useSomething.ts`). Keep exports default unless a module exposes multiple peer utilities. Reuse helpers from `src/lib/utils` rather than duplicating them.

## Testing Guidelines
There is no dedicated automated suite yet; smoke-test new flows in the dashboard manually and document the steps in your PR. When you introduce automated tests, colocate `*.test.ts(x)` files near the code under test and ensure they can run via a future `npm test`. For data updates, run `npx prisma db push --skip-generate` against your local database and confirm seeded states continue to load.

## Commit & Pull Request Guidelines
Recent history uses Conventional Commits (`feat(ui): ...`, `refactor(ui): ...`). Match that style, keep scopes small, and prefer separate commits for schema and UI moves. Pull requests must include a concise summary, the relevant screenshots for UI shifts, and a note on how you validated the changes (manual steps, commands). Link tracking issues or doc pages where available, and request review from another contributor before merging.

## Data & Configuration Tips
Define `DATABASE_URL="file:./prisma/dev.db"` and any feature flags inside `.env.local`; never commit secrets. After editing `prisma/schema.prisma`, regenerate the client with `npx prisma generate` so `src/lib/prisma.ts` stays in sync. Clean up local databases before committing migrations to keep `prisma/dev.db` lightweight.
