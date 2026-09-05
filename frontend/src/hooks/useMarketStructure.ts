import { structureService } from "@/services/structureService";
import { useAsyncData } from "./useAsyncData";

export function useDirectionAlignment() {
  return useAsyncData(() => structureService.getDirectionAlignment());
}

export function useHtfPullback() {
  return useAsyncData(() => structureService.getHtfPullback());
}

export function useFibonacciZone() {
  return useAsyncData(() => structureService.getFibonacciZone());
}

export function useLowerTimeframeAnalysis() {
  return useAsyncData(() => structureService.getLowerTimeframeAnalysis());
}
