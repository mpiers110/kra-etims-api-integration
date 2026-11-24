/**
 * Logger utility for KRA eTims SDK
 * Provides consistent logging across the application
 */
import { format, createLogger, transports,Logger} from 'winston';

const isProduction = process.env.NODE_ENV === 'production';

const logger: Logger = createLogger({
  level: isProduction ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'kra-etims-sdk' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          (info) =>
            `${info.timestamp} ${info.level}: ${info.message}` +
            (info.stack ? `\n${info.stack}` : '')
        )
      )
    })
  ]
});

// File transports in production
if (isProduction) {
  logger.add(
    new transports.File({
      filename: 'logs/error.log',
      level: 'error'
    })
  );
  logger.add(
    new transports.File({
      filename: 'logs/combined.log'
    })
  );
}

export default logger;