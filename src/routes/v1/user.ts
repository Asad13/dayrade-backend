/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { authenticate } from '@src/middlewares/v1/authenticate';
import { getUserProfileHandler } from '@src/controllers/v1/user.controller';

const router = Router();

router.route('/profile').get(authenticate(), getUserProfileHandler);

export default router;
