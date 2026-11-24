/**
 * API Service for KRA eTims SDK
 * Handles all HTTP requests to the KRA eTims API
 */
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type Method
} from 'axios';
import { config } from '../config';
import { AuthenticationError, handleApiResponse, type KraResponseData } from '../utils/errors';
import logger from '../utils/logger';

interface AuthenticationResponse {
  access_token?: string;
  expires_in?: number;
}

type RequestHeaders = Record<string, string | undefined>;
type QueryParams = Record<string, string | number | boolean>;

class ApiService {
  public readonly baseURL: string;
  public username: string | undefined;
  public password: string | undefined;
  public token: string | null = null;
  public tokenExpiry: Date | null = null;
  public readonly client: AxiosInstance;

  constructor() {
    this.baseURL = config.apiBaseUrl;
    this.username = config.apiUsername;
    this.password = config.apiPassword;

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.client.interceptors.request.use(
      async (requestConfig: InternalAxiosRequestConfig) => {
        if (requestConfig.url === config.endpoints.auth.generateToken) {
          return requestConfig;
        }

        if (!this.isTokenValid()) {
          await this.authenticate();
        }

        if (this.token) {
          requestConfig.headers.set('Authorization', `Bearer ${this.token}`);
        }

        return requestConfig;
      },
      (error: unknown) => {
        logger.error('Request error:', error);
        return Promise.reject(error);
      }
    );
  }

  public isTokenValid(): boolean {
    if (!this.token || !this.tokenExpiry) {
      return false;
    }

    return Date.now() < this.tokenExpiry.getTime() - 5 * 60 * 1000;
  }

  public async authenticate(): Promise<string> {
    try {
      logger.info('Authenticating with KRA eTims API');

      if (!this.username || !this.password) {
        throw new AuthenticationError('API credentials are not configured');
      }

      const response = await this.client.post<AuthenticationResponse>(
        config.endpoints.auth.generateToken,
        null,
        {
          auth: {
            username: this.username,
            password: this.password
          },
          params: {
            grant_type: 'client_credentials'
          }
        }
      );

      const accessToken = response.data?.access_token;
      if (!accessToken) {
        throw new AuthenticationError('Invalid authentication response');
      }

      this.token = accessToken;
      const expiresIn = response.data.expires_in || 3600;
      this.tokenExpiry = new Date(Date.now() + expiresIn * 1000);

      logger.info('Successfully authenticated with KRA eTims API');
      return accessToken;
    } catch (error: unknown) {
      logger.error('Authentication error:', error);
      throw new AuthenticationError('Failed to authenticate with KRA eTims API');
    }
  }

  public async request<T extends KraResponseData = KraResponseData>(
    method: Method,
    endpoint: string,
    data: unknown = null,
    headers: RequestHeaders = {},
    params?: QueryParams
  ): Promise<T> {
    try {
      logger.debug(`Making ${method} request to ${endpoint}`);

      const requestConfig: AxiosRequestConfig = {
        method,
        url: endpoint,
        data,
        headers
      };

      if (params) {
        requestConfig.params = params;
      }

      const response = await this.client.request<T>(requestConfig);
      return handleApiResponse(response);
    } catch (error: unknown) {
      logger.error('API request error:', error);

      if (axios.isAxiosError<T>(error) && error.response) {
        logger.error(`API response error: ${JSON.stringify(error.response.data)}`);
        return handleApiResponse<T>(error.response);
      }

      throw error;
    }
  }

  public async get<T extends KraResponseData = KraResponseData>(
    endpoint: string,
    params: QueryParams = {},
    headers: RequestHeaders = {}
  ): Promise<T> {
    return this.request<T>('GET', endpoint, null, headers, params);
  }

  public async post<T extends KraResponseData = KraResponseData>(
    endpoint: string,
    data: unknown = {},
    headers: RequestHeaders = {}
  ): Promise<T> {
    return this.request<T>('POST', endpoint, data, headers);
  }
}

const apiService = new ApiService();

export = apiService;
