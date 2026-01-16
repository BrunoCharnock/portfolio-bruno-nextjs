import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import styles from '@/styles/landingpage.module.css';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

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
            <span className={styles.introduction}>{t('landing.greeting')}</span>
          </div>

          {/* Name with gradient */}
          <h1 className={styles.name}>
            Bruno Charnock
          </h1>

          {/* Typing effect subtitle */}
          <div className={styles.subtitleContainer}>
            <h2 className={styles.typingdemo}>
              {t('landing.tagline')}{' '}
              <span className={styles.highlight}>
                <span className={styles.highlightText}>
                  {t('landing.highlight')}
                </span>
                <span className={styles.highlightUnderline}></span>
              </span>
              .
            </h2>
          </div>

          {/* Description */}
          <p className={styles.description}>
            {t('landing.description')}{' '}
            <a
              href="https://www.teleperformance.com/pt-br/locations/brazil-site/brasil/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.joblink}
            >
            {t('landing.company')}
            </a>{' '}
            {t('landing.descriptionEnd')}
          </p>

          {/* CTA Buttons */}
          <div className={styles.ctaButtons}>
            <a href="#projetos" className={styles.btnPrimary}>
              {t('landing.ctaProjects')}
            </a>
            <a href="#contato" className={styles.btnSecondary}>
              {t('landing.ctaContact')}
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
