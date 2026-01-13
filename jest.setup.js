// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock environment variables for tests
process.env.RESEND_API_KEY = 'test_api_key'
process.env.CONTACT_EMAIL = 'test@example.com'
process.env.NODE_ENV = 'test'
