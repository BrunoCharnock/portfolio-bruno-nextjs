import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '../src/pages/api/send';

// Mock do Resend
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({
        data: { id: 'mock-email-id-123' },
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

// Mock do React Email Components
jest.mock('@react-email/components', () => ({
  Html: ({ children }: any) => children,
  Head: () => null,
  Body: ({ children }: any) => children,
  Container: ({ children }: any) => children,
  Section: ({ children }: any) => children,
  Text: ({ children }: any) => children,
  Hr: () => null,
}));

describe('API /api/send - Contact Form Email Handler', () => {

  // Helper para criar requisição de teste
  const createTestRequest = (body: any, method: RequestMethod = 'POST') => {
    return createMocks<NextApiRequest, NextApiResponse>({
      method,
      body,
    });
  };

  // Helper para obter response data
  const getResponseData = (res: any) => JSON.parse(res._getData());

  // Dados de teste válidos
  const validData = {
    name: 'João Silva',
    email: 'joao@example.com',
    message: 'Esta é uma mensagem de teste válida com mais de 10 caracteres.'
  };

  describe('Validação de Método HTTP', () => {
    it('deve rejeitar requisições GET', async () => {
      const { req, res } = createTestRequest({}, 'GET');

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(getResponseData(res)).toEqual({
        error: 'Método não permitido'
      });
    });

    it('deve aceitar requisições POST válidas', async () => {
      const { req, res } = createTestRequest(validData);

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(getResponseData(res)).toMatchObject({
        message: 'Email enviado com sucesso!',
        id: 'mock-email-id-123'
      });
    });
  });

  describe('Validação do Campo "Nome"', () => {
    it('deve rejeitar quando nome está ausente', async () => {
      const { req, res } = createTestRequest({
        email: validData.email,
        message: validData.message
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(getResponseData(res).error).toBe('Nome é obrigatório.');
    });

    it('deve rejeitar nome muito curto (< 2 caracteres)', async () => {
      const { req, res } = createTestRequest({
        ...validData,
        name: 'A'
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(getResponseData(res).error).toContain('pelo menos');
    });

    it('deve rejeitar nome muito longo (> 100 caracteres)', async () => {
      const { req, res } = createTestRequest({
        ...validData,
        name: 'A'.repeat(101)
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(getResponseData(res).error).toContain('não pode exceder');
    });

    it('deve sanitizar caracteres de controle no nome', async () => {
      const { req, res } = createTestRequest({
        ...validData,
        name: 'Test\r\nUser\t'
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
    });

    it('deve fazer trim em espaços no nome', async () => {
      const { req, res } = createTestRequest({
        ...validData,
        name: '  João Silva  '
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
    });
  });

  describe('Validação do Campo "Email"', () => {
    it('deve rejeitar quando email está ausente', async () => {
      const { req, res } = createTestRequest({
        name: validData.name,
        message: validData.message
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(getResponseData(res).error).toBe('Email é obrigatório.');
    });

    it('deve rejeitar formato de email inválido', async () => {
      const { req, res } = createTestRequest({
        ...validData,
        email: 'email-invalido'
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(getResponseData(res).error).toBe('Email inválido.');
    });

    it('deve aceitar email válido', async () => {
      const { req, res } = createTestRequest(validData);

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
    });

    it('deve normalizar email para lowercase', async () => {
      const { req, res } = createTestRequest({
        ...validData,
        email: 'JOAO@EXAMPLE.COM'
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
    });

    it('deve fazer trim em espaços no email', async () => {
      const { req, res } = createTestRequest({
        ...validData,
        email: '  joao@example.com  '
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
    });
  });

  describe('Validação do Campo "Mensagem"', () => {
    it('deve rejeitar quando mensagem está ausente', async () => {
      const { req, res } = createTestRequest({
        name: validData.name,
        email: validData.email
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(getResponseData(res).error).toBe('Mensagem é obrigatória.');
    });

    it('deve rejeitar mensagem muito curta (< 10 caracteres)', async () => {
      const { req, res } = createTestRequest({
        ...validData,
        message: 'Curta'
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(getResponseData(res).error).toContain('pelo menos');
    });

    it('deve rejeitar mensagem muito longa (> 5000 caracteres)', async () => {
      const { req, res } = createTestRequest({
        ...validData,
        message: 'A'.repeat(5001)
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(getResponseData(res).error).toContain('não pode exceder');
    });

    it('deve fazer trim em espaços na mensagem', async () => {
      const { req, res } = createTestRequest({
        ...validData,
        message: '  Esta é uma mensagem com espaços.  '
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
    });
  });

  describe('Envio de Email', () => {
    it('deve enviar email com dados válidos e retornar ID', async () => {
      const { req, res } = createTestRequest(validData);

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = getResponseData(res);
      expect(data.message).toBe('Email enviado com sucesso!');
      expect(data.id).toBe('mock-email-id-123');
    });

    it('deve processar todos os campos com trim aplicado', async () => {
      const { req, res } = createTestRequest({
        name: '  João Silva  ',
        email: '  joao@example.com  ',
        message: '  Mensagem de teste com espaços.  '
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
    });
  });

  describe('Segurança', () => {
    it('deve prevenir injeção de email via campo nome', async () => {
      const { req, res } = createTestRequest({
        ...validData,
        name: 'Attacker\r\nBcc: hacker@evil.com'
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
    });

    it('deve sanitizar caracteres de controle perigosos', async () => {
      const dangerousChars = ['\\r', '\\n', '\\t', '\\x00'];

      for (const char of dangerousChars) {
        const { req, res } = createTestRequest({
          ...validData,
          name: `Test${char}User`
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
      }
    });
  });

  describe('Variáveis de Ambiente', () => {
    it('deve retornar erro se RESEND_API_KEY não estiver configurada', async () => {
      const originalKey = process.env.RESEND_API_KEY;
      delete process.env.RESEND_API_KEY;

      const { req, res } = createTestRequest(validData);
      await handler(req, res);

      expect(res._getStatusCode()).toBe(500);
      expect(getResponseData(res).error).toContain('Configuração do servidor');

      process.env.RESEND_API_KEY = originalKey;
    });
  });
});
