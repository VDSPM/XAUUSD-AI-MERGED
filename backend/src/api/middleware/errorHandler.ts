import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { isAppError } from "../../types/errors.js";
import { logger } from "../../logging/logger.js";

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply): void {
  if (isAppError(error)) {
    logger.warn({ err: error, path: request.url }, `handled error: ${error.code}`);
    reply.status(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
      },
    });
    return;
  }

  // Fastify schema validation errors
  if (error.validation) {
    reply.status(400).send({
      error: {
        code: "VALIDATION_ERROR",
        message: error.message,
        details: error.validation,
      },
    });
    return;
  }

  logger.error({ err: error, path: request.url }, "unhandled error");
  reply.status(500).send({
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred.",
    },
  });
}
