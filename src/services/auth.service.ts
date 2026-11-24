/**
 * Authentication Service for KRA eTims SDK
 * Handles authentication with the KRA eTims API
 */
import logger from '../utils/logger';
import { schemas, validate, type AuthRequest } from '../utils/validation';
import apiService from './api.service';

export interface AuthResult {
  success: true;
  data: {
    access_token: string;
    expires_at: Date | null;
  };
}

export const getToken = async (credentials: AuthRequest): Promise<AuthResult> => {
  try {
    const validatedData = validate(credentials, schemas.auth);

    apiService.username = validatedData.username;
    apiService.password = validatedData.password;

    const token = await apiService.authenticate();
    return {
      success: true,
      data: {
        access_token: token,
        expires_at: apiService.tokenExpiry
      }
    };
  } catch (error: unknown) {
    logger.error('Authentication error:', error);
    throw error;
  }
};
