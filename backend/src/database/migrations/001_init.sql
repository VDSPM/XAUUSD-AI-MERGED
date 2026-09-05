-- Initial schema for the XAUUSD AI Analysis backend foundation.
-- Only what's needed to persist analysis history and (future) backtest runs.
-- No trade-execution or broker-account tables — out of scope for this build.

CREATE TABLE IF NOT EXISTS analysis_runs (
  id UUID PRIMARY KEY,
  as_of TIMESTAMPTZ NOT NULL,
  instrument TEXT NOT NULL DEFAULT 'XAUUSD',
  decision TEXT NOT NULL CHECK (decision IN ('BUY', 'SELL', 'WAIT')),
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  confidence_calibrated BOOLEAN NOT NULL DEFAULT FALSE,
  strategy_version TEXT NOT NULL,
  data_source TEXT NOT NULL,
  reason TEXT NOT NULL,
  invalidation TEXT NOT NULL,
  quantitative_score JSONB NOT NULL,
  ai_reasoning JSONB NOT NULL,
  evidence JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analysis_runs_as_of ON analysis_runs (as_of DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_runs_decision ON analysis_runs (decision);

CREATE TABLE IF NOT EXISTS backtest_runs (
  id UUID PRIMARY KEY,
  status TEXT NOT NULL,
  config JSONB NOT NULL,
  summary JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_backtest_runs_created_at ON backtest_runs (created_at DESC);
