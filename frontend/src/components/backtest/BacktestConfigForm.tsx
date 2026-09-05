import { useState, type FormEvent, type ReactNode } from "react";
import type { BacktestConfig } from "@/types";
import { Play } from "lucide-react";

interface BacktestConfigFormProps {
  onRun: (config: BacktestConfig) => void;
  running: boolean;
}

export function BacktestConfigForm({ onRun, running }: BacktestConfigFormProps) {
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2026-01-01");
  const [initialBalance, setInitialBalance] = useState(10000);
  const [riskPerTradePct, setRiskPerTradePct] = useState(1);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onRun({
      instrument: "XAUUSD",
      startDate,
      endDate,
      timeframeSet: ["1D", "4H", "1H", "15M", "5M", "3M", "1M"],
      initialBalance,
      riskPerTradePct,
      preventLookaheadBias: true,
      preventFutureDataLeakage: true,
      realisticExecutionAssumptions: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Start Date">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input-field"
          />
        </Field>
        <Field label="End Date">
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field" />
        </Field>
      </div>

      <Field label="Initial Balance (USD)">
        <input
          type="number"
          min={100}
          value={initialBalance}
          onChange={(e) => setInitialBalance(Number(e.target.value))}
          className="input-field"
        />
      </Field>

      <Field label="Risk Per Trade (%)">
        <input
          type="number"
          min={0.1}
          step={0.1}
          value={riskPerTradePct}
          onChange={(e) => setRiskPerTradePct(Number(e.target.value))}
          className="input-field"
        />
      </Field>

      <div className="rounded-lg border border-line-soft bg-base-900/40 px-3 py-2.5 space-y-1.5">
        <p className="eyebrow mb-1">Enforced Safeguards</p>
        {["No look-ahead bias", "No future-data leakage", "Realistic execution assumptions"].map((g) => (
          <p key={g} className="text-xs text-ink-secondary flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-buy" /> {g}
          </p>
        ))}
      </div>

      <button
        type="submit"
        disabled={running}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-gold/15 border border-gold/40 text-gold-bright font-medium text-sm py-2.5 hover:bg-gold/20 disabled:opacity-50 transition-colors"
      >
        <Play className={`h-4 w-4 ${running ? "animate-pulse" : ""}`} />
        {running ? "Running Backtest..." : "Run Backtest"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-1.5">{label}</span>
      {children}
    </label>
  );
}
