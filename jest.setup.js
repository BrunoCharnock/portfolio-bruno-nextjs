// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock environment variables for tests
process.env.RESEND_API_KEY = 'test_api_key'
process.env.CONTACT_EMAIL = 'test@example.com'
process.env.EMAIL_FROM = 'test@example.com'
process.env.NODE_ENV = 'test'

// Suppress console.error and console.log during tests unless explicitly needed
const originalError = console.error;
const originalLog = console.log;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.log = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalError;
  console.log = originalLog;
  console.warn = originalWarn;
});
