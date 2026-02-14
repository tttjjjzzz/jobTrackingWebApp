import type { RequestHandler } from 'express';

export const authMiddleware: RequestHandler = (_req, _res, next) => {
  // Placeholder: no authentication required for single-user app.
  // To add auth later, verify JWT/session here and attach user to req.
  next();
};
