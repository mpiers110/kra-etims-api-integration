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
/**
 * API Service for KRA eTims SDK
 * Handles all HTTP requests to the KRA eTims API
 */
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../utils/logger"));
class ApiService {
    constructor() {
        this.token = null;
        this.tokenExpiry = null;
        this.baseURL = config_1.config.apiBaseUrl;
        this.username = config_1.config.apiUsername;
        this.password = config_1.config.apiPassword;
        this.client = axios_1.default.create({
            baseURL: this.baseURL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        this.client.interceptors.request.use((requestConfig) => __awaiter(this, void 0, void 0, function* () {
            if (requestConfig.url === config_1.config.endpoints.auth.generateToken) {
                return requestConfig;
            }
            if (!this.isTokenValid()) {
                yield this.authenticate();
            }
            if (this.token) {
                requestConfig.headers.set('Authorization', `Bearer ${this.token}`);
            }
            return requestConfig;
        }), (error) => {
            logger_1.default.error('Request error:', error);
            return Promise.reject(error);
        });
    }
    isTokenValid() {
        if (!this.token || !this.tokenExpiry) {
            return false;
        }
        return Date.now() < this.tokenExpiry.getTime() - 5 * 60 * 1000;
    }
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                logger_1.default.info('Authenticating with KRA eTims API');
                if (!this.username || !this.password) {
                    throw new errors_1.AuthenticationError('API credentials are not configured');
                }
                const response = yield this.client.post(config_1.config.endpoints.auth.generateToken, null, {
                    auth: {
                        username: this.username,
                        password: this.password
                    },
                    params: {
                        grant_type: 'client_credentials'
                    }
                });
                const accessToken = (_a = response.data) === null || _a === void 0 ? void 0 : _a.access_token;
                if (!accessToken) {
                    throw new errors_1.AuthenticationError('Invalid authentication response');
                }
                this.token = accessToken;
                const expiresIn = response.data.expires_in || 3600;
                this.tokenExpiry = new Date(Date.now() + expiresIn * 1000);
                logger_1.default.info('Successfully authenticated with KRA eTims API');
                return accessToken;
            }
            catch (error) {
                logger_1.default.error('Authentication error:', error);
                throw new errors_1.AuthenticationError('Failed to authenticate with KRA eTims API');
            }
        });
    }
    request(method_1, endpoint_1) {
        return __awaiter(this, arguments, void 0, function* (method, endpoint, data = null, headers = {}, params) {
            try {
                logger_1.default.debug(`Making ${method} request to ${endpoint}`);
                const requestConfig = {
                    method,
                    url: endpoint,
                    data,
                    headers
                };
                if (params) {
                    requestConfig.params = params;
                }
                const response = yield this.client.request(requestConfig);
                return (0, errors_1.handleApiResponse)(response);
            }
            catch (error) {
                logger_1.default.error('API request error:', error);
                if (axios_1.default.isAxiosError(error) && error.response) {
                    logger_1.default.error(`API response error: ${JSON.stringify(error.response.data)}`);
                    return (0, errors_1.handleApiResponse)(error.response);
                }
                throw error;
            }
        });
    }
    get(endpoint_1) {
        return __awaiter(this, arguments, void 0, function* (endpoint, params = {}, headers = {}) {
            return this.request('GET', endpoint, null, headers, params);
        });
    }
    post(endpoint_1) {
        return __awaiter(this, arguments, void 0, function* (endpoint, data = {}, headers = {}) {
            return this.request('POST', endpoint, data, headers);
        });
    }
}
const apiService = new ApiService();
module.exports = apiService;
