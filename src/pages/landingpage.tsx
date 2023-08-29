import styles from "@/styles/landingpage.module.css";

export default function LandingPage() {
  return (
    <section className={styles.landingpage}>
      <div className="ladingpage-text-container ">
        <h6 className={styles.introduction}>Olá, me chamo</h6>
        <h1 className={styles.name}>Bruno Charnock</h1>
        <h2 className={styles.typingdemo}>Eu desenvolvo soluções.</h2>
        <p className={styles.description}>
          Sou um desenvolvedor .Net full-time, focado em criar soluções
          escaláveis e eficientes para problemas reais, trabalhando atualmente
          em{" "}
          <a
            className={styles.joblink}
            href="https://www.teleperformance.com/pt-br/locations/brazil-site/brasil/"
            target="/blank"
          >
            Teleperformance
          </a>{" "}
          .
        </p>
      </div>
    </section>
  );
}
