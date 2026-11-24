"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatError = exports.handleApiResponse = exports.AuthenticationError = exports.ValidationError = exports.ApiError = void 0;
/**
 * Error handling utilities for KRA eTims SDK
 * Provides custom error classes and error handling functions
 */
const logger_1 = __importDefault(require("./logger"));
/**
 * Custom API Error class
 */
class ApiError extends Error {
    constructor(message, statusCode, errorCode = null, details = null) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
/**
 * Custom Validation Error class
 */
class ValidationError extends Error {
    constructor(message, errors = []) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.errors = errors;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ValidationError = ValidationError;
/**
 * Custom Authentication Error class
 */
class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AuthenticationError = AuthenticationError;
/**
 * Error handler for API responses
 */
const handleApiResponse = (response) => {
    if (!response || !response.data) {
        throw new ApiError('Invalid API response', 500);
    }
    // Check for KRA API specific error codes
    if (response.data.resultCd && response.data.resultCd !== '0000') {
        logger_1.default.error(`[handleApiResponse] API Error: ${response.data.resultMsg || 'Unknown error'}`);
        throw new ApiError(response.data.resultMsg || 'API Error', response.status || 400, response.data.resultCd);
    }
    return response.data;
};
exports.handleApiResponse = handleApiResponse;
/**
 * Format error for consistent response
 */
const formatError = (err) => {
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
exports.formatError = formatError;
