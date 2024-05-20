/* eslint-disable import/first */
import dotenv from 'dotenv';
dotenv.config();
import { createApp } from './app';
import { AppDataSource } from '@databases/postgres/data-source';
import redisClient from '@databases/redis';
import { setProcessEvents } from '@utils/process-events';
import { autoDeleteLogFiles } from '@utils/delete-log-files';
import config from '@configs/config';
import logger from '@utils/logger';
// import { getAndSaveTradingData } from '@utils/trade-data';
import { createServer, type Server } from 'http';

const connectWithResources = async (): Promise<void> => {
  try {
    await redisClient.connect();
    await AppDataSource.initialize();
    logger.info('[POSTGRES CONNECTION]: Connected to Postgres Database...');
  } catch (error) {
    if (!AppDataSource.isInitialized) {
      logger.error(
        `[POSTGRES CONNECTION ERROR]: Unable to connect with Postgres Database...`,
      );
    }
    logger.error(`[RESOURCE CONNECTION ERROR]: shuting down...`);
    process.exit(1);
  }
};

const init = async (): Promise<void> => {
  await connectWithResources();
  logger.info('Connected to all the resources...');

  /* Creating HTTP Server */
  const app = createApp();
  const server: Server = createServer(app);

  const PORT = process.env.PORT ?? 3001;
  server.listen(PORT, (): void => {
    logger.info(`server listening on port ${PORT}`);

    if (process.env.NODE_ENV === 'development') {
      console.log(`dev: visit http://localhost:${PORT}/api`);
      console.log(`dev: read docs at http://localhost:${PORT}/api/docs`);
    }

    if (
      (process.env.NODE_ENV === 'production' ||
        process.env.NODE_ENV === 'staging') &&
      process.send != null
    ) {
      process.send('ready'); // Sending the ready signal to PM2
    }
  });

  server.on('error', (error: Error) => {
    logger.error(error.message);
  });

  config.server = server;
  setProcessEvents(); // set process events
  autoDeleteLogFiles(); // Deleting Log files if the file sizes crosses 10mb
  // await getAndSaveTradingData();
};

init()
  .then(() => {})
  .catch(() => {
    logger.error(`[SERVER ERROR]: shuting down...`);
    process.exit(1);
  });
