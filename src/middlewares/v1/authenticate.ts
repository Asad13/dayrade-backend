import type { Request, Response, NextFunction } from 'express';
import CustomError, { ErrorCode, ErrorType } from '@utils/custom-error';

export const authenticate =
  () => (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.session.userId === undefined) {
        const error = new CustomError(
          `Unauthorized`,
          ErrorCode.UNAUTHORIZED,
          ErrorType.CLIENT
        );

        throw error as ICustomError;
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
