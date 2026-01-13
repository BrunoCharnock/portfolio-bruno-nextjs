import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from '../contact';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';

// Mock do react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
  ToastContainer: () => null,
}));

// Mock do react-intersection-observer
jest.mock('react-intersection-observer', () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: true,
  }),
}));

// Mock do fetch global
global.fetch = jest.fn();

describe('Contact Form', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('should render the contact form', () => {
    render(<Contact />);

    expect(screen.getByText('Entre em Contato')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('João Silva')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('joao@exemplo.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Conte-me sobre seu projeto ou ideia...')).toBeInTheDocument();
  });

  describe('Client-side Validation', () => {
    it('should show warning for short name', async () => {
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText('João Silva');
      const emailInput = screen.getByPlaceholderText('joao@exemplo.com');
      const messageInput = screen.getByPlaceholderText('Conte-me sobre seu projeto ou ideia...');
      const submitButton = screen.getByText('Enviar mensagem');

      await userEvent.type(nameInput, 'AB');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(messageInput, 'Valid message here');

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.warning).toHaveBeenCalledWith('O nome precisa ter mais de 2 letras');
      });
    });

    it('should show warning for short message', async () => {
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText('João Silva');
      const emailInput = screen.getByPlaceholderText('joao@exemplo.com');
      const messageInput = screen.getByPlaceholderText('Conte-me sobre seu projeto ou ideia...');
      const submitButton = screen.getByText('Enviar mensagem');

      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(messageInput, 'Short');

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.warning).toHaveBeenCalledWith('Sua mensagem precisa ter pelo menos 10 caracteres.');
      });
    });

    it('should show warning for invalid email', async () => {
      render(<Contact />);

      const nameInput = screen.getByPlaceholderText('João Silva');
      const emailInput = screen.getByPlaceholderText('joao@exemplo.com');
      const messageInput = screen.getByPlaceholderText('Conte-me sobre seu projeto ou ideia...');
      const submitButton = screen.getByText('Enviar mensagem');

      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'invalid-email');
      await userEvent.type(messageInput, 'Valid message here');

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.warning).toHaveBeenCalledWith('Por favor, insira um email válido');
      });
    });
  });

  describe('Form Submission', () => {
    it('should successfully submit valid form', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
        json: async () => ({ message: 'Email enviado com sucesso!' }),
      });

      render(<Contact />);

      const nameInput = screen.getByPlaceholderText('João Silva');
      const emailInput = screen.getByPlaceholderText('joao@exemplo.com');
      const messageInput = screen.getByPlaceholderText('Conte-me sobre seu projeto ou ideia...');
      const submitButton = screen.getByText('Enviar mensagem');

      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(messageInput, 'This is a valid test message');

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Test User',
            email: 'test@example.com',
            message: 'This is a valid test message'
          }),
        });
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Email enviado com sucesso!');
      });
    });

    it('should handle rate limit error (429)', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 429,
        json: async () => ({
          error: 'Muitas tentativas',
          retryAfter: 5
        }),
      });

      render(<Contact />);

      const nameInput = screen.getByPlaceholderText('João Silva');
      const emailInput = screen.getByPlaceholderText('joao@exemplo.com');
      const messageInput = screen.getByPlaceholderText('Conte-me sobre seu projeto ou ideia...');
      const submitButton = screen.getByText('Enviar mensagem');

      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(messageInput, 'This is a valid test message');

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Muitas tentativas\nTente novamente em 5 minutos.');
      });
    });

    it('should handle validation error (400)', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 400,
        json: async () => ({ error: 'Email inválido.' }),
      });

      render(<Contact />);

      const nameInput = screen.getByPlaceholderText('João Silva');
      const emailInput = screen.getByPlaceholderText('joao@exemplo.com');
      const messageInput = screen.getByPlaceholderText('Conte-me sobre seu projeto ou ideia...');
      const submitButton = screen.getByText('Enviar mensagem');

      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(messageInput, 'This is a valid test message');

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Email inválido.');
      });
    });

    it('should handle network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<Contact />);

      const nameInput = screen.getByPlaceholderText('João Silva');
      const emailInput = screen.getByPlaceholderText('joao@exemplo.com');
      const messageInput = screen.getByPlaceholderText('Conte-me sobre seu projeto ou ideia...');
      const submitButton = screen.getByText('Enviar mensagem');

      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(messageInput, 'This is a valid test message');

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Erro de conexão. Verifique sua internet e tente novamente.');
      });
    });
  });

  describe('Form State', () => {
    it('should disable submit button while submitting', async () => {
      (global.fetch as jest.Mock).mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({
          status: 200,
          json: async () => ({ message: 'Success' }),
        }), 100))
      );

      render(<Contact />);

      const nameInput = screen.getByPlaceholderText('João Silva');
      const emailInput = screen.getByPlaceholderText('joao@exemplo.com');
      const messageInput = screen.getByPlaceholderText('Conte-me sobre seu projeto ou ideia...');
      const submitButton = screen.getByText('Enviar mensagem');

      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(messageInput, 'This is a valid test message');

      fireEvent.click(submitButton);

      // Verificar que o botão está desabilitado durante submissão
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      // Aguardar conclusão
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      }, { timeout: 200 });
    });
  });
});
