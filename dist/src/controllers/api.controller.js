"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.purchaseController = exports.stockController = exports.salesController = exports.basicDataController = exports.initializationController = exports.authController = void 0;
const authService = __importStar(require("../services/auth.service"));
const initializationService = __importStar(require("../services/initialization.service"));
const basicDataService = __importStar(require("../services/basic-data.service"));
const salesService = __importStar(require("../services/sales.service"));
const stockService = __importStar(require("../services/stock.service"));
const purchaseService = __importStar(require("../services/purchase.service"));
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Authentication controller
 */
exports.authController = {
    /** Get authentication token */
    getToken: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            logger_1.default.info('Getting authentication token');
            const result = yield authService.getToken(req.body);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error('[authController.getToken]', error);
            next(error);
        }
    }))
};
/**
 * Initialization controller
 */
exports.initializationController = {
    /** Initialize OSDC Info */
    selectInitOsdcInfo: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            logger_1.default.info('Initializing OSDC Info');
            const result = yield initializationService.selectInitOsdcInfo(req.body);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error('[initializationController.selectInitOsdcInfo]', error);
            next(error);
        }
    }))
};
/**
 * Basic Data controller
 */
exports.basicDataController = {
    /** Get code list */
    selectCodeList: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            logger_1.default.info('Getting code list');
            const result = yield basicDataService.selectCodeList(req.body);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error('[basicDataController.selectCodeList]', error);
            next(error);
        }
    })),
    /** Get item classification list */
    selectItemClsList: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            logger_1.default.info('Getting item classification list');
            const result = yield basicDataService.selectItemClsList(req.body);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error('[basicDataController.selectItemClsList]', error);
            next(error);
        }
    })),
    /** Get branch list */
    selectBhfList: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            logger_1.default.info('Getting branch list');
            const result = yield basicDataService.selectBhfList(req.body);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error('[basicDataController.selectBhfList]', error);
            next(error);
        }
    })),
    /** Get notice list */
    selectNoticeList: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            logger_1.default.info('Getting notice list');
            const result = yield basicDataService.selectNoticeList(req.body);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error('[basicDataController.selectNoticeList]', error);
            next(error);
        }
    })),
    /** Get taxpayer info */
    selectTaxpayerInfo: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            logger_1.default.info('Getting taxpayer info');
            const result = yield basicDataService.selectTaxpayerInfo(req.body);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error('[basicDataController.selectTaxpayerInfo]', error);
            next(error);
        }
    })),
    /** Get customer list */
    selectCustomerList: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            logger_1.default.info('Getting customer list');
            const result = yield basicDataService.selectCustomerList(req.body);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error('[basicDataController.selectCustomerList]', error);
            next(error);
        }
    }))
};
/**
 * Sales controller
 */
exports.salesController = {
    /** Send sales transaction */
    sendSalesTrns: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            logger_1.default.info('Sending sales transaction');
            const result = yield salesService.sendSalesTrns(req.body);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error('[salesController.sendSalesTrns]', error);
            next(error);
        }
    })),
    /** Get sales transaction */
    selectSalesTrns: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            logger_1.default.info('Getting sales transaction');
            const result = yield salesService.selectSalesTrns(req.body);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error('[salesController.selectSalesTrns]', error);
            next(error);
        }
    }))
};
/**
 * Stock controller
 */
exports.stockController = {
    /** Get move list */
    selectMoveList: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            logger_1.default.info('Getting move list');
            const result = yield stockService.selectMoveList(req.body);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error('[stockController.selectMoveList]', error);
            next(error);
        }
    })),
    /** Save stock master */
    saveStockMaster: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            logger_1.default.info('Saving stock master');
            const result = yield stockService.saveStockMaster(req.body);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error('[stockController.saveStockMaster]', error);
            next(error);
        }
    }))
};
/**
 * Purchase controller
 */
exports.purchaseController = {
    /** Get purchase transaction */
    selectPurchaseTrns: ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            logger_1.default.info('Getting purchase transaction');
            const result = yield purchaseService.selectPurchaseTrns(req.body);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error('[purchaseController.selectPurchaseTrns]', error);
            next(error);
        }
    }))
};
