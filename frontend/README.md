# XAUUSD AI Analysis Terminal — Frontend

A frontend-only trading dashboard for an AI-powered XAUUSD (Gold) Smart Money Concepts analysis
system. This package contains **UI only** — no backend, no database, no AI logic, no live market
data, and no broker/trading integration. Every screen is wired to a typed service layer that
currently resolves realistic mock data, so the app is fully interactive today and ready to be
pointed at a real backend later without touching component code.

---

## 1. Installation

```bash
npm install
```

> This sandbox had no network access while building the project, so `npm install` has **not**
> been run or verified here. Run it in your own environment before starting the dev server.

## 2. Running the app

```bash
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`).

Other scripts:

```bash
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build locally
npm run lint       # run ESLint
```

Copy `.env.example` to `.env` if you want to set `VITE_API_BASE_URL` ahead of backend integration
(it isn't read by anything yet — see Section 7).

---

## 3. Folder structure

```
src/
  components/
    ui/          Generic primitives: Card, Badge, Stat, ProgressBar, ConfidenceGauge, loading/empty/error states
    layout/      Sidebar, Topbar, MobileNav, PageContainer
    chart/       ChartContainer — mock candle renderer, isolated behind one component boundary
    decision/    DecisionBadge, DecisionPanel, EvidenceList, ScoreBreakdown, AiReasoningPanel
    smc/         EvidenceCard, EvidenceGrid, EvidenceSummaryList
    structure/   DirectionCard, AlignmentBanner, PullbackCard, FibonacciZoneCard, LowerTimeframeList
    risk/        RiskPanel
    history/     HistoryTable, RecentAnalysisList
    backtest/    BacktestConfigForm, BacktestResultsSummary, BacktestEquityChart
    system/      ServiceStatusRow, SystemOverviewCard
  layouts/
    AppLayout.tsx      Sidebar + Topbar + routed <Outlet/>
  pages/            One file per route (see Section 5)
  hooks/            One hook per domain, all built on a shared useAsyncData hook
  services/         Typed async functions — the contract the backend will implement
  mock/             Mock data returned by services today
  types/            All shared TypeScript interfaces (also the API contract)
  utils/            format.ts (numbers/dates), status.ts (status → color/label mapping)
```

Nothing under `components/`, `pages/`, or `hooks/` contains strategy calculations — all of that
lives in `mock/` (today) and will live in the backend (later). Components only render data they're
given.

---

## 4. Design system

Dark trading-terminal aesthetic: near-black base (`#0A0C0F`–`#161A20`), a muted antique-gold accent
(`#C9A227`) used for the XAU brand mark and neutral emphasis, and desaturated semantic colors for
BUY (green), SELL (red), and WAIT (amber) so WAIT reads as a real, intentional state rather than a
warning. Typography: Space Grotesk for headings, Inter for UI text, JetBrains Mono for all prices,
scores, and numeric data (tabular figures throughout). Tokens live in `tailwind.config.ts`.

---

## 5. Pages (routes)

| Route                | Page              | Contents |
|-----------------------|-------------------|----------|
| `/`                    | Dashboard         | Price, daily levels, 4H/1H status, Fibonacci zone, chart, decision panel, SMC summary, AI explanation, risk, recent analysis |
| `/live-analysis`       | Live Analysis     | Full pipeline stepper + chart + alignment, pullback, Fibonacci, LTF analysis, SMC evidence, decision |
| `/market-structure`    | Market Structure  | 4H/1H direction cards, alignment rule, HTF pullback, Fibonacci zone, LTF pullback list |
| `/smc-analysis`        | SMC Analysis      | Full SMC evidence grid with detected/not-detected filter |
| `/ai-decision`         | AI Decision       | Decision panel, quantitative score breakdown, risk panel, full AI reasoning |
| `/backtesting`         | Backtesting       | Config form, results summary, equity curve chart |
| `/analysis-history`    | Analysis History  | Filterable table of past analysis runs and outcomes |
| `/settings`            | Settings          | Risk, analysis, and notification preferences |
| `/system-status`       | System Status     | Overall health + per-service status (data feed, engines, AI service, DB) |

---

## 6. Mock data structure

Each domain has a `mock*.ts` file in `src/mock/` exporting data shaped exactly like the
corresponding TypeScript interface in `src/types/`. For example, `mock/mockDecision.ts` exports a
`mockDecision: AnalysisDecision` object with a `WAIT` decision, an uncalibrated confidence score,
a deterministic-looking score breakdown, and full AI reasoning text — demonstrating that WAIT is
treated as a first-class, fully-explained outcome, not an empty state.

All mock data is internally consistent: the SMC evidence referenced by the decision panel matches
the evidence shown on the SMC Analysis page, the Fibonacci zone matches the swing points in the 4H
structure, and so on.

---

## 7. Services — the API contract for the backend

Every file in `src/services/` documents the REST endpoint(s) it expects, e.g.:

```ts
// src/services/decisionService.ts
/**
 * Backend contract:
 *   GET  /api/decision/latest   -> AnalysisDecision
 *   POST /api/decision/refresh  -> AnalysisDecision (triggers a new analysis run)
 */
export const decisionService = {
  getLatestDecision(): Promise<AnalysisDecision> { ... }
  requestNewAnalysis(): Promise<AnalysisDecision> { ... }
};
```

Today, every service function resolves data from `src/mock/` after a short simulated delay
(`simulateLatency` in `apiClient.ts`), so hooks and components already behave as if they were
talking to a real, occasionally-slow network. **To connect the real backend**, replace the body of
each service function with a real `fetch`/websocket call against `API_BASE_URL` — no changes are
needed in hooks, pages, or components, because they only depend on the function signatures and
the `src/types/` interfaces, which double as the API contract.

---

## 8. Chart architecture

`components/chart/ChartContainer.tsx` renders a lightweight SVG candle chart from mock OHLC data
today, with timeframe tabs (1D/4H/1H/15M/5M/3M/1M) and overlay toggles for Daily Open/Close, Swing
High/Low, Fibonacci, Liquidity, BOS, CHoCH, FVG, and Order Block. The mock renderer is intentionally
isolated behind this one component: swapping in a real charting library later (e.g. a
TradingView-style widget) means changing only the internals of `ChartContainer.tsx` — the props it
receives (`candles: Candle[]`, `timeframe: Timeframe`, overlay state) are already the shape a real
integration would consume.

---

## 9. What this is not

- No backend, database, or persistence beyond the current browser session
- No SMC calculation logic, market structure detection, or scoring math — all deterministic
  computation described in the project brief belongs server-side and is represented here only as
  realistic mock output
- No AI reasoning — the reasoning text shown is static mock copy demonstrating the intended tone
  and structure
- No live market data — all prices/candles are generated mock data
- No real-money or paper trading execution of any kind

---

## 10. Known limitation of this build

This project was scaffolded and written in a sandboxed environment without network access, so
`npm install` and `npm run dev` could not be executed to verify the build end-to-end here. The code
was written carefully against a consistent set of TypeScript interfaces, and import/export wiring
across all 88 source files was verified with static checks, but you should treat the first
`npm install && npm run dev` in your own environment as the real verification step. If anything
doesn't compile, the most likely causes are minor version mismatches in `package.json` — pin to the
versions shown there, or run `npm install` without `--force`/`--legacy-peer-deps` first.
