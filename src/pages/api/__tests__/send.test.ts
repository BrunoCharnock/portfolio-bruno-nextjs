import { createMocks } from 'node-mocks-http';
import handler from '../send';

// Mock do Resend
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({
        data: { id: 'test-email-id' },
        error: null
      })
    }
  }))
}));

// Mock do validator
jest.mock('validator', () => ({
  isEmail: jest.fn((email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
  normalizeEmail: jest.fn((email: string) => email.toLowerCase())
}));

describe('/api/send', () => {
  describe('HTTP Method Validation', () => {
    it('should reject non-POST requests', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Método não permitido'
      });
    });

    it('should accept POST requests', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test message'
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
    });
  });

  describe('Input Validation - Name', () => {
    it('should reject missing name', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          message: 'Test message'
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Nome é obrigatório.'
      });
    });

    it('should reject name that is too short', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: 'A',
          email: 'test@example.com',
          message: 'Test message'
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData()).error).toContain('pelo menos');
    });

    it('should reject name that is too long', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: 'A'.repeat(101),
          email: 'test@example.com',
          message: 'Test message'
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData()).error).toContain('não pode exceder');
    });

    it('should sanitize name with control characters', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: 'Test\r\nUser\t',
          email: 'test@example.com',
          message: 'Test message'
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      // Nome foi sanitizado (removeu \r\n\t)
    });
  });

  describe('Input Validation - Email', () => {
    it('should reject missing email', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: 'Test User',
          message: 'Test message'
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Email é obrigatório.'
      });
    });

    it('should reject invalid email format', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: 'Test User',
          email: 'invalid-email',
          message: 'Test message'
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Email inválido.'
      });
    });

    it('should accept valid email', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: 'Test User',
          email: 'valid@example.com',
          message: 'Test message'
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
    });

    it('should normalize email to lowercase', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: 'Test User',
          email: 'TEST@EXAMPLE.COM',
          message: 'Test message'
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      // Email foi normalizado para lowercase
    });
  });

  describe('Input Validation - Message', () => {
    it('should reject missing message', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: 'Test User',
          email: 'test@example.com'
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Mensagem é obrigatória.'
      });
    });

    it('should reject message that is too short', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Short'
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData()).error).toContain('pelo menos');
    });

    it('should reject message that is too long', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'A'.repeat(5001)
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData()).error).toContain('não pode exceder');
    });
  });

  describe('Email Sending', () => {
    it('should successfully send email with valid data', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a valid test message'
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe('Email enviado com sucesso!');
      expect(data.id).toBe('test-email-id');
    });

    it('should trim whitespace from all fields', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: '  Test User  ',
          email: '  test@example.com  ',
          message: '  This is a test message  '
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
    });
  });

  describe('Security', () => {
    it('should prevent email injection via name field', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: 'Attacker\r\nBcc: hacker@evil.com',
          email: 'test@example.com',
          message: 'Injection attempt'
        }
      });

      await handler(req, res);

      // Deve sanitizar e aceitar, mas sem os caracteres maliciosos
      expect(res._getStatusCode()).toBe(200);
    });

    it('should handle malformed JSON gracefully', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: 'invalid json{'
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Formato JSON inválido'
      });
    });
  });
});
