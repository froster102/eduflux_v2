import { asyncLocalStorage } from '@/utils/async-store/asyncStore';
import { logger } from '@/utils/logging/logger';
import { randomUUID } from 'crypto';
import type { Request, Response, NextFunction } from 'express';

export function httpLogger() {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.headers['x-request-id']?.toString() || randomUUID();
    const correlationId =
      req.headers['x-correlation-id']?.toString() || requestId;

    res.setHeader('x-request-id', requestId);
    res.setHeader('x-correlation-id', correlationId);

    asyncLocalStorage.run(
      new Map([
        ['requestId', requestId],
        ['correlationId', correlationId],
      ]),
      () => {
        res.on('finish', () => {
          const remoteAddr =
            (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
            req.socket.remoteAddress ||
            '-';

          const now = new Date().toISOString();
          const referrer = req.get('referer') || '-';
          const userAgent = req.get('user-agent') || '-';

          const log = `${remoteAddr} -  [${now}] "${req.method} ${req.originalUrl} HTTP/${req.httpVersion}" ${res.statusCode} "${referrer}" "${userAgent}" request_id="${requestId}" correlation_id="${correlationId}"`;
          logger.info(log);
        });

        next();
      },
    );
  };
}
