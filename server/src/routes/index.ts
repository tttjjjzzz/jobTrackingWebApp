import { Router } from 'express';
import { jobsRouter } from './jobs.routes';

export const routes = Router();

routes.use('/jobs', jobsRouter);
