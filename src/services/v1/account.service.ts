import { AppDataSource } from '@src/databases/postgres/data-source';
import { Account, User } from '@src/databases/postgres/entities';
import logger from '@src/utils/logger';

export const createAccount = async (data: {
  email: string;
  id: string;
  balance?: string;
}): Promise<void> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const accountRepository = AppDataSource.getRepository(Account);

    const user = await userRepository.findOne({ where: { email: data.email } });

    if (user == null) {
      throw new Error('User not found');
    }

    // Create a new account
    const newAccount = new Account();
    newAccount.id = data.id;
    newAccount.balance = data.balance ?? '0.00';
    newAccount.user = user; // Set the user relation

    // Save the new account
    await accountRepository.save(newAccount);

    // Update the user to refer to the new account
    user.account = newAccount;
    await userRepository.save(user);
  } catch (error) {
    logger.error(
      `[ERROR CREATING ACCOUNT DATA IN POSTGRES]: ${error as string}`,
    );
  }
};

export const saveAccount = async (account: {
  id: string;
  balance?: string;
}): Promise<void> => {
  try {
    const accountRepository = AppDataSource.getRepository(Account);

    await accountRepository.save(account);
  } catch (error) {
    logger.error(`[ERROR SAVING ACCOUNT DATA IN POSTGRES]: ${error as string}`);
  }
};

export const getAccountById = async (id: string): Promise<Account | null> => {
  try {
    const accountRepository = AppDataSource.getRepository(Account);

    const account = await accountRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        balance: true,
      },
    });

    return account;
  } catch (error: any) {
    logger.error(
      `[[POSTGRES ERROR]: unable to read account data. error: ${error as string}`,
    );
    return null;
  }
};
