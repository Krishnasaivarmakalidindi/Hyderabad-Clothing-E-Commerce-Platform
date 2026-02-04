/**
 * Production-ready logger using Winston
 * Replaces console.log statements with structured logging
 */

import { createLogger, format, transports } from 'winston';
import { env } from '../config/env.js';

const { combine, timestamp, printf, colorize, errors, json } = format;

// Custom format for development
const devFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let meta = '';
  if (Object.keys(metadata).length > 0) {
    meta = ` ${JSON.stringify(metadata)}`;
  }
  return `${timestamp} [${level}]: ${message}${meta}`;
});

// Create logger instance
const logger = createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true })
  ),
  defaultMeta: { service: 'hyderabad-clothing-api' },
  transports: [
    // Console transport
    new transports.Console({
      format: env.NODE_ENV === 'production'
        ? combine(timestamp(), json())
        : combine(colorize(), timestamp({ format: 'HH:mm:ss' }), devFormat),
    }),
  ],
});

// Add file transports in production
if (env.NODE_ENV === 'production') {
  // Error logs
  logger.add(
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(timestamp(), json()),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );

  // Combined logs
  logger.add(
    new transports.File({
      filename: 'logs/combined.log',
      format: combine(timestamp(), json()),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Export convenience methods
export default {
  info: (message: string, meta?: object) => logger.info(message, meta),
  warn: (message: string, meta?: object) => logger.warn(message, meta),
  error: (message: string, meta?: object) => logger.error(message, meta),
  debug: (message: string, meta?: object) => logger.debug(message, meta),
  http: (message: string, meta?: object) => logger.http(message, meta),
};
