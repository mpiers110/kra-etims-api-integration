/**
 * Authentication middleware for KRA eTims SDK
 * Validates authentication for API requests
 */
import { AuthenticationError } from '../utils/errors';
import { Response, NextFunction } from 'express';
import logger from '../utils/logger';
import {TokenRequest} from '../utils/types';

/**
 * Middleware to check if request is authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const requireAuth = (req: TokenRequest, res: Response, next: NextFunction) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Authentication required');
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new AuthenticationError('Invalid authentication token');
    }
    
    // Add token to request
    req.token = token;
    
    // Continue to next middleware
    next();
  } catch (error) {
    logger.error('Authentication middleware error:', error);
    next(error);
  }
};

