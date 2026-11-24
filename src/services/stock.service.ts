/**
 * Stock Service for KRA eTims SDK
 * Handles stock operations with the KRA eTims API
 */
import { config } from '../config';
import type { KraResponseData } from '../utils/errors';
import logger from '../utils/logger';
import {
  schemas,
  validate,
  type ListRequest,
  type StockMasterRequest
} from '../utils/validation';
import type { ServiceSuccess, WithCmcKey } from '../utils/types';
import apiService from './api.service';

export const selectMoveList = async (
  data: WithCmcKey<ListRequest>
): Promise<ServiceSuccess<KraResponseData>> => {
  try {
    logger.info('Getting move list');
    const validatedData = validate(data, schemas.moveList);
    const response = await apiService.post(
      config.endpoints.stockManagement.selectMoveList,
      validatedData,
      { tin: validatedData.tin, bhfId: validatedData.bhfId, cmcKey: data.cmcKey }
    );
    return { success: true, data: response };
  } catch (error: unknown) {
    logger.error('Get move list error:', error);
    throw error;
  }
};

export const saveStockMaster = async (
  data: WithCmcKey<StockMasterRequest>
): Promise<ServiceSuccess<KraResponseData>> => {
  try {
    logger.info('Saving stock master');
    const validatedData = validate(data, schemas.stockMaster);
    const response = await apiService.post(
      config.endpoints.stockManagement.saveStockMaster,
      validatedData,
      { tin: validatedData.tin, bhfId: validatedData.bhfId, cmcKey: data.cmcKey }
    );
    return { success: true, data: response };
  } catch (error: unknown) {
    logger.error('Save stock master error:', error);
    throw error;
  }
};
