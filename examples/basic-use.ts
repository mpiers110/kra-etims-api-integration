/**
 * Basic usage example for KRA eTims SDK
 * Demonstrates how to use the SDK for common operations
 */
import 'dotenv/config';
import KRAeTimsSDK from '../src';
import type {
  AuthRequest,
  InitializationRequest,
  ListRequest,
  SalesTrnsRequest
} from '../src/utils/validation';

// Initialize the SDK
const sdk = new KRAeTimsSDK();

// Assumed shape of the auth response. Replace with the real type from auth.service.
interface AuthTokenResponse {
  data: {
    access_token: string;
  };
}

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

// Example functions
export async function authenticate(): Promise<string> {
  try {
    console.log('Authenticating with KRA eTims API...');
    const credentials: AuthRequest = {
      username: requireEnv('API_USERNAME'),
      password: requireEnv('API_PASSWORD')
    };
    const result = (await sdk.auth.getToken(credentials)) as AuthTokenResponse;
    console.log('Authentication successful:', result);
    return result.data.access_token;
  } catch (error) {
    console.error('Authentication failed:', getErrorMessage(error));
    throw error;
  }
}

export async function initializeOsdc(): Promise<unknown> {
  try {
    console.log('Initializing OSDC Info...');
    const request: InitializationRequest = {
      tin: 'P000000045R',
      bhfId: '00',
      dvcSrlNo: 'MOVA22'
    };
    const result = await sdk.initialization.selectInitOsdcInfo(request);
    console.log('Initialization successful:', result);
    return result;
  } catch (error) {
    console.error('Initialization failed:', getErrorMessage(error));
    throw error;
  }
}

export async function getCodeList(): Promise<unknown> {
  try {
    console.log('Getting code list...');
    const request: ListRequest = {
      tin: 'P000000045R',
      bhfId: '00',
      lastReqDt: '20220101010101'
    };
    const result = await sdk.basicData.selectCodeList(request);
    console.log('Code list retrieved:', result);
    return result;
  } catch (error) {
    console.error('Failed to retrieve code list:', getErrorMessage(error));
    throw error;
  }
}

export async function sendSalesTrns(): Promise<unknown> {
  try {
    console.log('Sending sales transaction...');
    const request: SalesTrnsRequest = {
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
    const result = await sdk.sales.sendSalesTrns(request);
    console.log('Sales transaction sent:', result);
    return result;
  } catch (error) {
    console.error('Failed to send sales transaction:', getErrorMessage(error));
    throw error;
  }
}

// Run the examples
export async function runExamples(): Promise<void> {
  try {
    // auth
    await authenticate();

    // Then run other examples
    await initializeOsdc();
    await getCodeList();
    await sendSalesTrns();

    console.log('All examples completed successfully');
  } catch (error) {
    console.error('Example execution failed:', getErrorMessage(error));
    process.exitCode = 1;
  }
}

// Run the examples if this file is executed directly
if (require.main === module) {
  void runExamples();
}