import { GlobalRegistrator } from '@happy-dom/global-registrator';
import '@testing-library/jest-dom';

// Register happy-dom globally for browser environment simulation
GlobalRegistrator.register();

// Setup environment variables for testing
process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:3000/';
process.env.NEXT_PUBLIC_STREAMING_BACKEND_URL = 'http://localhost:3001/';
process.env.NEXT_PUBLIC_CF_PROXY_URL = 'http://localhost:3002/';
