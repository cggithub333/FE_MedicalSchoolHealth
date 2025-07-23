// jest.setup.js
import '@testing-library/jest-dom';

// Mock import.meta for Vite compatibility
if (typeof globalThis.import === 'undefined') {
  globalThis.import = { 
    meta: { 
      env: {
        VITE_BASE_URL: 'http://localhost:8080/api/v1/',
        NODE_ENV: 'test'
      } 
    } 
  };
}

// Polyfill for TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock console methods to reduce noise in tests
const originalConsole = global.console;

// Explicitly mock modules that use import.meta
jest.mock('./src/api/request.js', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  }
}), { virtual: true });

jest.mock('./src/api/fetch-response.js', () => ({
  fetchAPI: jest.fn(),
  fetchAPIProgress: jest.fn(),
}), { virtual: true });
global.console = {
  ...originalConsole,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
};