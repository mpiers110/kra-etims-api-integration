const mockRequestInterceptorUse = jest.fn();
const mockClient = {
  post: jest.fn(),
  request: jest.fn(),
  interceptors: {
    request: {
      use: mockRequestInterceptorUse
    }
  }
};

jest.mock('axios', () => ({
  create: jest.fn(() => mockClient),
  isAxiosError: jest.fn((error) => Boolean(error && error.isAxiosError))
}));

jest.mock('../dist/src/utils/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  }
}));

const axios = require('axios');
const apiService = require('../dist/src/services/api.service');
const { config } = require('../dist/src/config');
const { ApiError, AuthenticationError } = require('../dist/src/utils/errors');
const onRequest = mockRequestInterceptorUse.mock.calls[0][0];

describe('API service edge cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    apiService.username = 'test-user';
    apiService.password = 'test-password';
    apiService.token = null;
    apiService.tokenExpiry = null;
    axios.isAxiosError.mockImplementation((error) => Boolean(error && error.isAxiosError));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('rejects authentication when credentials are not configured', async () => {
    apiService.username = undefined;
    apiService.password = undefined;

    await expect(apiService.authenticate()).rejects.toBeInstanceOf(AuthenticationError);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  test('rejects an authentication response without an access token', async () => {
    mockClient.post.mockResolvedValue({ data: { expires_in: 3600 } });

    await expect(apiService.authenticate()).rejects.toBeInstanceOf(AuthenticationError);
  });

  test('converts an Axios API error response into an ApiError', async () => {
    mockClient.request.mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 403,
        data: { resultCd: 'E403', resultMsg: 'Forbidden' }
      }
    });

    await expect(apiService.request('POST', '/protected')).rejects.toMatchObject({
      name: 'ApiError',
      message: 'Forbidden',
      statusCode: 403,
      errorCode: 'E403'
    });
    expect(axios.isAxiosError).toHaveBeenCalled();
  });

  test('uses the existing token in the request interceptor', async () => {
    apiService.token = 'valid-token';
    apiService.tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    const headers = { set: jest.fn() };
    const requestConfig = { url: '/protected', headers };
    const authenticate = jest.spyOn(apiService, 'authenticate');

    await expect(onRequest(requestConfig)).resolves.toBe(requestConfig);

    expect(authenticate).not.toHaveBeenCalled();
    expect(headers.set).toHaveBeenCalledWith('Authorization', 'Bearer valid-token');
  });

  test('does not authenticate the token endpoint through the request interceptor', async () => {
    const requestConfig = {
      url: config.endpoints.auth.generateToken,
      headers: { set: jest.fn() }
    };
    const authenticate = jest.spyOn(apiService, 'authenticate');

    await expect(onRequest(requestConfig)).resolves.toBe(requestConfig);

    expect(authenticate).not.toHaveBeenCalled();
    expect(requestConfig.headers.set).not.toHaveBeenCalled();
  });
});
