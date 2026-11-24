"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KRAeTimsSDK = void 0;
/**
 * KRA eTims Integration SDK
 * Main entry point for the SDK
 */
require("dotenv/config"); // must stay first so env vars load before other modules read them
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./utils/logger"));
const errors_1 = require("./utils/errors");
// Import services
const authService = __importStar(require("./services/auth.service"));
const initializationService = __importStar(require("./services/initialization.service"));
const basicDataService = __importStar(require("./services/basic-data.service"));
const salesService = __importStar(require("./services/sales.service"));
const stockService = __importStar(require("./services/stock.service"));
const purchaseService = __importStar(require("./services/purchase.service"));
// CORS middleware
const cors_middleware_1 = require("./middleware/cors.middleware");
// Import routes
const api_routes_1 = __importDefault(require("./routes/api.routes"));
/**
 * KRA eTims SDK class
 * Provides a unified interface to interact with the KRA eTims API
 */
class KRAeTimsSDK {
    constructor(options = {}) {
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
    initializeServer() {
        try {
            const app = (0, express_1.default)();
            // Apply CORS middleware with domain whitelisting
            app.use((0, cors_middleware_1.configureCors)());
            // Configure middleware
            app.use(express_1.default.json());
            app.use(express_1.default.urlencoded({ extended: true }));
            // Add request logging middleware
            app.use((req, _res, next) => {
                logger_1.default.info(`${req.method} ${req.path}`);
                next();
            });
            // Add API routes
            app.use('/api', api_routes_1.default);
            // Add 404 handler
            app.use((_req, res) => {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Resource not found'
                    }
                });
            });
            // Add error handling middleware (4 args required for Express to treat it as one)
            app.use((err, _req, res, _next) => {
                const message = err instanceof Error ? err.message : String(err);
                logger_1.default.error(`Error processing request: ${message}`);
                const formattedError = (0, errors_1.formatError)(err);
                res.status(formattedError.statusCode || 500).json(formattedError);
            });
            this.app = app;
        }
        catch (error) {
            logger_1.default.error('[KRAeTimsSDK.initializeServer]', error);
            throw error;
        }
    }
    /**
     * Start the Express server
     * @param port Port to listen on
     */
    start() {
        return __awaiter(this, arguments, void 0, function* (port = Number(process.env.PORT) || 5000) {
            try {
                const app = this.app;
                if (!app) {
                    throw new Error('Server not initialized. Set server: true in options.');
                }
                yield new Promise((resolve, reject) => {
                    const server = app.listen(port, () => {
                        logger_1.default.info(`KRA eTims SDK server running on port ${port}`);
                        resolve();
                    });
                    // e.g. EADDRINUSE: without this the promise would never settle
                    server.once('error', reject);
                    this.server = server;
                });
            }
            catch (error) {
                logger_1.default.error('[KRAeTimsSDK.start]', error);
                throw error;
            }
        });
    }
    /**
     * Stop the Express server
     */
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const server = this.server;
                if (!server) {
                    return;
                }
                yield new Promise((resolve, reject) => {
                    server.close((err) => {
                        if (err) {
                            return reject(err);
                        }
                        logger_1.default.info('KRA eTims SDK server stopped');
                        resolve();
                    });
                });
                this.server = undefined;
            }
            catch (error) {
                logger_1.default.error('[KRAeTimsSDK.stop]', error);
                throw error;
            }
        });
    }
}
exports.KRAeTimsSDK = KRAeTimsSDK;
// Export the SDK class
exports.default = KRAeTimsSDK;
// If this file is run directly, start the server
if (require.main === module) {
    const sdk = new KRAeTimsSDK({ server: true });
    sdk.start().catch((err) => {
        const message = err instanceof Error ? err.message : String(err);
        logger_1.default.error(`Failed to start server: ${message}`);
        process.exit(1);
    });
}
