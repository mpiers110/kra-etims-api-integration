const apiService = require('../dist/src/services/api.service');
const { config } = require('../dist/src/config');
const authService = require('../dist/src/services/auth.service');
const basicDataService = require('../dist/src/services/basic-data.service');
const initializationService = require('../dist/src/services/initialization.service');
const purchaseService = require('../dist/src/services/purchase.service');
const salesService = require('../dist/src/services/sales.service');
const stockService = require('../dist/src/services/stock.service');
const { ValidationError } = require('../dist/src/utils/errors');

jest.mock('../dist/src/services/api.service', () => ({
  post: jest.fn(),
  authenticate: jest.fn(),
  username: undefined,
  password: undefined,
  tokenExpiry: null
}));

jest.mock('../dist/src/utils/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  }
}));

const listRequest = {
  tin: 'P000000045R',
  bhfId: '00',
  lastReqDt: '20220101010101',
  cmcKey: 'test-cmc-key'
};

const bhfListRequest = {
  lastReqDt: '20220101010101'
};

const initializationRequest = {
  tin: 'P000000045R',
  bhfId: '00',
  dvcSrlNo: 'MOVA22'
};

const salesRequest = {
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
  ],
  cmcKey: 'test-cmc-key'
};

const stockMasterRequest = {
  tin: 'P000000045R',
  bhfId: '00',
  itemCd: 'ITEM001',
  itemClsCd: 'CLASS001',
  itemNm: 'Test Item',
  pkgUnitCd: 'NT',
  qtyUnitCd: 'U',
  splyAmt: 100,
  vatTyCd: 'V',
  cmcKey: 'test-cmc-key'
};

const serviceCases = [
  [
    'code list',
    basicDataService.selectCodeList,
    listRequest,
    config.endpoints.basicData.selectCodeList,
    { tin: listRequest.tin, bhfId: listRequest.bhfId, lastReqDt: listRequest.lastReqDt },
    { tin: listRequest.tin, bhfId: listRequest.bhfId, cmcKey: listRequest.cmcKey }
  ],
  [
    'item classification list',
    basicDataService.selectItemClsList,
    listRequest,
    config.endpoints.basicData.selectItemClsList,
    { tin: listRequest.tin, bhfId: listRequest.bhfId, lastReqDt: listRequest.lastReqDt },
    { tin: listRequest.tin, bhfId: listRequest.bhfId, cmcKey: listRequest.cmcKey }
  ],
  [
    'branch list',
    basicDataService.selectBhfList,
    bhfListRequest,
    config.endpoints.basicData.selectBhfList,
    bhfListRequest,
    undefined
  ],
  [
    'notice list',
    basicDataService.selectNoticeList,
    listRequest,
    config.endpoints.basicData.selectNoticeList,
    { tin: listRequest.tin, bhfId: listRequest.bhfId, lastReqDt: listRequest.lastReqDt },
    { tin: listRequest.tin, bhfId: listRequest.bhfId, cmcKey: listRequest.cmcKey }
  ],
  [
    'taxpayer info',
    basicDataService.selectTaxpayerInfo,
    listRequest,
    config.endpoints.basicData.selectTaxpayerInfo,
    { tin: listRequest.tin, bhfId: listRequest.bhfId, lastReqDt: listRequest.lastReqDt },
    { tin: listRequest.tin, bhfId: listRequest.bhfId, cmcKey: listRequest.cmcKey }
  ],
  [
    'customer list',
    basicDataService.selectCustomerList,
    listRequest,
    config.endpoints.basicData.selectCustomerList,
    { tin: listRequest.tin, bhfId: listRequest.bhfId, lastReqDt: listRequest.lastReqDt },
    { tin: listRequest.tin, bhfId: listRequest.bhfId, cmcKey: listRequest.cmcKey }
  ],
  [
    'initialization',
    initializationService.selectInitOsdcInfo,
    initializationRequest,
    config.endpoints.initialization.selectInitOsdcInfo,
    initializationRequest,
    undefined
  ],
  [
    'purchase transaction',
    purchaseService.selectPurchaseTrns,
    listRequest,
    config.endpoints.purchaseManagement.selectPurchaseTrns,
    { tin: listRequest.tin, bhfId: listRequest.bhfId, lastReqDt: listRequest.lastReqDt },
    { tin: listRequest.tin, bhfId: listRequest.bhfId, cmcKey: listRequest.cmcKey }
  ],
  [
    'send sales transaction',
    salesService.sendSalesTrns,
    salesRequest,
    config.endpoints.salesManagement.sendSalesTrns,
    {
      tin: salesRequest.tin,
      bhfId: salesRequest.bhfId,
      invcNo: salesRequest.invcNo,
      salesTrnsItems: salesRequest.salesTrnsItems
    },
    { tin: salesRequest.tin, bhfId: salesRequest.bhfId, cmcKey: salesRequest.cmcKey }
  ],
  [
    'select sales transaction',
    salesService.selectSalesTrns,
    { ...listRequest, invcNo: 'INV001' },
    config.endpoints.salesManagement.selectSalesTrns,
    {
      tin: listRequest.tin,
      bhfId: listRequest.bhfId,
      lastReqDt: listRequest.lastReqDt,
      invcNo: 'INV001'
    },
    { tin: listRequest.tin, bhfId: listRequest.bhfId, cmcKey: listRequest.cmcKey }
  ],
  [
    'move list',
    stockService.selectMoveList,
    listRequest,
    config.endpoints.stockManagement.selectMoveList,
    { tin: listRequest.tin, bhfId: listRequest.bhfId, lastReqDt: listRequest.lastReqDt },
    { tin: listRequest.tin, bhfId: listRequest.bhfId, cmcKey: listRequest.cmcKey }
  ],
  [
    'save stock master',
    stockService.saveStockMaster,
    stockMasterRequest,
    config.endpoints.stockManagement.saveStockMaster,
    {
      tin: stockMasterRequest.tin,
      bhfId: stockMasterRequest.bhfId,
      itemCd: stockMasterRequest.itemCd,
      itemClsCd: stockMasterRequest.itemClsCd,
      itemNm: stockMasterRequest.itemNm,
      pkgUnitCd: stockMasterRequest.pkgUnitCd,
      qtyUnitCd: stockMasterRequest.qtyUnitCd,
      splyAmt: stockMasterRequest.splyAmt,
      vatTyCd: stockMasterRequest.vatTyCd
    },
    { tin: stockMasterRequest.tin, bhfId: stockMasterRequest.bhfId, cmcKey: stockMasterRequest.cmcKey }
  ]
];

