/**
 * Server usage example for KRA eTims SDK
 * Demonstrates how to use the SDK as an Express server
 */
import 'dotenv/config';
import KRAeTimsSDK from '../src';

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

// Initialize the SDK with server option
const sdk = new KRAeTimsSDK({ server: true });

// Start the server
const port: number = Number(process.env.PORT) || 5000;

const endpoints: ReadonlyArray<string> = [
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
  .catch((err: unknown) => {
    console.error('Failed to start server:', getErrorMessage(err));
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  try {
    await sdk.stop();
    console.log('Server stopped');
    process.exit(0);
  } catch (error) {
    console.error('Error stopping server:', getErrorMessage(error));
    process.exit(1);
  }
});