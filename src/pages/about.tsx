import { useInView } from "react-intersection-observer";
import styles from "@/styles/about.module.css";

export default function About() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const skillSections = [
    {
      category: "Front-end",
      technologies: "JavaScript, TypeScript, React, Next.js, Angular, HTML5, CSS3, Tailwind CSS"
    },
    {
      category: "Back-end",
      technologies: "C#, .NET Framework, .NET Core, Node.js, ASP.NET, RESTful APIs"
    },
    {
      category: "Database",
      technologies: "SQL Server, MySQL, PostgreSQL, MongoDB, Entity Framework"
    },
    {
      category: "Tools & Others",
      technologies: "Git, Docker, Azure, Visual Studio, VS Code, Postman, Jira"
    }
  ];

  return (
    <section id="sobre" className={styles.aboutSection} ref={ref}>
      <div className={styles.container}>
        {/* Heading */}
        <div className={`${styles.headingWrapper} ${inView ? styles.fadeIn : ''}`}>
          <h2 className={styles.heading}>Sobre mim</h2>
          <div className={styles.headingLine}></div>
        </div>

        {/* Content Grid */}
        <div className={styles.contentGrid}>
          {/* Text Content */}
          <div className={`${styles.textContent} ${inView ? styles.slideInLeft : ''}`}>
            <p className={styles.paragraph}>
              Olá! Sou um desenvolvedor apaixonado por criar soluções que fazem a diferença. 
              Minha jornada na programação começou quando descobri que poderia transformar 
              ideias em realidade através do código.
            </p>
            <p className={styles.paragraph}>
              Atualmente trabalho na <span className={styles.highlight}>Teleperformance</span>, 
              onde desenvolvo aplicações .NET que impactam milhares de usuários. Adoro os 
              desafios de trabalhar com sistemas escaláveis e a satisfação de ver um projeto 
              bem arquitetado funcionando perfeitamente.
            </p>
            <p className={styles.paragraph}>
              Quando não estou codando, gosto de me manter atualizado com as últimas 
              tecnologias, contribuir com a comunidade dev e explorar novas formas de 
              resolver problemas complexos de maneira elegante.
            </p>
          </div>

          {/* Skills Sections */}
          <div className={`${styles.skillsContainer} ${inView ? styles.slideInRight : ''}`}>
            <h3 className={styles.skillsHeading}>Tecnologias & Ferramentas</h3>
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