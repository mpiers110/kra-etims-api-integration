/**
 * Sales Service for KRA eTims SDK
 * Handles sales operations with the KRA eTims API
 */
import { config } from '../config';
import type { KraResponseData } from '../utils/errors';
import logger from '../utils/logger';
import {
  schemas,
  validate,
  type SalesTrnsRequest,
  type SelectSalesTrnsRequest
} from '../utils/validation';
import type { ServiceSuccess, WithCmcKey } from '../utils/types';
import apiService from './api.service';

export const sendSalesTrns = async (
  data: WithCmcKey<SalesTrnsRequest>
): Promise<ServiceSuccess<KraResponseData>> => {
  try {
    logger.info('Sending sales transaction information');
    const validatedData = validate(data, schemas.salesTrns);
    const response = await apiService.post(
      config.endpoints.salesManagement.sendSalesTrns,
      validatedData,
      { tin: validatedData.tin, bhfId: validatedData.bhfId, cmcKey: data.cmcKey }
    );
    return { success: true, data: response };
  } catch (error: unknown) {
    logger.error('Send sales transaction error:', error);
    throw error;
  }
};

export const selectSalesTrns = async (
  data: WithCmcKey<SelectSalesTrnsRequest>
): Promise<ServiceSuccess<KraResponseData>> => {
  try {
    logger.info('Getting sales transaction information');
    const validatedData = validate(data, schemas.selectSalesTrns);
    const response = await apiService.post(
      config.endpoints.salesManagement.selectSalesTrns,
      validatedData,
      { tin: validatedData.tin, bhfId: validatedData.bhfId, cmcKey: data.cmcKey }
    );
    return { success: true, data: response };
  } catch (error: unknown) {
    logger.error('Get sales transaction error:', error);
    throw error;
  }
};
