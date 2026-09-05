import "dotenv/config";

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function parseNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a number, got "${raw}"`);
  }
  return parsed;
}

function parseBool(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  return raw.toLowerCase() === "true" || raw === "1";
}

function parseList(name: string, fallback: string[]): string[] {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export const env = {
  port: parseNumber("PORT", 4000),
  host: requireEnv("HOST", "0.0.0.0"),
  nodeEnv: requireEnv("NODE_ENV", "development"),
  isProduction: requireEnv("NODE_ENV", "development") === "production",

  corsOrigins: parseList("CORS_ORIGINS", ["http://localhost:5173"]),

  databaseUrl: requireEnv(
    "DATABASE_URL",
    "postgres://xauusd_app:xauusd_app_password@localhost:5432/xauusd_analysis"
  ),
  databaseSsl: parseBool("DATABASE_SSL", false),

  marketDataProvider: requireEnv("MARKET_DATA_PROVIDER", "mock"),

  oandaApiKey: requireEnv("OANDA_API_KEY", ""),
  oandaAccountId: requireEnv("OANDA_ACCOUNT_ID", ""),
  oandaEnvironment: requireEnv("OANDA_ENVIRONMENT", "practice"),
  oandaInstrument: requireEnv("OANDA_INSTRUMENT", "XAU_USD"),

  strategyVersion: requireEnv("STRATEGY_VERSION", "0.1.0-foundation"),
  structureSwingLookback: parseNumber("STRUCTURE_SWING_LOOKBACK", 2),
  decisionScoreThreshold: parseNumber("DECISION_SCORE_THRESHOLD", 60),

  logLevel: requireEnv("LOG_LEVEL", "info"),
} as const;

export type Env = typeof env;
