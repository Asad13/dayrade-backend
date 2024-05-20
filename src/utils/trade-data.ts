/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  saveTrades,
  deleteAllTrades,
  getTotalSharesTraded,
  getTotalStocksTraded,
  getTotalTrades,
  getTotalNotionalTraded,
  getTotalPnl,
  getTotalRealPnl,
  getTotalUnrealPnl,
} from '@src/services/v1/trade.service';
import { getAccountById, saveAccount } from '@src/services/v1/account.service';
import { saveTradeSummary } from '@src/services/v1/tradesummary.service';
import logger from './logger';

const handleTradingData = async (data: any[]): Promise<void> => {
  try {
    logger.info(
      '[START LOADING TRADING DATA]: start loading trading data from Zimtra',
    );
    const accountIds: string[] = [];
    for (let i = 0; i < data.length; i++) {
      if (!accountIds.includes(data[i].Account as string)) {
        accountIds.push(data[i].Account as string);
      }
    }

    await saveTrades(data);

    for (let i = 0; i < accountIds.length; i++) {
      const account = await getAccountById(accountIds[i]);

      if (account == null) continue;

      const totalSharesTraded = await getTotalSharesTraded(accountIds[i]);
      const totalStocksTraded = await getTotalStocksTraded(accountIds[i]);
      const totalTrades = await getTotalTrades(accountIds[i]);
      const totalNotionalTraded = await getTotalNotionalTraded(accountIds[i]);
      const totalPnl = await getTotalPnl(accountIds[i]);
      const totalRealPnl = await getTotalRealPnl(accountIds[i]);
      const totalUnrealPnl = await getTotalUnrealPnl(accountIds[i]);
      const balance = (
        parseFloat(account.balance) + parseFloat(totalPnl)
      ).toString();

      const tradeSummary = {
        balance,
        totalSharesTraded,
        totalStocksTraded,
        totalTrades,
        totalNotionalTraded,
        totalPnl,
        totalRealPnl,
        totalUnrealPnl,
      };

      await saveTradeSummary(accountIds[i], tradeSummary);

      await saveAccount({ id: account.id, balance });
    }

    await deleteAllTrades();

    logger.info('[LOADED TRADING DATA]: loaded trading data from Zimtra');
  } catch (error: any) {
    logger.error(
      `[ERROR LOADING TRADING DATA]: ${error.message ?? 'unable to load trade data from Zimtra'}`,
    );
  }
};

export const getAndSaveTradingData = async (): Promise<void> => {
  try {
    const url =
      process.env.TRADE_API_ENDPOINT ??
      'https://portal.datacustomz.com/dayrade.php';
    const apiKey = process.env.TRADE_X_API_KEY;

    if (apiKey === undefined) {
      throw new Error('TRADE_X_API_KEY environment variable is not defined');
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
    };

    const response = await fetch(url, requestOptions);
    const data = await response.json();

    if (data?.data !== undefined && data.data.length > 0) {
      await handleTradingData(data?.data as any[]);
    }

    setInterval(async () => {
      try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();

        if (data?.data !== undefined && data.data.length > 0) {
          await handleTradingData(data?.data as any[]);
        }
      } catch (error: any) {
        logger.error(
          `[ERROR FETCHING TRADING DATA]: ${error.message ?? 'unable to fetch trade data from Zimtra'}`,
        );
      }
    }, 60 * 1000).unref();
  } catch (error: any) {
    logger.error(
      `[ERROR FETCHING TRADING DATA]: ${error.message ?? 'unable to fetch trade data from Zimtra'}`,
    );
  }
};

export const loadTradingData = async (): Promise<void> => {};
