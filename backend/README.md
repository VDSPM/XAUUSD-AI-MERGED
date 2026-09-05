# XAUUSD AI Analysis Backend — Foundation

Backend foundation for the XAUUSD AI Trading Analysis System: a modular, typed REST API
implementing the confirmed strategy rules deterministically, with clearly-labeled placeholders
for everything not yet defined. **No live broker execution, no real-money trading, no invented
entry/SL/TP rules.**

---

## 1. Prerequisites

- Node.js 20+
- PostgreSQL 14+ (a running instance, local or remote)

## 2. Installation

```bash
npm install
```

> This sandbox had no network access while building the project, so `npm install` has **not**
> been run or verified here — see Section 10.

## 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and point `DATABASE_URL` at your PostgreSQL instance. Every other variable has a
working default for local development (mock market data provider, port 4000, etc).

## 4. Create the database and run migrations

```bash
createdb xauusd_analysis   # or create it however you normally manage Postgres databases
npm run migrate
```

This applies `src/database/migrations/001_init.sql`, which creates `analysis_runs` and
`backtest_runs` tables. Migrations are tracked in a `_migrations` table so `npm run migrate` is
safe to re-run.

## 5. Run the server

```bash
npm run dev     # tsx watch mode, restarts on file change
# or
npm run build && npm start   # compiled production build
```

The API listens on `http://localhost:4000` by default (`PORT` in `.env`).

## 6. Run tests

```bash
npm test
```

---

## 7. Folder structure

```
src/
  config/        env.ts (typed env loader), constants.ts (fixed strategy constants)
  logging/       logger.ts (pino), analysisLogger.ts (structured per-run trace log)
  types/         errors.ts (shared AppError hierarchy)
  market/        MarketDataProvider interface, MockMarketDataProvider, marketService (validation/staleness)
  structure/     swing detection, 4H/1H HH+HL / LH+LL classification, alignment rule
  liquidity/     liquidity pool + sweep detection
  pullback/      HTF pullback leg identification, LTF golden-zone-fill checking
  fibonacci/     fixed 0.618–0.786 golden zone calculation
  smc/           SMC evidence engine (liquidity, sweep, BOS, CHoCH, OB, FVG, displacement, premium/discount, volatility, session)
  strategy/      pipeline orchestrator running the confirmed rules in order
  scoring/       deterministic (uncalibrated) quantitative scoring
  ai/            AiReasoningProvider interface + StubAiReasoningProvider (template-based, not a real AI call)
  decision/      combines fixed rules + score + AI reasoning into BUY/SELL/WAIT
  risk/          deliberately does NOT compute SL/TP/position size — rules are undefined
  backtest/      scaffold only; historical replay engine not yet implemented
  database/      pg pool, migrations, migration runner, analysis history repository
  api/           Fastify server, routes, error-handling middleware
  index.ts        entrypoint
tests/            vitest unit + route tests
```

---

## 8. What is a confirmed rule vs. an engineering default

This codebase is careful to distinguish two categories, and comments them accordingly throughout:

**Confirmed strategy rules** (from the project spec, never overridden by scoring or AI):
- XAUUSD only
- 4H: HH+HL = bullish, LH+LL = bearish
- 1H must confirm 4H direction; disagreement forces WAIT
- Fibonacci golden zone is fixed at 0.618–0.786
- LTF pullback must reach/fill the HTF golden zone before the setup proceeds

**Engineering defaults** (necessary to make the confirmed rules operable, but not themselves
confirmed by the user — each is commented in code as such, with the exact spot to revisit):
- Swing-point detection method (`structure/swingDetector.ts` — N-bar fractal, configurable lookback)
- Which HTF swing anchors the pullback leg (`pullback/pullbackService.ts`)
- SMC evidence detection thresholds (`smc/smcService.ts` — standard/textbook definitions)
- The quantitative scoring formula and its `DECISION_SCORE_THRESHOLD` (`scoring/`, `decision/`)

**Explicitly NOT implemented, by design:**
- Entry-trigger rules beyond "LTF reaches the golden zone" — none invented
- Stop-loss, take-profit, or position-sizing formulas — `risk/riskService.ts` returns `levels: null`
  with a note that these rules are undefined, on every call
- Any automatic or broker trade execution
- A real AI reasoning backend — `ai/providers/StubAiReasoningProvider.ts` is deterministic
  template text, not a model call
- The backtest replay engine — `backtest/backtestService.ts` is a scaffold that returns
  `status: "not-implemented"`

---

## 9. API reference

| Method | Route             | Description |
|--------|--------------------|--------------|
| GET    | `/health`          | Service + database health, strategy version, active data source |
| GET    | `/market/xauusd`   | Price snapshot, daily levels, candles (`?timeframe=1H&limit=200`) |
| GET    | `/analysis/xauusd` | Full pipeline: structure, pullback, fibonacci, LTF analysis, SMC evidence, decision, risk |
| GET    | `/structure/xauusd`| 4H/1H alignment, HTF pullback, fibonacci zone, LTF analysis |
| GET    | `/smc/xauusd`      | SMC evidence set only |
| GET    | `/decision/xauusd` | Latest BUY/SELL/WAIT decision + risk assessment |
| GET    | `/history`         | Past analysis decisions (`?limit=50`), degrades gracefully if the DB is down |
| GET    | `/backtest`        | Latest backtest run (currently always `null` — not implemented) |
| POST   | `/backtest`        | Registers a backtest config; returns `status: "not-implemented"` |

Every route returns errors as `{ error: { code, message } }` with an appropriate HTTP status —
see `src/types/errors.ts` for the full error hierarchy and their status codes.

---

## 10. Known limitation of this build

This project was written in a sandboxed environment without network access, so `npm install`
could not be run to install Fastify/pg/pino/TypeScript/vitest, and the server was not actually
booted or the tests actually executed here. In lieu of that, every import/export across all 51
source and test files was statically verified to resolve correctly, and the deterministic logic
(swing classification, Fibonacci zone math, pullback anchoring) was manually traced against the
included unit tests to confirm expected outputs match. Please run `npm install`, `npm run migrate`,
and `npm test` in your own environment as the real verification step, and let me know if anything
fails to compile or run.
