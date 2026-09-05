import { query } from "../pool.js";
import type { AnalysisDecision } from "../../decision/types.js";

interface AnalysisRunRow {
  id: string;
  as_of: string;
  instrument: string;
  decision: "BUY" | "SELL" | "WAIT";
  confidence: number;
  confidence_calibrated: boolean;
  strategy_version: string;
  data_source: string;
  reason: string;
  invalidation: string;
  quantitative_score: AnalysisDecision["quantitativeScore"];
  ai_reasoning: AnalysisDecision["aiReasoning"];
  evidence: AnalysisDecision["evidence"];
}

function toDecision(row: AnalysisRunRow): AnalysisDecision {
  return {
    id: row.id,
    asOf: row.as_of,
    instrument: "XAUUSD",
    decision: row.decision,
    confidence: row.confidence,
    confidenceCalibrated: false,
    quantitativeScore: row.quantitative_score,
    aiReasoning: row.ai_reasoning,
    evidence: row.evidence,
    invalidation: row.invalidation,
    reason: row.reason,
    strategyVersion: row.strategy_version,
  };
}

export class AnalysisHistoryRepository {
  async save(decision: AnalysisDecision, dataSource: string): Promise<void> {
    await query(
      `INSERT INTO analysis_runs
        (id, as_of, instrument, decision, confidence, confidence_calibrated, strategy_version,
         data_source, reason, invalidation, quantitative_score, ai_reasoning, evidence)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (id) DO NOTHING`,
      [
        decision.id,
        decision.asOf,
        decision.instrument,
        decision.decision,
        decision.confidence,
        decision.confidenceCalibrated,
        decision.strategyVersion,
        dataSource,
        decision.reason,
        decision.invalidation,
        JSON.stringify(decision.quantitativeScore),
        JSON.stringify(decision.aiReasoning),
        JSON.stringify(decision.evidence),
      ]
    );
  }

  async list(limit = 50): Promise<AnalysisDecision[]> {
    const { rows } = await query<AnalysisRunRow>(
      `SELECT * FROM analysis_runs ORDER BY as_of DESC LIMIT $1`,
      [limit]
    );
    return rows.map(toDecision);
  }
}

export const analysisHistoryRepository = new AnalysisHistoryRepository();
