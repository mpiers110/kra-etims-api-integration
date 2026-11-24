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
/**
 * Server usage example for KRA eTims SDK
 * Demonstrates how to use the SDK as an Express server
 */
require("dotenv/config");
const src_1 = __importDefault(require("../src"));
const getErrorMessage = (error) => error instanceof Error ? error.message : String(error);
// Initialize the SDK with server option
const sdk = new src_1.default({ server: true });
// Start the server
const port = Number(process.env.PORT) || 5000;
const endpoints = [
    'POST /api/auth/token - Get authentication token',
    'POST /api/initialization/osdc-info - Initialize OSDC Info',
    'POST /api/basic-data/code-list - Get code list',
    'POST /api/basic-data/item-cls-list - Get item classification list',
    'POST /api/basic-data/bhf-list - Get branch list',
    'POST /api/basic-data/notice-list - Get notice list',
    'POST /api/basic-data/taxpayer-info - Get taxpayer info',
    'POST /api/basic-data/customer-list - Get customer list',
    'POST /api/sales/send - Send sales transaction',
    'POST /api/sales/select - Get sales transaction',
    'POST /api/stock/move-list - Get move list',
    'POST /api/stock/save-master - Save stock master',
    'POST /api/purchase/select - Get purchase transaction',
    'GET /api/health - Health check'
];
sdk
    .start(port)
    .then(() => {
    console.log(`KRA eTims SDK server running on port ${port}`);
    console.log('Available endpoints:');
    endpoints.forEach((endpoint) => console.log(`- ${endpoint}`));
})
    .catch((err) => {
    console.error('Failed to start server:', getErrorMessage(err));
    process.exit(1);
});
// Graceful shutdown
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Shutting down server...');
    try {
        yield sdk.stop();
        console.log('Server stopped');
        process.exit(0);
    }
    catch (error) {
        console.error('Error stopping server:', getErrorMessage(error));
        process.exit(1);
    }
}));
