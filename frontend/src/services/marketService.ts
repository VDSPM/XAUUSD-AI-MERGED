import type { Candle, DailyLevels, PriceSnapshot, Timeframe } from "@/types";
import { apiFetch } from "./apiClient";

interface MarketResponse {
  price: PriceSnapshot;
  dailyLevels: DailyLevels;
  timeframe: Timeframe;
  candles: Candle[];
}

export const marketService = {
  async getPriceSnapshot(): Promise<PriceSnapshot> {
    const data = await apiFetch<MarketResponse>("/market/xauusd?timeframe=1H&limit=200");
    return data.price;
  },

  async getDailyLevels(): Promise<DailyLevels> {
    const data = await apiFetch<MarketResponse>("/market/xauusd?timeframe=1D&limit=200");
    return data.dailyLevels;
  },

  async getCandles(timeframe: Timeframe): Promise<Candle[]> {
    const data = await apiFetch<MarketResponse>(`/market/xauusd?timeframe=${encodeURIComponent(timeframe)}&limit=200`);
    return data.candles;
  },
};
