import type { Request, Response, NextFunction } from 'express';
import CustomError, { ErrorCode, ErrorType } from '@utils/custom-error';
import { getTradeSummaries } from '@services/v1/tradesummary.service';
import { getUserById } from '@services/v1/user.service';

export const getTradeSummariesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (req.session.userId === undefined) {
      const error = new CustomError(
        `Unauthorized`,
        ErrorCode.BAD_REQUEST,
        ErrorType.CLIENT,
      );

      throw error as ICustomError;
    }

    const user = await getUserById(req.session.userId);

    if (user == null) {
      const error = new CustomError(
        `Internal Server Error`,
        ErrorCode.INTERNAL_SERVER_ERROR,
        ErrorType.DATABASE,
      );

      throw error as ICustomError;
    } else if (user.account == null || user.account === undefined) {
      res.status(200).json({
        status: false,
        message: "You aren't registered on Zimtra",
        data: null,
      });
    }

    const tradeSummaries = await getTradeSummaries(user.account.id);

    res.status(200).json({
      status: true,
      message: 'Trade Summaries',
      data: tradeSummaries,
    });
  } catch (error) {
    next(error);
  }
};
