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
exports.selectSalesTrns = exports.sendSalesTrns = void 0;
/**
 * Sales Service for KRA eTims SDK
 * Handles sales operations with the KRA eTims API
 */
const config_1 = require("../config");
const logger_1 = __importDefault(require("../utils/logger"));
const validation_1 = require("../utils/validation");
const api_service_1 = __importDefault(require("./api.service"));
const sendSalesTrns = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info('Sending sales transaction information');
        const validatedData = (0, validation_1.validate)(data, validation_1.schemas.salesTrns);
        const response = yield api_service_1.default.post(config_1.config.endpoints.salesManagement.sendSalesTrns, validatedData, { tin: validatedData.tin, bhfId: validatedData.bhfId, cmcKey: data.cmcKey });
        return { success: true, data: response };
    }
    catch (error) {
        logger_1.default.error('Send sales transaction error:', error);
        throw error;
    }
});
exports.sendSalesTrns = sendSalesTrns;
const selectSalesTrns = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info('Getting sales transaction information');
        const validatedData = (0, validation_1.validate)(data, validation_1.schemas.selectSalesTrns);
        const response = yield api_service_1.default.post(config_1.config.endpoints.salesManagement.selectSalesTrns, validatedData, { tin: validatedData.tin, bhfId: validatedData.bhfId, cmcKey: data.cmcKey });
        return { success: true, data: response };
    }
    catch (error) {
        logger_1.default.error('Get sales transaction error:', error);
        throw error;
    }
});
exports.selectSalesTrns = selectSalesTrns;
