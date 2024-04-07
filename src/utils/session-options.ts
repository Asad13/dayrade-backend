import type { SessionOptions } from 'express-session';
import RedisStore from 'connect-redis';
import redisClient from '@databases/redis';

export const getSessionOptions = (): SessionOptions => {
  // Initialize store.
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'dayrade:',
  });

  const maxAge =
    process.env.SESSION_MAX_AGE !== undefined &&
    !isNaN(parseInt(process.env.SESSION_MAX_AGE))
      ? parseInt(process.env.SESSION_MAX_AGE)
      : 86400000;

  const sessionOptions: SessionOptions = {
    name: 'dayrade-session',
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: process.env.SESSION_SECRET ?? 'dayrade', // will use an array
    rolling: true, // With this enabled, the session identifier cookie will expire in maxAge since the last response was sent instead of in maxAge since the session was last modified by the server
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: process.env.NODE_ENV !== 'development' ? 'strict' : 'lax',
      maxAge,
      // domain: process.env.DOMAIN,
      path: '/',
    },
  };

  return sessionOptions;
};
