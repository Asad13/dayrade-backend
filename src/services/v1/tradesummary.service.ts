import { AppDataSource } from '@src/databases/postgres/data-source';
import { TradeSummary, Account } from '@src/databases/postgres/entities';
import logger from '@src/utils/logger';

export const saveTradeSummary = async (
  accountId: string,
  tradeSummary: any,
): Promise<void> => {
  try {
    const accountRepository = AppDataSource.getRepository(Account);
    const tradeSummaryRepository = AppDataSource.getRepository(TradeSummary);

    const account = await accountRepository.findOne({
      where: {
        id: accountId,
      },
      relations: {
        tradesummaries: true,
      },
    });

    if (account == null) {
      throw new Error('Account not found');
    }

    const newTradeSummary = new TradeSummary();
    newTradeSummary.balance = tradeSummary.balance;
    newTradeSummary.totalSharesTraded = tradeSummary.totalSharesTraded;
    newTradeSummary.totalStocksTraded = tradeSummary.totalStocksTraded;
    newTradeSummary.totalTrades = tradeSummary.totalTrades;
    newTradeSummary.totalNotionalTraded = tradeSummary.totalNotionalTraded;
    newTradeSummary.totalPnl = tradeSummary.totalPnl;
    newTradeSummary.totalRealPnl = tradeSummary.totalRealPnl;
    newTradeSummary.totalUnrealPnl = tradeSummary.totalUnrealPnl;
    newTradeSummary.account = account;

    await tradeSummaryRepository.save(newTradeSummary);
  } catch (error) {
    logger.error(
      `[ERROR SAVING TRADESUMMARY DATA IN POSTGRES]: ${error as string}`,
    );
  }
};

export const getTradeSummaries = async (
  id: string,
): Promise<TradeSummary[] | []> => {
  try {
    const tradeSummaryRepository = AppDataSource.getRepository(TradeSummary);

    const data = await tradeSummaryRepository.find({
      where: {
        account: {
          id,
        },
      },
      order: {
        createdAt: 'ASC',
      },
      select: {
        id: true,
        balance: true,
        totalSharesTraded: true,
        totalStocksTraded: true,
        totalTrades: true,
        totalNotionalTraded: true,
        totalPnl: true,
        totalRealPnl: true,
        totalUnrealPnl: true,
        createdAt: true,
      },
    });

    return data;
  } catch (error: any) {
    logger.error(
      `[ERROR READING TRADESUMMARY DATA FROM POSTGRES]: ${error as string}`,
    );
    return [];
  }
};

export const getLatestTradeSummary = async (
  id: string,
): Promise<TradeSummary | null> => {
  try {
    const tradeSummaryRepository = AppDataSource.getRepository(TradeSummary);

    const data = await tradeSummaryRepository.findOne({
      where: {
        account: {
          id,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      select: {
        id: true,
        balance: true,
        totalSharesTraded: true,
        totalStocksTraded: true,
        totalTrades: true,
        totalNotionalTraded: true,
        totalPnl: true,
        totalRealPnl: true,
        totalUnrealPnl: true,
        createdAt: true,
      },
    });

    return data;
  } catch (error: any) {
    logger.error(
      `[ERROR READING LATEST TRADESUMMARY DATA FROM POSTGRES]: ${error as string}`,
    );
    return null;
  }
};
