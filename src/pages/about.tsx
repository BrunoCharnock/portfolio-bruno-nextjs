import { useInView } from "react-intersection-observer";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "@/styles/about.module.css";

export default function About() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  const { t } = useTranslation();

  const skillSections = [
    {
      category: "Front-end",
      technologies: t('about.skills.frontend')
    },
    {
      category: "Back-end",
      technologies: t('about.skills.backend')
    },
    {
      category: "Database",
      technologies: t('about.skills.database')
    },
    {
      category: "Tools & Others",
      technologies: t('about.skills.tools')
    }
  ];

  return (
    <section id="sobre" className={styles.aboutSection} ref={ref}>
      <div className={styles.container}>
        {/* Heading */}
        <div className={`${styles.headingWrapper} ${inView ? styles.fadeIn : ''}`}>
          <h2 className={styles.heading}>{t('about.title')}</h2>
          <div className={styles.headingLine}></div>
        </div>

        {/* Content Grid */}
        <div className={styles.contentGrid}>
          {/* Text Content */}
          <div className={`${styles.textContent} ${inView ? styles.slideInLeft : ''}`}>
            <p className={styles.paragraph}>
              {t('about.paragraph1')}
            </p>
            <p className={styles.paragraph}>
              {t('about.paragraph2')}
            </p>
            <p className={styles.paragraph}>
              {t('about.paragraph3')}
            </p>
            <p className={styles.paragraph}>
              {t('about.paragraph4')}
            </p>
          </div>

          {/* Skills Sections */}
          <div className={`${styles.skillsContainer} ${inView ? styles.slideInRight : ''}`}>
            <h3 className={styles.skillsHeading}>{t('about.skillsTitle')}</h3>
            <div className={styles.skillsSections}>
              {skillSections.map((section, index) => (
                <div
                  key={section.category}
                  className={styles.skillSection}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.categoryLabel}>{section.category}</div>
                  <p className={styles.technologiesList}>{section.technologies}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
