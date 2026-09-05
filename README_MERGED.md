# XAUUSD AI — Merged Frontend + Backend

This package combines the existing React frontend and TypeScript/Fastify backend.

## Structure

- `frontend/` — existing React + TypeScript UI, adapted to call `/api`.
- `backend/` — existing TypeScript/Fastify analysis backend.

## Current state

- Frontend ↔ backend API connection: wired for market, structure, SMC, decision, and health endpoints.
- Market provider: currently `mock`; OANDA live data is **not connected yet**.
- Risk UI remains on its existing mock service until the backend risk contract is expanded.
- No real-money trade execution is implemented.

## Run

From this directory:

```bash
npm run install:all
```

Terminal 1:

```bash
npm run dev:backend
```

Terminal 2:

```bash
npm run dev:frontend
```

Open the Vite URL shown by the frontend command.

## Backend environment

Copy `backend/.env.example` to `backend/.env` and configure values as needed. Do not commit secrets.

## Next phase

Implement the OANDA provider and set `MARKET_DATA_PROVIDER` only after the provider has been implemented and credentials are stored as secrets.
