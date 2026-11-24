"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * API Routes for KRA eTims SDK
 * Defines routes for the Express server
 */
const express_1 = require("express");
const api_controller_1 = require("../controllers/api.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Health check route
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});
// Auth routes
router.post('/auth/token', api_controller_1.authController.getToken);
// Protected routes (require authentication)
// Initialization routes
router.post('/initialization/osdc-info', auth_middleware_1.requireAuth, api_controller_1.initializationController.selectInitOsdcInfo);
// Basic data routes
router.post('/basic-data/code-list', auth_middleware_1.requireAuth, api_controller_1.basicDataController.selectCodeList);
router.post('/basic-data/item-cls-list', auth_middleware_1.requireAuth, api_controller_1.basicDataController.selectItemClsList);
router.post('/basic-data/bhf-list', auth_middleware_1.requireAuth, api_controller_1.basicDataController.selectBhfList);
router.post('/basic-data/notice-list', auth_middleware_1.requireAuth, api_controller_1.basicDataController.selectNoticeList);
router.post('/basic-data/taxpayer-info', auth_middleware_1.requireAuth, api_controller_1.basicDataController.selectTaxpayerInfo);
router.post('/basic-data/customer-list', auth_middleware_1.requireAuth, api_controller_1.basicDataController.selectCustomerList);
// Sales routes
router.post('/sales/send', auth_middleware_1.requireAuth, api_controller_1.salesController.sendSalesTrns);
router.post('/sales/select', auth_middleware_1.requireAuth, api_controller_1.salesController.selectSalesTrns);
// Stock routes
router.post('/stock/move-list', auth_middleware_1.requireAuth, api_controller_1.stockController.selectMoveList);
router.post('/stock/save-master', auth_middleware_1.requireAuth, api_controller_1.stockController.saveStockMaster);
// Purchase routes
router.post('/purchase/select', auth_middleware_1.requireAuth, api_controller_1.purchaseController.selectPurchaseTrns);
exports.default = router;
