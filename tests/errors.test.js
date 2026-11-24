const {
  ApiError,
  AuthenticationError,
  ValidationError,
  formatError,
  handleApiResponse
} = require('../dist/src/utils/errors');

jest.mock('../dist/src/utils/logger', () => ({
  __esModule: true,
  default: {
    error: jest.fn()
  }
}));

describe('API response and error formatting', () => {
  test('returns a successful API response body', () => {
    const body = { resultCd: '0000', resultMsg: 'Success', count: 2 };

    expect(handleApiResponse({ status: 200, data: body })).toBe(body);
  });

  test('converts a KRA error response into an ApiError', () => {
    expect(() =>
      handleApiResponse({
        status: 422,
        data: { resultCd: 'E100', resultMsg: 'Invalid request' }
      })
    ).toThrow(
      expect.objectContaining({
        name: 'ApiError',
        message: 'Invalid request',
        statusCode: 422,
        errorCode: 'E100'
      })
    );
  });

  test('rejects a missing API response body', () => {
    expect(() => handleApiResponse({ status: 200 })).toThrow(
      expect.objectContaining({ name: 'ApiError', statusCode: 500 })
    );
  });

  test('formats validation errors with their field details', () => {
    const formatted = formatError(
      new ValidationError('Validation failed', [{ field: 'tin', message: 'is required' }])
    );

    expect(formatted).toEqual({
      success: false,
      error: {
        message: 'Validation failed',
        validationErrors: [{ field: 'tin', message: 'is required' }]
      },
      statusCode: 400
    });
  });

  test('formats authentication errors with status 401', () => {
    expect(formatError(new AuthenticationError('Authentication required'))).toEqual({
      success: false,
      error: { message: 'Authentication required' },
      statusCode: 401
    });
  });

  test('formats API errors with status, code, and details', () => {
    expect(formatError(new ApiError('Rejected', 409, 'E409', { id: 'item-1' }))).toEqual({
      success: false,
      error: {
        message: 'Rejected',
        code: 'E409',
        details: { id: 'item-1' }
      },
      statusCode: 409
    });
  });
});
