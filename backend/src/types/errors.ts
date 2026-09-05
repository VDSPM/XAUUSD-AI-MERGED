/**
 * Base class for all application errors that should be mapped to a specific
 * HTTP status code by the API error handler.
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Market data provider could not be reached or returned an error. */
export class ProviderError extends AppError {
  constructor(message: string) {
    super(message, 502, "PROVIDER_ERROR");
  }
}

/** Candle data is missing, incomplete, or fails basic sanity checks. */
export class InvalidDataError extends AppError {
  constructor(message: string) {
    super(message, 422, "INVALID_DATA");
  }
}

/** Data was retrieved but is older than the freshness threshold for its timeframe. */
export class StaleDataError extends AppError {
  constructor(message: string) {
    super(message, 422, "STALE_DATA");
  }
}

/** Request failed schema/semantic validation. */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

/** Requested resource does not exist. */
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, "NOT_FOUND");
  }
}

/** Database connection or query failure. */
export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 503, "DATABASE_ERROR");
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}
