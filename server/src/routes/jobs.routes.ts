import { Router } from 'express';
import { validate } from '../middleware/validate';
import { authMiddleware } from '../middleware/auth';
import * as controller from '../controllers/jobs.controller';
import {
  createJobSchema,
  updateJobSchema,
  updateStatusSchema,
  queryParamsSchema,
} from '@jobtracker/shared';

export const jobsRouter = Router();

jobsRouter.use(authMiddleware);

jobsRouter.get('/', validate(queryParamsSchema, 'query'), controller.getAll);
jobsRouter.get('/:id', controller.getById);
jobsRouter.post('/', validate(createJobSchema), controller.create);
jobsRouter.put('/:id', validate(updateJobSchema), controller.update);
jobsRouter.patch('/:id/status', validate(updateStatusSchema), controller.updateStatus);
jobsRouter.delete('/:id', controller.remove);
