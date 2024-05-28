import type { Request, Response, NextFunction } from 'express';
import CustomError, { ErrorCode, ErrorType } from '@utils/custom-error';
import { getUserProfileById } from '@services/v1/user.service';

export const getUserProfileHandler = async (
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

    const user = await getUserProfileById(req.session.userId);

    if (user == null) {
      const error = new CustomError(
        `Internal Server Error`,
        ErrorCode.INTERNAL_SERVER_ERROR,
        ErrorType.DATABASE,
      );

      throw error as ICustomError;
    }

    res.status(200).json({
      status: true,
      message: 'User Profile',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
