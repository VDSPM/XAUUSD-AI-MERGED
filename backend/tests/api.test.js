import { describe, expect, it } from "vitest";
import { buildServer } from "../src/api/server.js";
describe("API routes", () => {
    it("GET /health returns 200 with strategy metadata", async () => {
        const app = await buildServer();
        const response = await app.inject({ method: "GET", url: "/health" });
        expect(response.statusCode).toBe(200);
        const body = response.json();
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("strategyVersion");
        expect(body).toHaveProperty("dataSource", "mock");
        await app.close();
    });
    it("GET /market/xauusd returns price, daily levels, and candles", async () => {
        const app = await buildServer();
        const response = await app.inject({ method: "GET", url: "/market/xauusd?timeframe=1H&limit=50" });
        expect(response.statusCode).toBe(200);
        const body = response.json();
        expect(body.price).toHaveProperty("instrument", "XAUUSD");
        expect(Array.isArray(body.candles)).toBe(true);
        expect(body.candles.length).toBeGreaterThan(0);
        await app.close();
    });
    it("GET /market/xauusd rejects an invalid timeframe", async () => {
        const app = await buildServer();
        const response = await app.inject({ method: "GET", url: "/market/xauusd?timeframe=7H" });
        expect(response.statusCode).toBe(400);
        await app.close();
    });
    it("GET /decision/xauusd always returns BUY, SELL, or WAIT, never throws for mock data", async () => {
        const app = await buildServer();
        const response = await app.inject({ method: "GET", url: "/decision/xauusd" });
        expect(response.statusCode).toBe(200);
        const body = response.json();
        expect(["BUY", "SELL", "WAIT"]).toContain(body.decision.decision);
        // Risk module must never fabricate SL/TP levels.
        expect(body.risk.levels).toBeNull();
        await app.close();
    });
    it("GET /nonexistent returns a structured 404", async () => {
        const app = await buildServer();
        const response = await app.inject({ method: "GET", url: "/nonexistent" });
        expect(response.statusCode).toBe(404);
        expect(response.json()).toHaveProperty("error.code", "NOT_FOUND");
        await app.close();
    });
});
//# sourceMappingURL=api.test.js.map