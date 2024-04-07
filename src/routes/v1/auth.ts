/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import validate from '@src/middlewares/v1/data-validation';
import {
  signupSchema,
  loginSchema,
  usernameCheckSchema,
  // verifyEmailSchema,
} from '@src/schemas/validation/v1/auth.schema';
import { authenticate } from '@src/middlewares/v1/authenticate';
import {
  authCheckHandler,
  signupHandler,
  usernameCheckHandler,
  // verifyEmailHandler,
  loginHandler,
  logoutHandler,
} from '@src/controllers/v1/auth.controller';

const router = Router();

router.route('/check').post(authenticate(), authCheckHandler);
router
  .route('/check-username')
  .post(validate(usernameCheckSchema), usernameCheckHandler);
router.route('/signup').post(validate(signupSchema), signupHandler);
// router
//   .route('/verify-email')
//   .post(validate(verifyEmailSchema), verifyEmailHandler);
router.route('/login').post(validate(loginSchema), loginHandler);
router.route('/logout').post(authenticate(), logoutHandler);

export default router;
