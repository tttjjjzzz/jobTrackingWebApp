import { Router } from 'express';
import { jobsRouter } from './jobs.routes';
import { logosRouter } from './logos.routes';

export const routes = Router();

routes.use('/jobs', jobsRouter);
routes.use('/logos', logosRouter);
