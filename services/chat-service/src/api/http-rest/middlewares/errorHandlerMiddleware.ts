import { CoreDITokens } from "@core/common/di/CoreDITokens";
import type { LoggerPort } from "@core/common/port/logger/LoggerPort";
import { z, ZodError } from "zod/v4";
import httpStatus from "http-status";
import { Exception } from "@core/common/exception/Exception";
import { getHttpErrorCode } from "@shared/errors/error-code";
import { Code } from "@core/common/error/Code";
import { container } from "@di/RootModule";
import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import type { HTTPResponseError } from "hono/types";

export const errorHandler = (error: Error | HTTPResponseError, c: Context) => {
  const logger = container
    .get<LoggerPort>(CoreDITokens.Logger)
    .fromContext("HTTP");
  console.log(error);
  logger.error(error?.message, error as Record<string, any>);
  if (error instanceof ZodError) {
    c.status(httpStatus.BAD_REQUEST);
    return c.json({
      message: "Invalid input data",
      code: "VALIDATION_ERROR",
      error: z.treeifyError(error),
    });
  }
  if (error instanceof Exception) {
    c.status(getHttpErrorCode(error.code) as StatusCode);
    return c.json({
      message: error.message,
      code: error.code,
    });
  }

  c.status(httpStatus.INTERNAL_SERVER_ERROR);

  return c.json({
    message: Code.INTERNAL_ERROR.message,
    code: Code.INTERNAL_ERROR.code,
  });
};

export const notFoundHandler = (c: Context) => {
  c.status(httpStatus.NOT_FOUND);
  return c.json({
    message: Code.NOT_FOUND_ERROR.message,
    code: Code.NOT_FOUND_ERROR.code,
  });
};
