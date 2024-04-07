import { AppDataSource } from '@src/databases/postgres/data-source';
import { User } from '@src/databases/postgres/entities';
import logger from '@src/utils/logger';

export const createUser = async (userData: any): Promise<User | null> => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.save(userData);

    return user;
  } catch (error) {
    logger.error(
      `[POSTGRES ERROR]: unable to insert new user. error: ${error as string}`,
    );
    return null;
  }
};

export const verifyUser = async (id: string): Promise<boolean> => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    await userRepository.save({ id, is_verified: true });

    return true;
  } catch (error) {
    logger.error(
      `[POSTGRES ERROR]: unable to verify new user's email. error: ${
        error as string
      }`,
    );
    return false;
  }
};

export const getUser = async (identity: string): Promise<User | null> => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: [{ email: identity }, { user_name: identity }],
      select: {
        id: true,
        password: true,
        // is_verified: true,
      },
    });

    return user;
  } catch (error: any) {
    logger.error(
      `[POSTGRES ERROR]: unable to read user data. error: ${error as string}`,
    );
    return null;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    return user;
  } catch (error: any) {
    logger.error(
      `[POSTGRES ERROR]: unable to read user data. error: ${error as string}`,
    );
    return null;
  }
};

export const getUserByUsername = async (
  username: string,
): Promise<User | null> => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: {
        user_name: username,
      },
      select: {
        id: true,
        password: true,
      },
    });

    return user;
  } catch (error: any) {
    logger.error(
      `[POSTGRES ERROR]: unable to read user data. error: ${error as string}`,
    );
    return null;
  }
};
