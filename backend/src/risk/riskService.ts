import type { RiskAssessment } from "./types.js";
import type { AnalysisDecision } from "../decision/types.js";

/**
 * Risk module (foundation stub).
 *
 * The project brief is explicit: stop-loss placement, take-profit logic,
 * and position sizing formulas are NOT part of the confirmed strategy
 * rules, and this codebase must not invent them. This service therefore
 * does not compute entry/SL/TP or position size — it only reports that
 * risk validation is pending those rules, and blocks any notion of
 * automatic execution regardless of decision.
 *
 * Once the user defines SL/TP/position-sizing rules, implement the
 * calculation here (consuming `AnalysisDecision` + the pullback/fibonacci
 * levels already computed upstream) without changing any other module.
 */
export class RiskService {
  assess(decision: AnalysisDecision): RiskAssessment {
    if (decision.decision === "WAIT") {
      return {
        levels: null,
        status: "not-applicable",
        note: "No active trade to assess — current decision is WAIT.",
      };
    }

    return {
      levels: null,
      status: "blocked",
      note:
        "Risk levels (entry, stop loss, take profit, position size) are not calculated because " +
        "those rules have not been defined by the user yet. Real-money or automatic execution " +
        "remains disabled regardless of the decision above.",
    };
  }
}

export const riskService = new RiskService();
