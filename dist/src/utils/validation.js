"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.schemas = void 0;
/**
 * Validation utilities for KRA eTims SDK
 * Provides schemas and validation functions for API requests
 */
const joi_1 = __importDefault(require("joi"));
const errors_1 = require("./errors");
// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------
exports.schemas = {
    // Common fields
    tin: joi_1.default.string().required().description('Taxpayer Identification Number'),
    bhfId: joi_1.default.string().required().description('Branch ID'),
    lastReqDt: joi_1.default.string().required().description('Last Request Date in format YYYYMMDDHHMMSS'),
    dvcSrlNo: joi_1.default.string().required().description('Device Serial Number'),
    // Authentication
    auth: joi_1.default.object({
        username: joi_1.default.string().required(),
        password: joi_1.default.string().required()
    }),
    // Initialization
    initialization: joi_1.default.object({
        tin: joi_1.default.string().required(),
        bhfId: joi_1.default.string().required(),
        dvcSrlNo: joi_1.default.string().required()
    }),
    // Basic Data
    codeList: joi_1.default.object({
        tin: joi_1.default.string().required(),
        bhfId: joi_1.default.string().required(),
        lastReqDt: joi_1.default.string().required()
    }),
    itemClsList: joi_1.default.object({
        tin: joi_1.default.string().required(),
        bhfId: joi_1.default.string().required(),
        lastReqDt: joi_1.default.string().required()
    }),
    bhfList: joi_1.default.object({
        lastReqDt: joi_1.default.string().required()
    }),
    noticeList: joi_1.default.object({
        tin: joi_1.default.string().required(),
        bhfId: joi_1.default.string().required(),
        lastReqDt: joi_1.default.string().required()
    }),
    taxpayerInfo: joi_1.default.object({
        tin: joi_1.default.string().required(),
        bhfId: joi_1.default.string().required(),
        lastReqDt: joi_1.default.string().required()
    }),
    customerList: joi_1.default.object({
        tin: joi_1.default.string().required(),
        bhfId: joi_1.default.string().required(),
        lastReqDt: joi_1.default.string().required()
    }),
    // Sales Management
    salesTrns: joi_1.default.object({
        tin: joi_1.default.string().required(),
        bhfId: joi_1.default.string().required(),
        invcNo: joi_1.default.string().required().description('Invoice Number'),
        salesTrnsItems: joi_1.default.array()
            .items(joi_1.default.object({
            itemCd: joi_1.default.string().required().description('Item Code'),
            itemNm: joi_1.default.string().required().description('Item Name'),
            qty: joi_1.default.number().required().description('Quantity'),
            prc: joi_1.default.number().required().description('Price'),
            splyAmt: joi_1.default.number().required().description('Supply Amount'),
            dcRt: joi_1.default.number().description('Discount Rate'),
            dcAmt: joi_1.default.number().description('Discount Amount'),
            taxTyCd: joi_1.default.string().required().description('Tax Type Code'),
            taxAmt: joi_1.default.number().required().description('Tax Amount')
        }))
            .required()
    }),
    selectSalesTrns: joi_1.default.object({
        tin: joi_1.default.string().required(),
        bhfId: joi_1.default.string().required(),
        lastReqDt: joi_1.default.string().required(),
        invcNo: joi_1.default.string().description('Invoice Number')
    }),
    // Stock Management
    moveList: joi_1.default.object({
        tin: joi_1.default.string().required(),
        bhfId: joi_1.default.string().required(),
        lastReqDt: joi_1.default.string().required()
    }),
    stockMaster: joi_1.default.object({
        tin: joi_1.default.string().required(),
        bhfId: joi_1.default.string().required(),
        itemCd: joi_1.default.string().required(),
        itemClsCd: joi_1.default.string().required(),
        itemNm: joi_1.default.string().required(),
        pkgUnitCd: joi_1.default.string().required(),
        qtyUnitCd: joi_1.default.string().required(),
        splyAmt: joi_1.default.number().required(),
        vatTyCd: joi_1.default.string().required()
    })
};
/**
 * Validate data against schema
 * @throws {ValidationError} If validation fails
 */
const validate = (data, schema) => {
    const { error, value } = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true
    });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        throw new errors_1.ValidationError('Validation failed', errors);
    }
    return value;
};
exports.validate = validate;
