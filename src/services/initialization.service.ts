/**
 * Initialization Service for KRA eTims SDK
 * Handles initialization operations with the KRA eTims API
 */
import { config } from '../config';
import type { KraResponseData } from '../utils/errors';
import logger from '../utils/logger';
import { schemas, validate, type InitializationRequest } from '../utils/validation';
import type { ServiceSuccess } from '../utils/types';
import apiService from './api.service';

export const selectInitOsdcInfo = async (
  data: InitializationRequest
): Promise<ServiceSuccess<KraResponseData>> => {
  try {
    logger.info('Initializing OSDC Info');
    const validatedData = validate(data, schemas.initialization);
    const response = await apiService.post(
      config.endpoints.initialization.selectInitOsdcInfo,
      validatedData
    );
    return { success: true, data: response };
  } catch (error: unknown) {
    logger.error('Initialization error:', error);
    throw error;
  }
};
