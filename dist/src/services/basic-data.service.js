"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectCustomerList = exports.selectTaxpayerInfo = exports.selectNoticeList = exports.selectBhfList = exports.selectItemClsList = exports.selectCodeList = void 0;
/**
 * Basic Data Service for KRA eTims SDK
 * Handles basic data operations with the KRA eTims API
 */
const config_1 = require("../config");
const logger_1 = __importDefault(require("../utils/logger"));
const validation_1 = require("../utils/validation");
const api_service_1 = __importDefault(require("./api.service"));
const selectCodeList = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info('Getting code list');
        const validatedData = (0, validation_1.validate)(data, validation_1.schemas.codeList);
        const response = yield api_service_1.default.post(config_1.config.endpoints.basicData.selectCodeList, validatedData, { tin: validatedData.tin, bhfId: validatedData.bhfId, cmcKey: data.cmcKey });
        return { success: true, data: response };
    }
    catch (error) {
        logger_1.default.error('Get code list error:', error);
        throw error;
    }
});
exports.selectCodeList = selectCodeList;
const selectItemClsList = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info('Getting item classification list');
        const validatedData = (0, validation_1.validate)(data, validation_1.schemas.itemClsList);
        const response = yield api_service_1.default.post(config_1.config.endpoints.basicData.selectItemClsList, validatedData, { tin: validatedData.tin, bhfId: validatedData.bhfId, cmcKey: data.cmcKey });
        return { success: true, data: response };
    }
    catch (error) {
        logger_1.default.error('Get item classification list error:', error);
        throw error;
    }
});
exports.selectItemClsList = selectItemClsList;
const selectBhfList = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info('Getting branch list');
        const validatedData = (0, validation_1.validate)(data, validation_1.schemas.bhfList);
        const response = yield api_service_1.default.post(config_1.config.endpoints.basicData.selectBhfList, validatedData);
        return { success: true, data: response };
    }
    catch (error) {
        logger_1.default.error('Get branch list error:', error);
        throw error;
    }
});
exports.selectBhfList = selectBhfList;
const selectNoticeList = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info('Getting notice list');
        const validatedData = (0, validation_1.validate)(data, validation_1.schemas.noticeList);
        const response = yield api_service_1.default.post(config_1.config.endpoints.basicData.selectNoticeList, validatedData, { tin: validatedData.tin, bhfId: validatedData.bhfId, cmcKey: data.cmcKey });
        return { success: true, data: response };
    }
    catch (error) {
        logger_1.default.error('Get notice list error:', error);
        throw error;
    }
});
exports.selectNoticeList = selectNoticeList;
const selectTaxpayerInfo = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info('Getting taxpayer info');
        const validatedData = (0, validation_1.validate)(data, validation_1.schemas.taxpayerInfo);
        const response = yield api_service_1.default.post(config_1.config.endpoints.basicData.selectTaxpayerInfo, validatedData, { tin: validatedData.tin, bhfId: validatedData.bhfId, cmcKey: data.cmcKey });
        return { success: true, data: response };
    }
    catch (error) {
        logger_1.default.error('Get taxpayer info error:', error);
        throw error;
    }
});
exports.selectTaxpayerInfo = selectTaxpayerInfo;
const selectCustomerList = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info('Getting customer list');
        const validatedData = (0, validation_1.validate)(data, validation_1.schemas.customerList);
        const response = yield api_service_1.default.post(config_1.config.endpoints.basicData.selectCustomerList, validatedData, { tin: validatedData.tin, bhfId: validatedData.bhfId, cmcKey: data.cmcKey });
        return { success: true, data: response };
    }
    catch (error) {
        logger_1.default.error('Get customer list error:', error);
        throw error;
    }
});
exports.selectCustomerList = selectCustomerList;
