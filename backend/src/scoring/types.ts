export interface ScoreFactor {
  factor: string;
  points: number;
  maxPoints: number;
}

export interface QuantitativeScore {
  total: number;
  max: number;
  breakdown: ScoreFactor[];
}
