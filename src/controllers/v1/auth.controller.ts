import type { Request, Response, NextFunction } from 'express';
import CustomError, { ErrorCode, ErrorType } from '@utils/custom-error';
import type {
  TSignupInput,
  TLoginInput,
  TUsernameCheckInput,
  // TVerifyEmailInput,
} from '@src/schemas/validation/v1/auth.schema';
import {
  createUser,
  getUser,
  getUserByEmail,
  getUserByUsername /*, verifyUser */,
} from '@services/v1/auth.service';
import logger from '@src/utils/logger';
import _ from 'lodash';
import bcrypt from 'bcrypt';
// import type { IPayload } from '@src/types/misc.type';

export const authCheckHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.status(200).json({
    status: true,
    message: 'Logged in',
  });
};

export const usernameCheckHandler = async (
  req: Request<Record<string, unknown>, any, TUsernameCheckInput['body']>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userWithUniqueId = await getUserByUsername(req.body.user_name);

    if (userWithUniqueId != null) {
      const error = new CustomError(
        `This username is taken. Try another...`,
        ErrorCode.CONFLICT,
        ErrorType.CLIENT,
      );

      throw error as ICustomError;
    }

    res.status(200).json({
      status: true,
      message: 'Valid Username',
    });
  } catch (error: any) {
    next(error);
  }
};

export const signupHandler = async (
  req: Request<Record<string, unknown>, any, TSignupInput['body']>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userData = _.pick(req.body, [
      'email',
      'user_name',
      'password',
      'country',
    ]);

    const user = await getUserByEmail(userData.email);

    if (user != null) {
      const error = new CustomError(
        `User already exists`,
        ErrorCode.CONFLICT,
        ErrorType.CLIENT,
      );

      throw error as ICustomError;
    }

    const userWithUniqueId = await getUserByUsername(userData.user_name);

    if (userWithUniqueId != null) {
      const error = new CustomError(
        `This username is taken. Try another...`,
        ErrorCode.CONFLICT,
        ErrorType.CLIENT,
      );

      throw error as ICustomError;
    }

    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    const newUser = await createUser(userData);

    if (newUser == null) {
      const error = new CustomError(
        `Internal Server Error`,
        ErrorCode.INTERNAL_SERVER_ERROR,
        ErrorType.SERVER,
      );

      throw error as ICustomError;
    }

    res.status(200).json({
      status: true,
      message: 'Signed up successfully',
    });
  } catch (error: any) {
    next(error);
  }
};

/*
export const verifyEmailHandler = async (
  req: Request<Record<string, unknown>, any, TVerifyEmailInput['body']>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { token } = req.body;

    if (process.env.EMAIL_TOKEN_SECRET_KEY === undefined) {
      logger.error(
        `[EMAIL ERROR]: no 'EMAIL_TOKEN_SECRET_KEY' found among the environment variables`,
      );

      const error = new CustomError(
        `Email verification unsuccessful`,
        ErrorCode.INTERNAL_SERVER_ERROR,
        ErrorType.SERVER,
      );

      throw error as ICustomError;
    }

    const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET_KEY);

    if (decoded.sub !== undefined && typeof decoded.sub === 'string') {
      const isVerified = await verifyUser(decoded.sub);

      if (!isVerified) {
        const error = new CustomError(
          `Email verification unsuccessful`,
          ErrorCode.INTERNAL_SERVER_ERROR,
          ErrorType.SERVER,
        );

        throw error as ICustomError;
      }

      res.status(200).json({
        status: true,
        message: 'Email verified successfully',
      });
    } else {
      const error = new CustomError(
        `Email verification unsuccessful`,
        ErrorCode.BAD_REQUEST,
        ErrorType.CLIENT,
      );

      throw error as ICustomError;
    }
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.error(`[JWT ERROR]: JWT has expired. ${error?.message ?? ''}`);
    } else if (error instanceof jwt.NotBeforeError) {
      logger.error(`[JWT ERROR]: JWT not yet valid. ${error?.message ?? ''}`);
    } else if (error instanceof jwt.JsonWebTokenError) {
      logger.error(
        `[JWT ERROR]: JWT verification failed. ${error?.message ?? ''}`,
      );
    }

    if (error instanceof CustomError) {
      next(error);
    } else {
      const error = new CustomError(
        'Email verification unsuccessful',
        ErrorCode.INTERNAL_SERVER_ERROR,
        ErrorType.SERVER,
      );

      next(error);
    }
  }
};
*/

export const loginHandler = async (
  req: Request<Record<string, unknown>, any, TLoginInput['body']>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userData = _.pick(req.body, ['identity', 'password']);

    const user = await getUser(userData.identity);

    if (user == null) {
      const error = new CustomError(
        `Invalid username/email or password`,
        ErrorCode.NOT_FOUND,
        ErrorType.CLIENT,
      );

      throw error as ICustomError;
    }
    // else if (!user.is_verified) {
    //   const error = new CustomError(
    //     `Email not verified`,
    //     ErrorCode.NOT_FOUND,
    //     ErrorType.CLIENT,
    //   );

    //   throw error as ICustomError;
    // }

    const isValidUser: boolean = await bcrypt.compare(
      userData.password,
      user.password,
    );

    if (!isValidUser) {
      const error = new CustomError(
        `Invalid username/email or password`,
        ErrorCode.BAD_REQUEST,
        ErrorType.CLIENT,
      );

      throw error as ICustomError;
    }

    req.session.userId = user.id;

    res.status(200).json({
      status: true,
      message: 'Logged in successfully',
    });
  } catch (error: any) {
    next(error);
  }
};

export const logoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    req.session.destroy((err) => {
      if (err instanceof Error) {
        logger.error(
          `[SESSION ERROR]: ${err?.message ?? 'Error in destroying session'}`,
        );
        const error = new CustomError(
          `Internal Server Error`,
          ErrorCode.INTERNAL_SERVER_ERROR,
          ErrorType.SERVER,
        );

        throw error as ICustomError;
      }
      // res.redirect('/');
      res.status(200).json({
        status: true,
        message: 'Logged out successfully',
      });
    });
  } catch (error: any) {
    next(error);
  }
};
