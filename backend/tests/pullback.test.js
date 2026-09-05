import { describe, expect, it } from "vitest";
import { identifyHtfPullback } from "../src/pullback/pullbackService.js";
function makeStructure(bias) {
    return {
        timeframe: "4H",
        bias,
        swingPoints: bias === "bullish"
            ? [
                { type: "HL", price: 90, time: "t0", index: 0 },
                { type: "HH", price: 110, time: "t1", index: 1 },
                { type: "HL", price: 100, time: "t2", index: 2 },
                { type: "HH", price: 130, time: "t3", index: 3 },
            ]
            : [
                { type: "LH", price: 130, time: "t0", index: 0 },
                { type: "LL", price: 110, time: "t1", index: 1 },
                { type: "LH", price: 120, time: "t2", index: 2 },
                { type: "LL", price: 90, time: "t3", index: 3 },
            ],
        summary: "test",
    };
}
function makeAlignment(bias) {
    const htf = makeStructure(bias);
    return {
        htf,
        ltfConfirmation: htf,
        state: bias === "bullish" ? "aligned-bullish" : "aligned-bearish",
        canProceed: true,
        ruleNote: "test",
    };
}
describe("identifyHtfPullback", () => {
    it("anchors the pullback leg on the latest HL -> HH swing for a bullish structure", () => {
        const alignment = makeAlignment("bullish");
        const pullback = identifyHtfPullback(alignment, 115);
        expect(pullback.originSwing.price).toBe(100); // latest HL
        expect(pullback.targetSwing.price).toBe(130); // latest HH
    });
    it("anchors the pullback leg on the latest LH -> LL swing for a bearish structure", () => {
        const alignment = makeAlignment("bearish");
        const pullback = identifyHtfPullback(alignment, 105);
        expect(pullback.originSwing.price).toBe(120); // latest LH
        expect(pullback.targetSwing.price).toBe(90); // latest LL
    });
    it("reports reached-zone when current price sits inside the golden zone", () => {
        const alignment = makeAlignment("bullish");
        // Leg 100 -> 130, range 30. Golden zone: 130 - 30*0.786=106.42 to 130-30*0.618=111.46
        const pullback = identifyHtfPullback(alignment, 109);
        expect(pullback.state).toBe("reached-zone");
    });
});
//# sourceMappingURL=pullback.test.js.map