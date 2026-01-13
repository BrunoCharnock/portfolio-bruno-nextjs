import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Projects from '../projects';

// Mock do react-intersection-observer
jest.mock('react-intersection-observer', () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: true,
  }),
}));

// Mock do fetch global
global.fetch = jest.fn();

describe('Projects Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('should render loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<Projects />);

    expect(screen.getByText('Carregando projetos...')).toBeInTheDocument();
  });

  describe('Data Fetching and Validation', () => {
    it('should fetch and display valid GitHub repositories', async () => {
      const mockRepos = [
        {
          id: 1,
          name: 'Test Repo 1',
          html_url: 'https://github.com/user/repo1',
          description: 'Test description 1',
          language: 'TypeScript',
          stargazers_count: 10,
          forks_count: 5,
        },
        {
          id: 2,
          name: 'Test Repo 2',
          html_url: 'https://github.com/user/repo2',
          description: 'Test description 2',
          language: 'JavaScript',
          stargazers_count: 20,
          forks_count: 8,
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      });

      render(<Projects />);

      await waitFor(() => {
        expect(screen.getByText('Test Repo 1')).toBeInTheDocument();
        expect(screen.getByText('Test Repo 2')).toBeInTheDocument();
        expect(screen.getByText('Test description 1')).toBeInTheDocument();
        expect(screen.getByText('Test description 2')).toBeInTheDocument();
      });
    });

    it('should sanitize malicious content from repository names', async () => {
      const mockRepos = [
        {
          id: 1,
          name: '<script>alert("XSS")</script>',
          html_url: 'https://github.com/user/repo1',
          description: 'Safe description',
          language: 'TypeScript',
          stargazers_count: 10,
          forks_count: 5,
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      });

      render(<Projects />);

      await waitFor(() => {
        // Script tags devem ser escapados
        expect(screen.queryByText('<script>alert("XSS")</script>')).not.toBeInTheDocument();
        // Conteúdo sanitizado deve estar presente
        const sanitized = screen.getByText(/alert.*XSS/);
        expect(sanitized).toBeInTheDocument();
      });
    });

    it('should filter out invalid repositories', async () => {
      const mockRepos = [
        {
          id: 1,
          name: 'Valid Repo',
          html_url: 'https://github.com/user/repo1',
          description: 'Valid description',
          language: 'TypeScript',
          stargazers_count: 10,
          forks_count: 5,
        },
        {
          // Missing required fields
          id: 2,
          name: 'Invalid Repo',
          // Missing html_url
          description: 'Invalid',
        },
        {
          id: 3,
          name: 'Malicious Repo',
          html_url: 'https://evil.com/repo', // Not a GitHub URL
          description: 'Malicious',
          language: 'Python',
          stargazers_count: 0,
          forks_count: 0,
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      });

      render(<Projects />);

      await waitFor(() => {
        // Repo válido deve estar presente
        expect(screen.getByText('Valid Repo')).toBeInTheDocument();

        // Repos inválidos não devem estar presentes
        expect(screen.queryByText('Invalid Repo')).not.toBeInTheDocument();
        expect(screen.queryByText('Malicious Repo')).not.toBeInTheDocument();
      });
    });

    it('should handle null descriptions gracefully', async () => {
      const mockRepos = [
        {
          id: 1,
          name: 'Repo Without Description',
          html_url: 'https://github.com/user/repo1',
          description: null,
          language: 'TypeScript',
          stargazers_count: 0,
          forks_count: 0,
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      });

      render(<Projects />);

      await waitFor(() => {
        expect(screen.getByText('Repo Without Description')).toBeInTheDocument();
        expect(screen.getByText('Sem descrição disponível')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when API fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      render(<Projects />);

      await waitFor(() => {
        expect(screen.getByText('Não foi possível carregar os projetos. Tente novamente mais tarde.')).toBeInTheDocument();
      });
    });

    it('should display error message when network fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<Projects />);

      await waitFor(() => {
        expect(screen.getByText('Não foi possível carregar os projetos. Tente novamente mais tarde.')).toBeInTheDocument();
      });
    });

    it('should display error when API returns non-array', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ error: 'Not an array' }),
      });

      render(<Projects />);

      await waitFor(() => {
        expect(screen.getByText('Não foi possível carregar os projetos. Tente novamente mais tarde.')).toBeInTheDocument();
      });
    });

    it('should display error when all repositories are invalid', async () => {
      const mockRepos = [
        {
          id: 1,
          // Missing required fields
          name: 'Invalid',
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      });

      render(<Projects />);

      await waitFor(() => {
        expect(screen.getByText('Não foi possível carregar os projetos. Tente novamente mais tarde.')).toBeInTheDocument();
      });
    });

    it('should allow retry after error', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [{
            id: 1,
            name: 'Retry Success',
            html_url: 'https://github.com/user/repo1',
            description: 'Loaded after retry',
            language: 'TypeScript',
            stargazers_count: 10,
            forks_count: 5,
          }],
        });

      render(<Projects />);

      // Aguardar erro
      await waitFor(() => {
        expect(screen.getByText('Não foi possível carregar os projetos. Tente novamente mais tarde.')).toBeInTheDocument();
      });

      // Clicar no botão de retry
      const retryButton = screen.getByText('Tentar novamente');
      fireEvent.click(retryButton);

      // Verificar que dados foram carregados após retry
      await waitFor(() => {
        expect(screen.getByText('Retry Success')).toBeInTheDocument();
        expect(screen.getByText('Loaded after retry')).toBeInTheDocument();
      });
    });
  });

  describe('Display Features', () => {
    it('should display repository stats correctly', async () => {
      const mockRepos = [
        {
          id: 1,
          name: 'Popular Repo',
          html_url: 'https://github.com/user/repo1',
          description: 'A popular repository',
          language: 'TypeScript',
          stargazers_count: 150,
          forks_count: 25,
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      });

      render(<Projects />);

      await waitFor(() => {
        expect(screen.getByText('150')).toBeInTheDocument();
        expect(screen.getByText('25')).toBeInTheDocument();
      });
    });

    it('should not display stats when values are zero', async () => {
      const mockRepos = [
        {
          id: 1,
          name: 'New Repo',
          html_url: 'https://github.com/user/repo1',
          description: 'A new repository',
          language: 'TypeScript',
          stargazers_count: 0,
          forks_count: 0,
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      });

      render(<Projects />);

      await waitFor(() => {
        expect(screen.getByText('New Repo')).toBeInTheDocument();
        // Stats com valor 0 não devem ser exibidos
        expect(screen.queryByText('0')).not.toBeInTheDocument();
      });
    });

    it('should display GitHub link when projects are loaded', async () => {
      const mockRepos = [
        {
          id: 1,
          name: 'Test Repo',
          html_url: 'https://github.com/user/repo1',
          description: 'Test',
          language: 'TypeScript',
          stargazers_count: 10,
          forks_count: 5,
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      });

      render(<Projects />);

      await waitFor(() => {
        expect(screen.getByText('Ver mais no GitHub')).toBeInTheDocument();
      });
    });
  });
});
