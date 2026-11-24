/**
 * Validation utilities for KRA eTims SDK
 * Provides schemas and validation functions for API requests
 */
import Joi from 'joi';
import { ValidationError } from './errors';

// ---------------------------------------------------------------------------
// Request types
// ---------------------------------------------------------------------------

export interface AuthRequest {
  username: string;
  password: string;
}

export interface InitializationRequest {
  tin: string;
  bhfId: string;
  dvcSrlNo: string;
}

/** Shared by code list, item class list, notice, taxpayer, customer and move list */
export interface ListRequest {
  tin: string;
  bhfId: string;
  lastReqDt: string;
}

export interface BhfListRequest {
  lastReqDt: string;
}

export interface SalesTrnsItem {
  itemCd: string;
  itemNm: string;
  qty: number;
  prc: number;
  splyAmt: number;
  dcRt?: number;
  dcAmt?: number;
  taxTyCd: string;
  taxAmt: number;
}

export interface SalesTrnsRequest {
  tin: string;
  bhfId: string;
  invcNo: string;
  salesTrnsItems: SalesTrnsItem[];
}

export interface SelectSalesTrnsRequest extends ListRequest {
  invcNo?: string;
}

export interface StockMasterRequest {
  tin: string;
  bhfId: string;
  itemCd: string;
  itemClsCd: string;
  itemNm: string;
  pkgUnitCd: string;
  qtyUnitCd: string;
  splyAmt: number;
  vatTyCd: string;
}

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

export const schemas = {
  // Common fields
  tin: Joi.string().required().description('Taxpayer Identification Number'),
  bhfId: Joi.string().required().description('Branch ID'),
  lastReqDt: Joi.string().required().description('Last Request Date in format YYYYMMDDHHMMSS'),
  dvcSrlNo: Joi.string().required().description('Device Serial Number'),

  // Authentication
  auth: Joi.object<AuthRequest>({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),

  // Initialization
  initialization: Joi.object<InitializationRequest>({
    tin: Joi.string().required(),
    bhfId: Joi.string().required(),
    dvcSrlNo: Joi.string().required()
  }),

  // Basic Data
  codeList: Joi.object<ListRequest>({
    tin: Joi.string().required(),
    bhfId: Joi.string().required(),
    lastReqDt: Joi.string().required()
  }),

  itemClsList: Joi.object<ListRequest>({
    tin: Joi.string().required(),
    bhfId: Joi.string().required(),
    lastReqDt: Joi.string().required()
  }),

  bhfList: Joi.object<BhfListRequest>({
    lastReqDt: Joi.string().required()
  }),

  noticeList: Joi.object<ListRequest>({
    tin: Joi.string().required(),
    bhfId: Joi.string().required(),
    lastReqDt: Joi.string().required()
  }),

  taxpayerInfo: Joi.object<ListRequest>({
    tin: Joi.string().required(),
    bhfId: Joi.string().required(),
    lastReqDt: Joi.string().required()
  }),

  customerList: Joi.object<ListRequest>({
    tin: Joi.string().required(),
    bhfId: Joi.string().required(),
    lastReqDt: Joi.string().required()
  }),

  // Sales Management
  salesTrns: Joi.object<SalesTrnsRequest>({
    tin: Joi.string().required(),
    bhfId: Joi.string().required(),
    invcNo: Joi.string().required().description('Invoice Number'),
    salesTrnsItems: Joi.array()
      .items(
        Joi.object<SalesTrnsItem>({
          itemCd: Joi.string().required().description('Item Code'),
          itemNm: Joi.string().required().description('Item Name'),
          qty: Joi.number().required().description('Quantity'),
          prc: Joi.number().required().description('Price'),
          splyAmt: Joi.number().required().description('Supply Amount'),
          dcRt: Joi.number().description('Discount Rate'),
          dcAmt: Joi.number().description('Discount Amount'),
          taxTyCd: Joi.string().required().description('Tax Type Code'),
          taxAmt: Joi.number().required().description('Tax Amount')
        })
      )
      .required()
  }),

  selectSalesTrns: Joi.object<SelectSalesTrnsRequest>({
    tin: Joi.string().required(),
    bhfId: Joi.string().required(),
    lastReqDt: Joi.string().required(),
    invcNo: Joi.string().description('Invoice Number')
  }),

  // Stock Management
  moveList: Joi.object<ListRequest>({
    tin: Joi.string().required(),
    bhfId: Joi.string().required(),
    lastReqDt: Joi.string().required()
  }),

  stockMaster: Joi.object<StockMasterRequest>({
    tin: Joi.string().required(),
    bhfId: Joi.string().required(),
    itemCd: Joi.string().required(),
    itemClsCd: Joi.string().required(),
    itemNm: Joi.string().required(),
    pkgUnitCd: Joi.string().required(),
    qtyUnitCd: Joi.string().required(),
    splyAmt: Joi.number().required(),
    vatTyCd: Joi.string().required()
  })
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export interface FieldError {
  field: string;
  message: string;
}

/**
 * Validate data against schema
 * @throws {ValidationError} If validation fails
 */
export const validate = <T>(data: unknown, schema: Joi.ObjectSchema<T>): T => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors: FieldError[] = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    throw new ValidationError('Validation failed', errors);
  }

  return value as T;
};