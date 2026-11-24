/**
 * Purchase Service for KRA eTims SDK
 * Handles purchase operations with the KRA eTims API
 */
import { config } from '../config';
import type { KraResponseData } from '../utils/errors';
import logger from '../utils/logger';
import { schemas, validate, type ListRequest } from '../utils/validation';
import type { ServiceSuccess, WithCmcKey } from '../utils/types';
import apiService from './api.service';

export const selectPurchaseTrns = async (
  data: WithCmcKey<ListRequest>
): Promise<ServiceSuccess<KraResponseData>> => {
  try {
    logger.info('Getting purchase transaction information');
    const validatedData = validate(data, schemas.taxpayerInfo);
    const response = await apiService.post(
      config.endpoints.purchaseManagement.selectPurchaseTrns,
      validatedData,
      { tin: validatedData.tin, bhfId: validatedData.bhfId, cmcKey: data.cmcKey }
    );
    return { success: true, data: response };
  } catch (error: unknown) {
    logger.error('Get purchase transaction error:', error);
    throw error;
  }
};
