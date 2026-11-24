/**
 * Error handling utilities for KRA eTims SDK
 * Provides custom error classes and error handling functions
 */
import logger from './logger';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  public statusCode: number;
  public errorCode: string | null;
  public details: unknown;

  constructor(
    message: string,
    statusCode: number,
    errorCode: string | null = null,
    details: unknown = null
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Custom Validation Error class
 */
export class ValidationError extends Error {
  public errors: unknown[];

  constructor(message: string, errors: unknown[] = []) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.errors = errors;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Custom Authentication Error class
 */
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Shape of the KRA API response envelope
 */
export interface KraResponseData {
  resultCd?: string;
  resultMsg?: string;
  [key: string]: unknown;
}

export interface KraApiResponse<T extends KraResponseData = KraResponseData> {
  data?: T;
  status?: number;
}

/**
 * Consistent error response shape
 */
export interface FormattedError {
  success: false;
  error: {
    message: string;
    code?: string | null;
    details?: unknown;
    validationErrors?: unknown[];
  };
  statusCode: number;
}

/**
 * Error handler for API responses
 */
export const handleApiResponse = <T extends KraResponseData = KraResponseData>(
  response: KraApiResponse<T> | null | undefined
): T => {
  if (!response || !response.data) {
    throw new ApiError('Invalid API response', 500);
  }

  // Check for KRA API specific error codes
  if (response.data.resultCd && response.data.resultCd !== '0000') {
    logger.error(
      `[handleApiResponse] API Error: ${response.data.resultMsg || 'Unknown error'}`
    );
    throw new ApiError(
      response.data.resultMsg || 'API Error',
      response.status || 400,
      response.data.resultCd
    );
  }

  return response.data;
};

/**
 * Format error for consistent response
 */
export const formatError = (err: unknown): FormattedError => {
  if (err instanceof ApiError) {
    return {
      success: false,
      error: {
        message: err.message,
        code: err.errorCode,
        details: err.details
      },
      statusCode: err.statusCode
    };
  }

  if (err instanceof ValidationError) {
    return {
      success: false,
      error: {
        message: err.message,
        validationErrors: err.errors
      },
      statusCode: 400
    };
  }

  if (err instanceof AuthenticationError) {
    return {
      success: false,
      error: { message: err.message },
      statusCode: 401
    };
  }

  // Default error format
  return {
    success: false,
    error: {
      message: err instanceof Error && err.message ? err.message : 'Internal Server Error'
    },
    statusCode: 500
  };
};