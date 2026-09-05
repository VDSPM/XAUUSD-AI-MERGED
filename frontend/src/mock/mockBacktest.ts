import type { BacktestRun } from "@/types";

function buildEquityCurve(points: number, start: number) {
  const curve = [];
  let balance = start;
  const startTime = Date.now() - points * 86400000;
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.42) * balance * 0.012;
    balance = Math.max(balance + change, start * 0.6);
    curve.push({
      time: new Date(startTime + i * 86400000).toISOString(),
      balance: Number(balance.toFixed(2)),
    });
  }
  return curve;
}

export const mockBacktestRun: BacktestRun = {
  id: "bt_run_0042",
  status: "completed",
  config: {
    instrument: "XAUUSD",
    startDate: "2025-01-01",
    endDate: "2026-01-01",
    timeframeSet: ["1D", "4H", "1H", "15M", "5M", "3M", "1M"],
    initialBalance: 10000,
    riskPerTradePct: 1,
    preventLookaheadBias: true,
    preventFutureDataLeakage: true,
    realisticExecutionAssumptions: true,
  },
  summary: {
    totalTrades: 214,
    wins: 121,
    losses: 93,
    winRatePct: 56.5,
    profitFactor: 1.64,
    netProfit: 4218.6,
    netProfitPct: 42.2,
    maxDrawdownPct: 11.4,
    averageR: 0.38,
    expectancy: 0.21,
  },
  equityCurve: buildEquityCurve(120, 10000),
  startedAt: new Date(Date.now() - 3600_000).toISOString(),
  completedAt: new Date(Date.now() - 3300_000).toISOString(),
};
