import type { RequestHandler } from 'express';
import { logosService } from '../services/logos.service';
import { ApiError } from '../utils/ApiError';

export const search: RequestHandler = (req, res, next) => {
  try {
    const company = req.query.company as string | undefined;
    if (!company || company.trim().length === 0) {
      throw ApiError.badRequest('company query parameter is required');
    }
    const result = logosService.searchLogos(company.trim());
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
