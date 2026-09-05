import { describe, expect, it } from "vitest";
import { computeFibonacciZone } from "../src/fibonacci/fibonacciService.js";
function makePullback(originPrice, targetPrice) {
    return {
        timeframe: "4H",
        originSwing: { type: "HL", price: originPrice, time: new Date().toISOString(), index: 0 },
        targetSwing: { type: "HH", price: targetPrice, time: new Date().toISOString(), index: 1 },
        state: "forming",
        description: "test pullback",
    };
}
describe("computeFibonacciZone", () => {
    it("computes the golden zone between 0.618 and 0.786 for a bullish leg", () => {
        const pullback = makePullback(100, 200); // swing low 100 -> swing high 200
        const zone = computeFibonacciZone(pullback, 150, "bullish");
        expect(zone.swingLow).toBe(100);
        expect(zone.swingHigh).toBe(200);
        // 0.618 retracement from 200: 200 - 100*0.618 = 138.2
        // 0.786 retracement from 200: 200 - 100*0.786 = 121.4
        expect(zone.goldenZoneLow).toBeCloseTo(121.4, 1);
        expect(zone.goldenZoneHigh).toBeCloseTo(138.2, 1);
    });
    it("flags priceInsideZone correctly", () => {
        const pullback = makePullback(100, 200);
        const insideZone = computeFibonacciZone(pullback, 130, "bullish");
        const outsideZone = computeFibonacciZone(pullback, 190, "bullish");
        expect(insideZone.priceInsideZone).toBe(true);
        expect(outsideZone.priceInsideZone).toBe(false);
    });
    it("computes the golden zone for a bearish leg symmetrically", () => {
        const pullback = makePullback(200, 100); // origin high 200 -> target low 100
        const zone = computeFibonacciZone(pullback, 150, "bearish");
        expect(zone.swingLow).toBe(100);
        expect(zone.swingHigh).toBe(200);
        expect(zone.goldenZoneLow).toBeCloseTo(161.8, 1);
        expect(zone.goldenZoneHigh).toBeCloseTo(178.6, 1);
    });
});
//# sourceMappingURL=fibonacci.test.js.map