import { AppDataSource } from '@src/databases/postgres/data-source';
import { Trade } from '@src/databases/postgres/entities';
import logger from '@src/utils/logger';

export const saveTrades = async (trades: any[]): Promise<void> => {
  try {
    const tradeRepository = AppDataSource.getRepository(Trade);

    await tradeRepository.save(trades, { chunk: 100 });
    logger.info(`Saved all trade data`);
  } catch (error) {
    logger.error(`[ERROR SAVING Trade DATA IN POSTGRES]: ${error as string}`);
  }
};

export const deleteAllTrades = async (): Promise<void> => {
  try {
    const tradeRepository = AppDataSource.getRepository(Trade);

    await tradeRepository.clear();
    logger.info(`Cleared all trade data`);
  } catch (error) {
    logger.error(
      `[ERROR DELETING Trade DATA FROM POSTGRES]: ${error as string}`,
    );
  }
};

export const getTotalPnl = async (accountId: string): Promise<string> => {
  try {
    const tradeRepository = AppDataSource.getRepository(Trade);

    const result = await tradeRepository
      .createQueryBuilder('trade')
      .select('SUM(trade.RealPnl + trade.UnrealPnl)', 'totalPnl')
      .where('trade.Account = :accountId', { accountId })
      .getRawOne();

    return result.totalPnl;
  } catch (error) {
    logger.error(
      `[ERROR GETTING TOTAL PNL DATA FROM POSTGRES]: ${error as string}`,
    );
    return '0.00';
  }
};

export const getTotalRealPnl = async (accountId: string): Promise<string> => {
  try {
    const tradeRepository = AppDataSource.getRepository(Trade);

    const result = await tradeRepository
      .createQueryBuilder('trade')
      .select('SUM(trade.RealPnl)', 'totalRealPnl')
      .where('trade.Account = :accountId', { accountId })
      .getRawOne();

    return result.totalRealPnl;
  } catch (error) {
    logger.error(
      `[ERROR GETTING TOTAL UNREAL PNL DATA FROM POSTGRES]: ${error as string}`,
    );
    return '0.00';
  }
};

export const getTotalUnrealPnl = async (accountId: string): Promise<string> => {
  try {
    const tradeRepository = AppDataSource.getRepository(Trade);

    const result = await tradeRepository
      .createQueryBuilder('trade')
      .select('SUM(trade.UnrealPnl)', 'totalUnrealPnl')
      .where('trade.Account = :accountId', { accountId })
      .getRawOne();

    return result.totalUnrealPnl;
  } catch (error) {
    logger.error(
      `[ERROR GETTING TOTAL UNREAL PNL DATA FROM POSTGRES]: ${error as string}`,
    );
    return '0.00';
  }
};

export const getTotalSharesTraded = async (
  accountId: string,
): Promise<number> => {
  try {
    const tradeRepository = AppDataSource.getRepository(Trade);

    const result = await tradeRepository
      .createQueryBuilder('trade')
      .select('SUM(trade.SharesTraded)', 'totalSharesTraded')
      .where('trade.Account = :accountId', { accountId })
      .getRawOne();

    return result.totalSharesTraded;
  } catch (error) {
    logger.error(
      `[ERROR GETTING TOTAL SHARES TRADED DATA FROM POSTGRES]: ${error as string}`,
    );
    return 0;
  }
};

export const getTotalStocksTraded = async (
  accountId: string,
): Promise<number> => {
  try {
    const tradeRepository = AppDataSource.getRepository(Trade);

    const result = await tradeRepository
      .createQueryBuilder('trade')
      .select('COUNT(DISTINCT trade.Symbol)', 'totalStocksTraded')
      .where('trade.Account = :accountId', { accountId })
      .getRawOne();

    return result.totalStocksTraded;
  } catch (error) {
    logger.error(
      `[ERROR GETTING TOTAL STOCKS TRADED DATA FROM POSTGRES]: ${error as string}`,
    );
    return 0;
  }
};

export const getTotalTrades = async (accountId: string): Promise<number> => {
  try {
    const tradeRepository = AppDataSource.getRepository(Trade);
    const result = await tradeRepository
      .createQueryBuilder('trade')
      .select('SUM(trade.Fills)', 'totalTrades')
      .where('trade.Account = :accountId', { accountId })
      .getRawOne();

    return result.totalTrades;
  } catch (error) {
    logger.error(
      `[ERROR GETTING TOTAL NO OF TRADES DATA FROM POSTGRES]: ${error as string}`,
    );
    return 0;
  }
};

export const getTotalNotionalTraded = async (
  accountId: string,
): Promise<string> => {
  try {
    const tradeRepository = AppDataSource.getRepository(Trade);

    const result = await tradeRepository
      .createQueryBuilder('trade')
      .select('SUM(trade.Exp)', 'totalNotionalTraded')
      .where('trade.Account = :accountId', { accountId })
      .getRawOne();

    return result.totalNotionalTraded;
  } catch (error) {
    logger.error(
      `[ERROR GETTING TOTAL NOTIONAL TRADED DATA FROM POSTGRES]: ${error as string}`,
    );
    return '0.00';
  }
};
