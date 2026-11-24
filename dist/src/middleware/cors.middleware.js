"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureCors = void 0;
/**
 * CORS middleware for KRA eTims SDK
 * Configures CORS with domain whitelisting
 */
const cors_1 = __importDefault(require("cors"));
const logger_1 = __importDefault(require("../utils/logger"));
const config_1 = require("../config");
/**
 * Create CORS middleware with whitelist configuration
 */
const configureCors = () => {
    try {
        const whitelist = config_1.config.cors.allowedOrigins;
        logger_1.default.info(`CORS whitelist configured with: ${whitelist.join(', ')}`);
        const corsOptions = {
            origin: (origin, callback) => {
                // Allow requests with no origin (like mobile apps, curl, etc.)
                if (!origin) {
                    logger_1.default.debug('CORS: Request with no origin allowed');
                    return callback(null, true);
                }
                if (whitelist.includes('*') || whitelist.includes(origin)) {
                    logger_1.default.debug(`CORS: Origin ${origin} allowed`);
                    return callback(null, true);
                }
                logger_1.default.warn(`CORS: Origin ${origin} blocked by whitelist`);
                callback(new Error('Not allowed by CORS'));
            },
            methods: config_1.config.cors.methods,
            allowedHeaders: config_1.config.cors.allowedHeaders,
            exposedHeaders: config_1.config.cors.exposedHeaders,
            credentials: config_1.config.cors.credentials,
            maxAge: config_1.config.cors.maxAge,
            preflightContinue: false,
            optionsSuccessStatus: 204
        };
        return (0, cors_1.default)(corsOptions);
    }
    catch (error) {
        logger_1.default.error('[configureCors]', error);
        throw error;
    }
};
exports.configureCors = configureCors;
