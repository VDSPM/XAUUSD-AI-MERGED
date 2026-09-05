import { describe, expect, it } from "vitest";
import { classifyStructure } from "../src/structure/structureService.js";
function candle(i, high, low) {
    return {
        time: new Date(2026, 0, 1, i).toISOString(),
        open: (high + low) / 2,
        high,
        low,
        close: (high + low) / 2,
        volume: 100,
    };
}
/** Builds a synthetic bullish sequence: HH + HL. */
function bullishSeries() {
    const candles = [];
    // First swing low
    candles.push(candle(0, 100, 90));
    candles.push(candle(1, 105, 95));
    candles.push(candle(2, 95, 85)); // swing low ~85
    candles.push(candle(3, 105, 95));
    candles.push(candle(4, 115, 105)); // swing high ~115
    candles.push(candle(5, 105, 95));
    candles.push(candle(6, 100, 90)); // swing low ~90 (higher than 85)
    candles.push(candle(7, 110, 100));
    candles.push(candle(8, 125, 115)); // swing high ~125 (higher than 115)
    candles.push(candle(9, 115, 105));
    candles.push(candle(10, 110, 100));
    return candles;
}
/** Builds a synthetic bearish sequence: LH + LL. */
function bearishSeries() {
    const candles = [];
    candles.push(candle(0, 130, 120));
    candles.push(candle(1, 125, 115));
    candles.push(candle(2, 135, 125)); // swing high ~135
    candles.push(candle(3, 125, 115));
    candles.push(candle(4, 115, 105)); // swing low ~105
    candles.push(candle(5, 125, 115));
    candles.push(candle(6, 128, 118)); // swing high ~128 (lower than 135)
    candles.push(candle(7, 118, 108));
    candles.push(candle(8, 105, 95)); // swing low ~95 (lower than 105)
    candles.push(candle(9, 115, 105));
    candles.push(candle(10, 120, 110));
    return candles;
}
describe("classifyStructure", () => {
    it("classifies a higher-high + higher-low sequence as bullish", () => {
        const result = classifyStructure("4H", bullishSeries());
        expect(result.bias).toBe("bullish");
    });
    it("classifies a lower-high + lower-low sequence as bearish", () => {
        const result = classifyStructure("4H", bearishSeries());
        expect(result.bias).toBe("bearish");
    });
    it("returns undetermined when there are not enough swing points", () => {
        const flatCandles = Array.from({ length: 5 }, (_, i) => candle(i, 100, 99));
        const result = classifyStructure("4H", flatCandles);
        expect(result.bias).toBe("undetermined");
    });
});
//# sourceMappingURL=structure.test.js.map