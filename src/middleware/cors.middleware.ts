/**
 * CORS middleware for KRA eTims SDK
 * Configures CORS with domain whitelisting
 */
import cors, { CorsOptions } from 'cors';
import { RequestHandler } from 'express';
import logger from '../utils/logger';
import { config } from '../config';

/**
 * Create CORS middleware with whitelist configuration
 */
export const configureCors = (): RequestHandler => {
  try {
    const whitelist: string[] = config.cors.allowedOrigins;

    logger.info(`CORS whitelist configured with: ${whitelist.join(', ')}`);

    const corsOptions: CorsOptions = {
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) {
          logger.debug('CORS: Request with no origin allowed');
          return callback(null, true);
        }

        if (whitelist.includes('*') || whitelist.includes(origin)) {
          logger.debug(`CORS: Origin ${origin} allowed`);
          return callback(null, true);
        }

        logger.warn(`CORS: Origin ${origin} blocked by whitelist`);
        callback(new Error('Not allowed by CORS'));
      },
      methods: config.cors.methods,
      allowedHeaders: config.cors.allowedHeaders,
      exposedHeaders: config.cors.exposedHeaders,
      credentials: config.cors.credentials,
      maxAge: config.cors.maxAge,
      preflightContinue: false,
      optionsSuccessStatus: 204
    };

    return cors(corsOptions);
  } catch (error) {
    logger.error('[configureCors]', error);
    throw error;
  }
};