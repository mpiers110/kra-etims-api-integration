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
exports.authenticate = authenticate;
exports.initializeOsdc = initializeOsdc;
exports.getCodeList = getCodeList;
exports.sendSalesTrns = sendSalesTrns;
exports.runExamples = runExamples;
/**
 * Basic usage example for KRA eTims SDK
 * Demonstrates how to use the SDK for common operations
 */
require("dotenv/config");
const src_1 = __importDefault(require("../src"));
// Initialize the SDK
const sdk = new src_1.default();
const getErrorMessage = (error) => error instanceof Error ? error.message : String(error);
const requireEnv = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};
// Example functions
function authenticate() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Authenticating with KRA eTims API...');
            const credentials = {
                username: requireEnv('API_USERNAME'),
                password: requireEnv('API_PASSWORD')
            };
            const result = (yield sdk.auth.getToken(credentials));
            console.log('Authentication successful:', result);
            return result.data.access_token;
        }
        catch (error) {
            console.error('Authentication failed:', getErrorMessage(error));
            throw error;
        }
    });
}
function initializeOsdc() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Initializing OSDC Info...');
            const request = {
                tin: 'P000000045R',
                bhfId: '00',
                dvcSrlNo: 'MOVA22'
            };
            const result = yield sdk.initialization.selectInitOsdcInfo(request);
            console.log('Initialization successful:', result);
            return result;
        }
        catch (error) {
            console.error('Initialization failed:', getErrorMessage(error));
            throw error;
        }
    });
}
function getCodeList() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Getting code list...');
            const request = {
                tin: 'P000000045R',
                bhfId: '00',
                lastReqDt: '20220101010101'
            };
            const result = yield sdk.basicData.selectCodeList(request);
            console.log('Code list retrieved:', result);
            return result;
        }
        catch (error) {
            console.error('Failed to retrieve code list:', getErrorMessage(error));
            throw error;
        }
    });
}
function sendSalesTrns() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Sending sales transaction...');
            const request = {
                tin: 'P000000045R',
                bhfId: '00',
                invcNo: 'INV001',
                salesTrnsItems: [
                    {
                        itemCd: 'ITEM001',
                        itemNm: 'Test Item',
                        qty: 1,
                        prc: 100,
                        splyAmt: 100,
                        taxTyCd: 'V',
                        taxAmt: 16
                    }
                ]
            };
            const result = yield sdk.sales.sendSalesTrns(request);
            console.log('Sales transaction sent:', result);
            return result;
        }
        catch (error) {
            console.error('Failed to send sales transaction:', getErrorMessage(error));
            throw error;
        }
    });
}
// Run the examples
function runExamples() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // auth
            yield authenticate();
            // Then run other examples
            yield initializeOsdc();
            yield getCodeList();
            yield sendSalesTrns();
            console.log('All examples completed successfully');
        }
        catch (error) {
            console.error('Example execution failed:', getErrorMessage(error));
            process.exitCode = 1;
        }
    });
}
// Run the examples if this file is executed directly
if (require.main === module) {
    void runExamples();
}
