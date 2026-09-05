import type { Candle, DailyLevels, PriceSnapshot } from "@/types";

export const mockPriceSnapshot: PriceSnapshot = {
  instrument: "XAUUSD",
  price: 2418.63,
  changeAbs: 12.41,
  changePct: 0.52,
  dayHigh: 2424.1,
  dayLow: 2401.85,
  bid: 2418.51,
  ask: 2418.75,
  spread: 0.24,
  asOf: new Date().toISOString(),
  status: "open",
  activeSessions: [
    { name: "Sydney", active: false, opensInMinutes: null, closesInMinutes: null },
    { name: "Tokyo", active: false, opensInMinutes: 210, closesInMinutes: null },
    { name: "London", active: true, opensInMinutes: null, closesInMinutes: 145 },
    { name: "New York", active: true, opensInMinutes: null, closesInMinutes: 385 },
  ],
};

export const mockDailyLevels: DailyLevels = {
  date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
  previousOpen: 2406.2,
  previousClose: 2413.9,
  previousHigh: 2419.75,
  previousLow: 2398.4,
  note: "Contextual reference levels only — do not auto-trigger trades.",
};

function generateMockCandles(count: number, base: number, stepMinutes: number): Candle[] {
  const candles: Candle[] = [];
  let price = base;
  const now = Date.now();
  for (let i = count; i >= 0; i--) {
    const open = price;
    const drift = (Math.sin(i / 6) + (Math.random() - 0.5)) * 2.4;
    const close = open + drift;
    const high = Math.max(open, close) + Math.random() * 1.6;
    const low = Math.min(open, close) - Math.random() * 1.6;
    candles.push({
      time: new Date(now - i * stepMinutes * 60000).toISOString(),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.round(800 + Math.random() * 1200),
    });
    price = close;
  }
  return candles;
}

export const mockCandles1H = generateMockCandles(96, 2402, 60);
export const mockCandles4H = generateMockCandles(60, 2380, 240);
export const mockCandles15M = generateMockCandles(120, 2412, 15);
