import { randomUUID } from "node:crypto";
import type { AnalysisDecision, DecisionEvidenceRef, TradeDecision } from "./types.js";
import { runStrategyPipeline } from "../strategy/strategyPipeline.js";
import { scoringService } from "../scoring/scoringService.js";
import { StubAiReasoningProvider } from "../ai/providers/StubAiReasoningProvider.js";
import type { AiReasoningProvider } from "../ai/AiReasoningProvider.js";
import { env } from "../config/env.js";
import { logAnalysisRun } from "../logging/analysisLogger.js";
import { marketService } from "../market/marketService.js";
import { HTF_STRUCTURE_TIMEFRAME } from "../config/constants.js";
import { analysisHistoryRepository } from "../database/repositories/analysisRepository.js";
import { logger } from "../logging/logger.js";

/**
 * Decision engine.
 *
 * Fixed rules enforced here, in priority order, none overridable by
 * scoring or AI:
 *   1. If 4H/1H direction disagree -> WAIT.
 *   2. If the LTF pullback has not reached the HTF golden zone -> WAIT.
 *   3. Otherwise, decision direction follows the confirmed structural bias;
 *      whether to act (vs. WAIT for low conviction) is gated by the
 *      quantitative score against DECISION_SCORE_THRESHOLD — an
 *      engineering default pending backtest calibration, not a confirmed
 *      strategy rule.
 *
 * This engine does NOT compute entry/SL/TP — that is explicitly out of
 * scope pending user-defined risk rules (see src/risk/).
 */
export class DecisionService {
  constructor(private readonly aiProvider: AiReasoningProvider = new StubAiReasoningProvider()) {}

  async getLatestDecision(): Promise<AnalysisDecision> {
    const { decision } = await this.getFullAnalysis();
    return decision;
  }

  /**
   * Returns both the raw strategy pipeline output and the final decision,
   * so callers like the /analysis route can expose the full picture
   * (structure, pullback, fibonacci, SMC evidence, decision) from a single
   * pipeline run instead of re-running it per endpoint.
   */
  async getFullAnalysis(): Promise<{ pipeline: Awaited<ReturnType<typeof runStrategyPipeline>> | null; decision: AnalysisDecision }> {
    let pipeline;
    try {
      pipeline = await runStrategyPipeline();
    } catch (err) {
      // Critical market data unavailable -> WAIT / insufficient data, never throw a raw error to the caller here.
      logAnalysisRun({
        market: "XAUUSD",
        timeframe: HTF_STRUCTURE_TIMEFRAME,
        strategyVersion: env.strategyVersion,
        dataSource: marketService.providerId,
        status: "insufficient-data",
        decision: "WAIT",
        detail: err instanceof Error ? err.message : String(err),
      });
      return { pipeline: null, decision: this.insufficientDataDecision(err instanceof Error ? err.message : "Unknown data error") };
    }

    const score = scoringService.score(pipeline);
    const aiReasoning = await this.aiProvider.generateReasoning(pipeline, score);

    let decision: TradeDecision = "WAIT";
    let reason: string;

    if (!pipeline.alignment.canProceed) {
      decision = "WAIT";
      reason = pipeline.alignment.ruleNote;
    } else if (!pipeline.setupEligible) {
      decision = "WAIT";
      reason = pipeline.ineligibilityReason ?? "Setup conditions not yet met.";
    } else if (score.total < env.decisionScoreThreshold) {
      decision = "WAIT";
      reason = `Quantitative score (${score.total}/${score.max}) is below the ${env.decisionScoreThreshold} threshold for acting on this setup.`;
    } else {
      decision = pipeline.alignment.htf.bias === "bullish" ? "BUY" : "SELL";
      reason = `${HTF_STRUCTURE_TIMEFRAME}/1H alignment confirmed, price reached the golden zone, and evidence confluence supports the ${pipeline.alignment.htf.bias} direction.`;
    }

    const evidence: DecisionEvidenceRef[] = (pipeline.smcEvidence?.items ?? [])
      .filter((e) => e.detection === "detected")
      .map((e) => ({
        id: e.id,
        label: e.label,
        supports: e.strength !== "conflicting",
        strength: e.strength ?? "weak",
      }));

    const invalidation = pipeline.pullback
      ? `A confirmed close beyond ${pipeline.pullback.originSwing.price} (origin of the current ${HTF_STRUCTURE_TIMEFRAME} swing) invalidates this setup.`
      : "No active setup to invalidate — currently on WAIT.";

    const analysisDecision: AnalysisDecision = {
      id: randomUUID(),
      asOf: new Date().toISOString(),
      instrument: "XAUUSD",
      decision,
      confidence: Math.round((score.total / score.max) * 100),
      confidenceCalibrated: false,
      quantitativeScore: score,
      aiReasoning,
      evidence,
      invalidation,
      reason,
      strategyVersion: env.strategyVersion,
    };

    logAnalysisRun({
      market: "XAUUSD",
      timeframe: HTF_STRUCTURE_TIMEFRAME,
      strategyVersion: env.strategyVersion,
      dataSource: marketService.providerId,
      status: "completed",
      decision,
      analysisId: analysisDecision.id,
    });

    // Best-effort persistence — a database outage must not break the live
    // decision endpoint, only the /history endpoint's completeness.
    analysisHistoryRepository.save(analysisDecision, marketService.providerId).catch((err) => {
      logger.warn({ err }, "Failed to persist analysis decision to history (non-fatal)");
    });

    return { pipeline, decision: analysisDecision };
  }

  private insufficientDataDecision(detail: string): AnalysisDecision {
    return {
      id: randomUUID(),
      asOf: new Date().toISOString(),
      instrument: "XAUUSD",
      decision: "WAIT",
      confidence: 0,
      confidenceCalibrated: false,
      quantitativeScore: { total: 0, max: 100, breakdown: [] },
      aiReasoning: {
        marketContext: "Insufficient or invalid market data prevented analysis from running.",
        evidenceInterpretation: "No evidence could be evaluated.",
        conflictingEvidence: null,
        finalReasoning: `WAIT is returned because critical market data was unavailable: ${detail}`,
      },
      evidence: [],
      invalidation: "No active setup — insufficient data.",
      reason: `Insufficient or invalid market data: ${detail}`,
      strategyVersion: env.strategyVersion,
    };
  }
}

export const decisionService = new DecisionService();
