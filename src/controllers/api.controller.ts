/**
 * API Controller for KRA eTims SDK
 * Handles business logic for API endpoints
 */
import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import * as initializationService from '../services/initialization.service';
import * as basicDataService from '../services/basic-data.service';
import * as salesService from '../services/sales.service';
import * as stockService from '../services/stock.service';
import * as purchaseService from '../services/purchase.service';
import logger from '../utils/logger';

type ControllerHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Authentication controller
 */
export const authController = {
  /** Get authentication token */
  getToken: (async (req, res, next) => {
    try {
      logger.info('Getting authentication token');
      const result = await authService.getToken(req.body);
      res.json(result);
    } catch (error) {
      logger.error('[authController.getToken]', error);
      next(error);
    }
  }) as ControllerHandler
};

/**
 * Initialization controller
 */
export const initializationController = {
  /** Initialize OSDC Info */
  selectInitOsdcInfo: (async (req, res, next) => {
    try {
      logger.info('Initializing OSDC Info');
      const result = await initializationService.selectInitOsdcInfo(req.body);
      res.json(result);
    } catch (error) {
      logger.error('[initializationController.selectInitOsdcInfo]', error);
      next(error);
    }
  }) as ControllerHandler
};

/**
 * Basic Data controller
 */
export const basicDataController = {
  /** Get code list */
  selectCodeList: (async (req, res, next) => {
    try {
      logger.info('Getting code list');
      const result = await basicDataService.selectCodeList(req.body);
      res.json(result);
    } catch (error) {
      logger.error('[basicDataController.selectCodeList]', error);
      next(error);
    }
  }) as ControllerHandler,

  /** Get item classification list */
  selectItemClsList: (async (req, res, next) => {
    try {
      logger.info('Getting item classification list');
      const result = await basicDataService.selectItemClsList(req.body);
      res.json(result);
    } catch (error) {
      logger.error('[basicDataController.selectItemClsList]', error);
      next(error);
    }
  }) as ControllerHandler,

  /** Get branch list */
  selectBhfList: (async (req, res, next) => {
    try {
      logger.info('Getting branch list');
      const result = await basicDataService.selectBhfList(req.body);
      res.json(result);
    } catch (error) {
      logger.error('[basicDataController.selectBhfList]', error);
      next(error);
    }
  }) as ControllerHandler,

  /** Get notice list */
  selectNoticeList: (async (req, res, next) => {
    try {
      logger.info('Getting notice list');
      const result = await basicDataService.selectNoticeList(req.body);
      res.json(result);
    } catch (error) {
      logger.error('[basicDataController.selectNoticeList]', error);
      next(error);
    }
  }) as ControllerHandler,

  /** Get taxpayer info */
  selectTaxpayerInfo: (async (req, res, next) => {
    try {
      logger.info('Getting taxpayer info');
      const result = await basicDataService.selectTaxpayerInfo(req.body);
      res.json(result);
    } catch (error) {
      logger.error('[basicDataController.selectTaxpayerInfo]', error);
      next(error);
    }
  }) as ControllerHandler,

  /** Get customer list */
  selectCustomerList: (async (req, res, next) => {
    try {
      logger.info('Getting customer list');
      const result = await basicDataService.selectCustomerList(req.body);
      res.json(result);
    } catch (error) {
      logger.error('[basicDataController.selectCustomerList]', error);
      next(error);
    }
  }) as ControllerHandler
};

/**
 * Sales controller
 */
export const salesController = {
  /** Send sales transaction */
  sendSalesTrns: (async (req, res, next) => {
    try {
      logger.info('Sending sales transaction');
      const result = await salesService.sendSalesTrns(req.body);
      res.json(result);
    } catch (error) {
      logger.error('[salesController.sendSalesTrns]', error);
      next(error);
    }
  }) as ControllerHandler,

  /** Get sales transaction */
  selectSalesTrns: (async (req, res, next) => {
    try {
      logger.info('Getting sales transaction');
      const result = await salesService.selectSalesTrns(req.body);
      res.json(result);
    } catch (error) {
      logger.error('[salesController.selectSalesTrns]', error);
      next(error);
    }
  }) as ControllerHandler
};

/**
 * Stock controller
 */
export const stockController = {
  /** Get move list */
  selectMoveList: (async (req, res, next) => {
    try {
      logger.info('Getting move list');
      const result = await stockService.selectMoveList(req.body);
      res.json(result);
    } catch (error) {
      logger.error('[stockController.selectMoveList]', error);
      next(error);
    }
  }) as ControllerHandler,

  /** Save stock master */
  saveStockMaster: (async (req, res, next) => {
    try {
      logger.info('Saving stock master');
      const result = await stockService.saveStockMaster(req.body);
      res.json(result);
    } catch (error) {
      logger.error('[stockController.saveStockMaster]', error);
      next(error);
    }
  }) as ControllerHandler
};

/**
 * Purchase controller
 */
export const purchaseController = {
  /** Get purchase transaction */
  selectPurchaseTrns: (async (req, res, next) => {
    try {
      logger.info('Getting purchase transaction');
      const result = await purchaseService.selectPurchaseTrns(req.body);
      res.json(result);
    } catch (error) {
      logger.error('[purchaseController.selectPurchaseTrns]', error);
      next(error);
    }
  }) as ControllerHandler
};