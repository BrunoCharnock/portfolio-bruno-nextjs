import { useEffect, useState } from 'react';
import styles from '@/styles/landingpage.module.css';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className={styles.landingpage}>
      <div className={styles.container}>
        <div className={`${styles.content} ${isVisible ? styles.contentVisible : styles.contentHidden}`}>
          
          {/* Introduction tag */}
          <div className={styles.introductionTag}>
            <div className={styles.pulseDot}></div>
            <span className={styles.introduction}>Olá, me chamo</span>
          </div>

          {/* Name with gradient */}
          <h1 className={styles.name}>
            Bruno Charnock
          </h1>

          {/* Typing effect subtitle */}
          <div className={styles.subtitleContainer}>
            <h2 className={styles.typingdemo}>
              Eu desenvolvo{' '}
              <span className={styles.highlight}>
                <span className={styles.highlightText}>
                  soluções
                </span>
                <span className={styles.highlightUnderline}></span>
              </span>
              .
            </h2>
          </div>

          {/* Description */}
          <p className={styles.description}>
            Sou um desenvolvedor .NET full-time, focado em criar soluções
            escaláveis e eficientes para problemas reais, trabalhando atualmente em{' '}
            <a
              href="https://www.teleperformance.com/pt-br/locations/brazil-site/brasil/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.joblink}
            >
              Teleperformance
            </a>
            .
          </p>

          {/* CTA Buttons */}
          <div className={styles.ctaButtons}>
            <a href="#projetos" className={styles.btnPrimary}>
              Ver Projetos
            </a>
            <a href="#contato" className={styles.btnSecondary}>
              Entre em Contato
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel}></div>
        </div>
      </div>
    </section>
  );
}