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
exports.getToken = void 0;
/**
 * Authentication Service for KRA eTims SDK
 * Handles authentication with the KRA eTims API
 */
const logger_1 = __importDefault(require("../utils/logger"));
const validation_1 = require("../utils/validation");
const api_service_1 = __importDefault(require("./api.service"));
const getToken = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = (0, validation_1.validate)(credentials, validation_1.schemas.auth);
        api_service_1.default.username = validatedData.username;
        api_service_1.default.password = validatedData.password;
        const token = yield api_service_1.default.authenticate();
        return {
            success: true,
            data: {
                access_token: token,
                expires_at: api_service_1.default.tokenExpiry
            }
        };
    }
    catch (error) {
        logger_1.default.error('Authentication error:', error);
        throw error;
    }
});
exports.getToken = getToken;
