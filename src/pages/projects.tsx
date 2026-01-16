import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import styles from "@/styles/projects.module.css";

interface IProject {
  id: number;
  name: string;
  html_url: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
}

// Função para sanitizar strings e prevenir XSS
function sanitizeString(str: string | null | undefined): string {
  if (!str) return '';

  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

// Função para validar estrutura de um repositório
function isValidRepository(obj: any): obj is IProject {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.html_url === 'string' &&
    (obj.description === null || typeof obj.description === 'string') &&
    (obj.language === null || typeof obj.language === 'string') &&
    typeof obj.stargazers_count === 'number' &&
    typeof obj.forks_count === 'number' &&
    // Validar formato de URL
    obj.html_url.startsWith('https://github.com/')
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const fetchUserData = async () => {
    try {
      const response = await fetch("https://api.github.com/users/BrunoCharnock/repos");

      // Validar status HTTP
      if (!response.ok) {
        throw new Error(`GitHub API retornou status ${response.status}`);
      }

      const data = await response.json();

      // Validar que é um array
      if (!Array.isArray(data)) {
        throw new Error('Resposta da API não é um array');
      }

      // Filtrar e validar repositórios
      const validRepos = data
        .filter((repo): repo is IProject => {
          if (!isValidRepository(repo)) {
            console.warn('Repositório com estrutura inválida ignorado:', repo?.name || 'unknown');
            return false;
          }
          // Ignorar repositório de README do perfil (tem o mesmo nome do usuário)
          if (repo.name === 'BrunoCharnock') {
            return false;
          }
          return true;
        })
        .map(repo => ({
          ...repo,
          // Sanitizar strings antes de armazenar
          name: sanitizeString(repo.name),
          description: sanitizeString(repo.description),
          language: sanitizeString(repo.language),
        }));

      if (validRepos.length === 0) {
        throw new Error('Nenhum repositório válido encontrado');
      }

      setProjects(validRepos);
      setError(null);

    } catch (error) {
      console.error("Erro ao buscar repositórios:", error);
      setError("Não foi possível carregar os projetos. Tente novamente mais tarde.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <section id="projetos" className={styles.projectsSection} ref={ref}>
      <div className={styles.container}>
        {/* Heading */}
        <div className={`${styles.headingWrapper} ${inView ? styles.fadeIn : ''}`}>
          <h2 className={styles.heading}>Projetos</h2>
          <div className={styles.headingLine}></div>
          <p className={styles.subheading}>
            Alguns dos meus projetos open-source no GitHub
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Carregando projetos...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <p className={styles.errorText}>{error}</p>
            <button
              onClick={fetchUserData}
              className={styles.retryButton}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && projects.length > 0 && (
          <div className={styles.projectsGrid}>
            {projects.map((repo, index) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.projectCard} ${inView ? styles.projectCardVisible : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.iconFolder}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <div className={styles.iconExternal}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </div>
                </div>

                {/* Card Content */}
                <div className={styles.cardContent}>
                  <h3 className={styles.projectTitle}>{repo.name}</h3>
                  <p className={styles.projectDescription}>
                    {repo.description || "Sem descrição disponível"}
                  </p>
                </div>

                {/* Card Footer */}
                <div className={styles.cardFooter}>
                  {repo.language && (
                    <div className={styles.languageTag}>
                      <span className={styles.languageDot}></span>
                      {repo.language}
                    </div>
                  )}
                  <div className={styles.stats}>
                    {repo.stargazers_count > 0 && (
                      <span className={styles.stat}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                        </svg>
                        {repo.stargazers_count}
                      </span>
                    )}
                    {repo.forks_count > 0 && (
                      <span className={styles.stat}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="18" r="3"></circle>
                          <circle cx="6" cy="6" r="3"></circle>
                          <circle cx="18" cy="6" r="3"></circle>
                          <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"></path>
                          <path d="M12 12v3"></path>
                        </svg>
                        {repo.forks_count}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* GitHub Link */}
        {!loading && !error && projects.length > 0 && (
          <div className={styles.viewMoreContainer}>
            <a
              href="https://github.com/BrunoCharnock"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewMoreLink}
            >
              Ver mais no GitHub
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
