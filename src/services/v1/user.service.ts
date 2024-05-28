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
        profile: true,
      },
      select: {
        id: true,
        email: true,
        user_name: true,
        profile: {
          id: true,
        },
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

export const getUserProfileById = async (id: string): Promise<User | null> => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: {
        id,
      },
      relations: {
        account: true,
        profile: true,
      },
      select: {
        id: true,
        email: true,
        user_name: true,
        created_at: true,
        updated_at: true,
        profile: {
          id: true,
          first_name: true,
          last_name: true,
          show_name: true,
          profile_image_path: true,
          country: true,
          alt_email: true,
          job_title: true,
          show_job_title: true,
          dob: true,
          show_dob: true,
          bio: true,
          twitch_account: true,
          show_twitch_account: true,
          discord_account: true,
          show_discord_account: true,
          twitter_account: true,
          show_twitter_account: true,
          instagram_account: true,
          show_instagram_account: true,
          linkedin_account: true,
          show_linkedin_account: true,
          updated_at: true,
        },
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
