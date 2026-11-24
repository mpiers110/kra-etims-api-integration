/**
 * KRA eTims Integration SDK
 * Main entry point for the SDK
 */
import 'dotenv/config'; // must stay first so env vars load before other modules read them
import express, { Application, NextFunction, Request, Response } from 'express';
import { Server } from 'http';
import logger from './utils/logger';
import { formatError } from './utils/errors';

// Import services
import * as authService from './services/auth.service';
import * as initializationService from './services/initialization.service';
import * as basicDataService from './services/basic-data.service';
import * as salesService from './services/sales.service';
import * as stockService from './services/stock.service';
import * as purchaseService from './services/purchase.service';

// CORS middleware
import { configureCors } from './middleware/cors.middleware';

// Import routes
import apiRoutes from './routes/api.routes';

export interface KRAeTimsSDKOptions {
  /** Create an Express server instance */
  server?: boolean;
  [key: string]: unknown;
}

/**
 * KRA eTims SDK class
 * Provides a unified interface to interact with the KRA eTims API
 */
export class KRAeTimsSDK {
  public readonly options: KRAeTimsSDKOptions;

  // Services
  public readonly auth: typeof authService;
  public readonly initialization: typeof initializationService;
  public readonly basicData: typeof basicDataService;
  public readonly sales: typeof salesService;
  public readonly stock: typeof stockService;
  public readonly purchase: typeof purchaseService;

  // Server (only set when options.server is true / after start())
  public app?: Application;
  public server?: Server;

  constructor(options: KRAeTimsSDKOptions = {}) {
    this.options = options;

    // Initialize services
    this.auth = authService;
    this.initialization = initializationService;
    this.basicData = basicDataService;
    this.sales = salesService;
    this.stock = stockService;
    this.purchase = purchaseService;

    // Create express app if server is enabled
    if (options.server) {
      this.initializeServer();
    }
  }

  /**
   * Initialize Express server
   */
  private initializeServer(): void {
    try {
      const app = express();

      // Apply CORS middleware with domain whitelisting
      app.use(configureCors());

      // Configure middleware
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));

      // Add request logging middleware
      app.use((req: Request, _res: Response, next: NextFunction) => {
        logger.info(`${req.method} ${req.path}`);
        next();
      });

      // Add API routes
      app.use('/api', apiRoutes);

      // Add 404 handler
      app.use((_req: Request, res: Response) => {
        res.status(404).json({
          success: false,
          error: {
            message: 'Resource not found'
          }
        });
      });

      // Add error handling middleware (4 args required for Express to treat it as one)
      app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
        const message = err instanceof Error ? err.message : String(err);
        logger.error(`Error processing request: ${message}`);
        const formattedError = formatError(err);
        res.status(formattedError.statusCode || 500).json(formattedError);
      });

      this.app = app;
    } catch (error) {
      logger.error('[KRAeTimsSDK.initializeServer]', error);
      throw error;
    }
  }

  /**
   * Start the Express server
   * @param port Port to listen on
   */
  async start(port: number = Number(process.env.PORT) || 5000): Promise<void> {
    try {
      const app = this.app;
      if (!app) {
        throw new Error('Server not initialized. Set server: true in options.');
      }

      await new Promise<void>((resolve, reject) => {
        const server = app.listen(port, () => {
          logger.info(`KRA eTims SDK server running on port ${port}`);
          resolve();
        });
        // e.g. EADDRINUSE: without this the promise would never settle
        server.once('error', reject);
        this.server = server;
      });
    } catch (error) {
      logger.error('[KRAeTimsSDK.start]', error);
      throw error;
    }
  }

  /**
   * Stop the Express server
   */
  async stop(): Promise<void> {
    try {
      const server = this.server;
      if (!server) {
        return;
      }

      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          logger.info('KRA eTims SDK server stopped');
          resolve();
        });
      });

      this.server = undefined;
    } catch (error) {
      logger.error('[KRAeTimsSDK.stop]', error);
      throw error;
    }
  }
}

// Export the SDK class
export default KRAeTimsSDK;

// If this file is run directly, start the server
if (require.main === module) {
  const sdk = new KRAeTimsSDK({ server: true });
  sdk.start().catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    logger.error(`Failed to start server: ${message}`);
    process.exit(1);
  });
}