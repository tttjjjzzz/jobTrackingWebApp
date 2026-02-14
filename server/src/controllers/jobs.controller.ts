import type { RequestHandler } from 'express';
import { jobsService } from '../services/jobs.service';

export const getAll: RequestHandler = (req, res, next) => {
  try {
    const result = jobsService.getAllJobs(req.query as any);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const getById: RequestHandler = (req, res, next) => {
  try {
    const job = jobsService.getJobById(req.params.id);
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

export const create: RequestHandler = (req, res, next) => {
  try {
    const job = jobsService.createJob(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

export const update: RequestHandler = (req, res, next) => {
  try {
    const job = jobsService.updateJob(req.params.id, req.body);
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

export const updateStatus: RequestHandler = (req, res, next) => {
  try {
    const job = jobsService.updateJobStatus(req.params.id, req.body.status);
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

export const remove: RequestHandler = (req, res, next) => {
  try {
    jobsService.deleteJob(req.params.id);
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
};
