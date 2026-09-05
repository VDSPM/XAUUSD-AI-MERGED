import type { DirectionAlignment, FibonacciZone, HtfPullback, LowerTimeframeAnalysis } from "@/types";
import { apiFetch } from "./apiClient";

interface StructureResponse {
  alignment: DirectionAlignment;
  pullback: HtfPullback | null;
  fibonacci: FibonacciZone | null;
  lowerTimeframeAnalysis: LowerTimeframeAnalysis[];
}

export const structureService = {
  async getDirectionAlignment(): Promise<DirectionAlignment> {
    const data = await apiFetch<StructureResponse>("/structure/xauusd");
    return data.alignment;
  },

  async getHtfPullback(): Promise<HtfPullback> {
    const data = await apiFetch<StructureResponse>("/structure/xauusd");
    if (!data.pullback) throw new Error("No active HTF pullback available");
    return data.pullback;
  },

  async getFibonacciZone(): Promise<FibonacciZone> {
    const data = await apiFetch<StructureResponse>("/structure/xauusd");
    if (!data.fibonacci) throw new Error("No Fibonacci zone available");
    return data.fibonacci;
  },

  async getLowerTimeframeAnalysis(): Promise<LowerTimeframeAnalysis[]> {
    const data = await apiFetch<StructureResponse>("/structure/xauusd");
    return data.lowerTimeframeAnalysis;
  },
};
