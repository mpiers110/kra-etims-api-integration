"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
/**
 * Authentication middleware for KRA eTims SDK
 * Validates authentication for API requests
 */
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Middleware to check if request is authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireAuth = (req, res, next) => {
    try {
        // Check for authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errors_1.AuthenticationError('Authentication required');
        }
        // Extract token
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new errors_1.AuthenticationError('Invalid authentication token');
        }
        // Add token to request
        req.token = token;
        // Continue to next middleware
        next();
    }
    catch (error) {
        logger_1.default.error('Authentication middleware error:', error);
        next(error);
    }
};
exports.requireAuth = requireAuth;
