# XAUUSD AI Analysis

An open-source full-stack platform for AI-assisted XAUUSD (gold) market analysis, combining a TypeScript/Fastify backend with a React/TypeScript frontend.

> **Status:** Active development. The repository is evolving toward live market-data, multi-timeframe analysis, technical-analysis overlays, AI-assisted decision workflows, and backtesting.

## Overview

XAUUSD AI Analysis is a developer-oriented trading-analysis platform for experimenting with:

- Live XAUUSD market data integration
- Multi-timeframe candle analysis
- Market structure
- Smart Money Concepts (SMC)
- Fibonacci analysis
- Liquidity and price-action analysis
- Risk-management workflows
- AI-assisted market decisions
- Backtesting and analysis history

This project is intended for research, experimentation, and software development. It does **not** guarantee profitable trading and does not provide financial advice or automatic real-money trade execution.

## Architecture

```text
XAUUSD-AI-MERGED/
├── backend/                 # TypeScript + Fastify API
│   ├── src/
│   ├── tests/
│   └── .env.example
├── frontend/                # React + TypeScript UI
│   ├── src/
│   └── .env.example
├── package.json             # Root development scripts
└── .gitignore
```

## Core Components

### Backend

The backend provides the application API and market-analysis domain logic.

Project areas include:

- Market data services
- Market structure analysis
- Liquidity analysis
- Fibonacci analysis
- Smart Money Concepts
- Decision engine
- Risk-related workflows
- Health/system endpoints
- Automated tests with Vitest

### Frontend

The frontend is a React + TypeScript dashboard for viewing analysis results and interacting with the analysis workflow.

UI areas include:

- Dashboard
- Live analysis
- Market structure
- SMC analysis
- AI decision
- Backtesting
- Analysis history
- Settings
- System status

## Market Data

The application uses a market-data provider abstraction so live providers can be integrated without coupling analysis modules directly to a specific vendor.

Market-data credentials are configured through environment variables and should never be committed to Git.

## Multi-Timeframe Analysis

The intended analysis workflow supports:

`1D`, `4H`, `1H`, `15M`, `5M`, `3M`, and `1M`

Timeframe-specific candle data is used as input to the analysis pipeline.

## Analysis Concepts

### Market Structure

The project includes engineering components for swing detection and structure analysis, including:

- Swing High / Swing Low
- Break of Structure (BOS)
- Change of Character (CHoCH)

### Smart Money Concepts

The analysis workflow includes SMC-related concepts such as:

- Liquidity
- Fair Value Gaps (FVG)
- Order Blocks

### Fibonacci

Fibonacci-based price zones can be combined with structure and pullback analysis.

## Development

### Prerequisites

- Node.js
- npm
- PostgreSQL for configurations that use the database
- A configured market-data provider for live data

### Install

From the repository root:

```bash
npm run install:all
```

### Run the Backend

```bash
npm run dev:backend
```

### Run the Frontend

```bash
npm run dev:frontend
```

Open the URL printed by the frontend development server.

## Environment Variables

Backend:

```bash
cp backend/.env.example backend/.env
```

Frontend:

```bash
cp frontend/.env.example frontend/.env
```

Keep API keys and other secrets only in local environment files or a secure secret manager.

## Testing

Run backend tests:

```bash
npm run test:backend
```

Build checks:

```bash
npm run build:backend
npm run build:frontend
```

## Project Roadmap

- [x] Full-stack repository structure
- [x] React + TypeScript frontend
- [x] TypeScript + Fastify backend
- [x] Analysis-domain foundation
- [x] Automated backend test setup
- [ ] Complete live market-data workflow
- [ ] Complete functional multi-timeframe charting
- [ ] Production-ready SMC/structure overlays
- [ ] Expand AI-assisted analysis workflows
- [ ] Expand backtesting coverage and reporting
- [ ] Improve documentation and developer onboarding
- [ ] Add CI for automated builds and tests

## Contributing

Contributions, bug reports, documentation improvements, and technical feedback are welcome.

When contributing:

1. Keep changes focused and testable.
2. Never commit API keys or other secrets.
3. Add or update tests when behavior changes.
4. Update documentation when setup or behavior changes.

## Disclaimer

This project is software for market-analysis experimentation and research. It does not provide financial advice, investment recommendations, or guaranteed trading results. Any trading decision made using this software is the user's responsibility.

## License

A project license has not yet been selected for this repository. Until a license is added, the code should not be assumed to have broad reuse permissions.
