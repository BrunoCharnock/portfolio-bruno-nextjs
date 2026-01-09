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
      technologies: "HTML5, CSS3, SCSS, JavaScript (ES6+), TypeScript, Angular, React, Next.js, Tailwind CSS."
    },
    {
      category: "Back-end",
      technologies: "C#, .NET Framework, .NET Core / .NET, ASP.NET Core (Web API), Entity Framework, Entity Framework Core, APIs REST, microsserviços, integração entre sistemas."
    },
    {
      category: "Database",
      technologies: "SQL Server, modelagem de dados, consultas e otimização SQL."
    },
    {
      category: "Tools & Others",
      technologies: "Git, GitLab, Docker, Linux, Nginx, Cloudflare, homelab (self-hosting, automação e serviços), Swagger / OpenAPI, Jira, Postman, integração e consumo de APIs, clean code e boas práticas."
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
              Olá! Sou desenvolvedor de software com foco em .NET e experiência prática na construção e evolução de sistemas 
              utilizados em produção. Gosto de trabalhar em soluções que resolvem problemas reais, sempre priorizando 
              código limpo, arquitetura bem pensada e impacto concreto para os usuários.
            </p>
            <p className={styles.paragraph}>
              Minha jornada na programação começou a partir do interesse em modificar e desenvolver jogos, o que me levou a cursar 
              Game Design. Foi nesse processo que descobri que o desenvolvimento de software ia muito além dos jogos e que 
              criar sistemas bem estruturados, escaláveis e eficientes era algo que me motivava de verdade.
            </p>
            <p className={styles.paragraph}>
              Atualmente atuo na <span className={styles.highlight}>Teleperformance</span>, 
              desenvolvendo e mantendo aplicações .NET utilizadas por milhares de usuários. 
              Trabalho tanto na criação de novas funcionalidades quanto na manutenção e
               modernização de sistemas legados, além de integrações via APIs e participação 
               em decisões técnicas voltadas à escalabilidade, desempenho e facilidade de manutenção.
            </p>
            <p className={styles.paragraph}>
              Sou entusiasta de tecnologia e gosto de entender como as coisas funcionam por trás dos 
              panos. Por isso, além do desenvolvimento profissional, me interesso por infraestrutura, 
              automação e experimentações em homelab, sempre buscando aprofundar meu conhecimento 
              técnico e aplicar boas práticas que tornem o software mais confiável e sustentável ao 
              longo do tempo.
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