export type RiskStatus = "within-limits" | "elevated" | "blocked" | "not-applicable";

export interface RiskAssessment {
  /**
   * Null because entry/SL/TP calculation rules have not been defined by
   * the user (see project scoping: "UNDEFINED — USER DECISION REQUIRED").
   * This module deliberately does not invent them.
   */
  levels: null;
  status: RiskStatus;
  note: string;
}
