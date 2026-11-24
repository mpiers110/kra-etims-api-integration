"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Logger utility for KRA eTims SDK
 * Provides consistent logging across the application
 */
const winston_1 = require("winston");
const isProduction = process.env.NODE_ENV === 'production';
const logger = (0, winston_1.createLogger)({
    level: isProduction ? 'info' : 'debug',
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
    defaultMeta: { service: 'kra-etims-sdk' },
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}` +
                (info.stack ? `\n${info.stack}` : '')))
        })
    ]
});
// File transports in production
if (isProduction) {
    logger.add(new winston_1.transports.File({
        filename: 'logs/error.log',
        level: 'error'
    }));
    logger.add(new winston_1.transports.File({
        filename: 'logs/combined.log'
    }));
}
exports.default = logger;
