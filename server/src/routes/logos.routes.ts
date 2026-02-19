import { Router } from 'express';
import * as controller from '../controllers/logos.controller';

export const logosRouter = Router();

logosRouter.get('/search', controller.search);
