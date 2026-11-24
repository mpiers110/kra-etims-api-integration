/**
 * Basic Data Service for KRA eTims SDK
 * Handles basic data operations with the KRA eTims API
 */
import { config } from '../config';
import type { KraResponseData } from '../utils/errors';
import logger from '../utils/logger';
import {
  schemas,
  validate,
  type BhfListRequest,
  type ListRequest
} from '../utils/validation';
import type { ServiceSuccess, WithCmcKey } from '../utils/types';
import apiService from './api.service';

type ListResult = ServiceSuccess<KraResponseData>;

export const selectCodeList = async (
  data: WithCmcKey<ListRequest>
): Promise<ListResult> => {
  try {
    logger.info('Getting code list');
    const validatedData = validate(data, schemas.codeList);
    const response = await apiService.post(
      config.endpoints.basicData.selectCodeList,
      validatedData,
      { tin: validatedData.tin, bhfId: validatedData.bhfId, cmcKey: data.cmcKey }
    );
    return { success: true, data: response };
  } catch (error: unknown) {
    logger.error('Get code list error:', error);
    throw error;
  }
};

export const selectItemClsList = async (
  data: WithCmcKey<ListRequest>
): Promise<ListResult> => {
  try {
    logger.info('Getting item classification list');
    const validatedData = validate(data, schemas.itemClsList);
    const response = await apiService.post(
      config.endpoints.basicData.selectItemClsList,
      validatedData,
      { tin: validatedData.tin, bhfId: validatedData.bhfId, cmcKey: data.cmcKey }
    );
    return { success: true, data: response };
  } catch (error: unknown) {
    logger.error('Get item classification list error:', error);
    throw error;
  }
};

export const selectBhfList = async (data: BhfListRequest): Promise<ListResult> => {
  try {
    logger.info('Getting branch list');
    const validatedData = validate(data, schemas.bhfList);
    const response = await apiService.post(
      config.endpoints.basicData.selectBhfList,
      validatedData
    );
    return { success: true, data: response };
  } catch (error: unknown) {
    logger.error('Get branch list error:', error);
    throw error;
  }
};

export const selectNoticeList = async (
  data: WithCmcKey<ListRequest>
): Promise<ListResult> => {
  try {
    logger.info('Getting notice list');
    const validatedData = validate(data, schemas.noticeList);
    const response = await apiService.post(
      config.endpoints.basicData.selectNoticeList,
      validatedData,
      { tin: validatedData.tin, bhfId: validatedData.bhfId, cmcKey: data.cmcKey }
    );
    return { success: true, data: response };
  } catch (error: unknown) {
    logger.error('Get notice list error:', error);
    throw error;
  }
};

export const selectTaxpayerInfo = async (
  data: WithCmcKey<ListRequest>
): Promise<ListResult> => {
  try {
    logger.info('Getting taxpayer info');
    const validatedData = validate(data, schemas.taxpayerInfo);
    const response = await apiService.post(
      config.endpoints.basicData.selectTaxpayerInfo,
      validatedData,
      { tin: validatedData.tin, bhfId: validatedData.bhfId, cmcKey: data.cmcKey }
    );
    return { success: true, data: response };
  } catch (error: unknown) {
    logger.error('Get taxpayer info error:', error);
    throw error;
  }
};

export const selectCustomerList = async (
  data: WithCmcKey<ListRequest>
): Promise<ListResult> => {
  try {
    logger.info('Getting customer list');
    const validatedData = validate(data, schemas.customerList);
    const response = await apiService.post(
      config.endpoints.basicData.selectCustomerList,
      validatedData,
      { tin: validatedData.tin, bhfId: validatedData.bhfId, cmcKey: data.cmcKey }
    );
    return { success: true, data: response };
  } catch (error: unknown) {
    logger.error('Get customer list error:', error);
    throw error;
  }
};
