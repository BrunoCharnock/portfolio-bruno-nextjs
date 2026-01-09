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

export default function Projects() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const fetchUserData = async () => {
    try {
      const response = await fetch("https://api.github.com/users/BrunoCharnock/repos");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Erro ao buscar repositórios:", error);
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

        {/* Projects Grid */}
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Carregando projetos...</p>
          </div>
        ) : (
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
        {!loading && projects.length > 0 && (
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