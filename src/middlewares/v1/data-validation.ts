import type { Request, Response, NextFunction } from 'express';
import type { AnyZodObject } from 'zod';
import { authErrorMsgs } from '@configs/error-messages';
import { ErrorCode, ErrorType } from '@utils/custom-error';
import logger from '@utils/logger';

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      const errors: any = {};
      error.errors.forEach((error: any) => {
        errors[error.path[1]] = error.message;
      });

      logger.error({
        code: ErrorCode.BAD_REQUEST,
        message: errors,
        name: ErrorType.CLIENT,
      });

      res.status(400).json({
        status: false,
        message: authErrorMsgs[req.originalUrl] ?? ErrorType.CLIENT,
        errors,
      });
    }
  };

export default validate;
