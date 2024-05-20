import { AppDataSource } from '@src/databases/postgres/data-source';
import { User } from '@src/databases/postgres/entities';
import logger from '@src/utils/logger';

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: {
        id,
      },
      relations: {
        account: true,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        created_at: true,
        updated_at: true,
        account: {
          id: true,
          balance: true,
        },
      },
    });

    return user;
  } catch (error: any) {
    logger.error(
      `[[POSTGRES ERROR]: unable to read user data. error: ${error as string}`,
    );
    return null;
  }
};
