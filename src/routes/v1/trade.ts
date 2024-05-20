/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { authenticate } from '@src/middlewares/v1/authenticate';
import { getTradeSummariesHandler } from '@src/controllers/v1/trade.controller';

const router = Router();

router.route('/summaries').get(authenticate(), getTradeSummariesHandler);

export default router;