describe('SDK service operations', () => {
  const apiResponse = { resultCd: '0000', resultMsg: 'Success' };

  beforeEach(() => {
    jest.clearAllMocks();
    apiService.post.mockResolvedValue(apiResponse);
    apiService.authenticate.mockResolvedValue('test-access-token');
    apiService.tokenExpiry = new Date('2026-01-01T00:00:00.000Z');
  });

  test.each(serviceCases)(
    '%s calls its endpoint and wraps the API response',
    async (_name, operation, requestData, endpoint, expectedBody, expectedHeaders) => {
      const result = await operation(requestData);

      if (expectedHeaders === undefined) {
        expect(apiService.post).toHaveBeenCalledWith(endpoint, expectedBody);
      } else {
        expect(apiService.post).toHaveBeenCalledWith(endpoint, expectedBody, expectedHeaders);
      }

      expect(result).toEqual({ success: true, data: apiResponse });
    }
  );

  test('authentication validates and stores credentials before requesting a token', async () => {
    const expiresAt = new Date('2026-01-01T00:00:00.000Z');
    apiService.tokenExpiry = expiresAt;

    const result = await authService.getToken({
      username: 'test-user',
      password: 'test-password'
    });

    expect(apiService.username).toBe('test-user');
    expect(apiService.password).toBe('test-password');
    expect(apiService.authenticate).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      success: true,
      data: {
        access_token: 'test-access-token',
        expires_at: expiresAt
      }
    });
  });

  test('invalid stock input rejects before making an API request', async () => {
    await expect(
      stockService.selectMoveList({ tin: '', bhfId: '00', lastReqDt: '20220101010101' })
    ).rejects.toBeInstanceOf(ValidationError);

    expect(apiService.post).not.toHaveBeenCalled();
  });

  test('service errors are rethrown to the caller', async () => {
    const failure = new Error('API unavailable');
    apiService.post.mockRejectedValue(failure);

    await expect(stockService.selectMoveList(listRequest)).rejects.toBe(failure);
  });
});
