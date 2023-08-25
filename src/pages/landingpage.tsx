import styles from "@/styles/landingpage.module.css";

export default function LandingPage() {
  return (
    <div className={styles.landingpage}>
      <div className="ladingpage-text-container ">
        <h6 className={styles.introduction}>Olá, me chamo</h6>
        <h1 className={styles.name}>Bruno Charnock</h1>
        <h2 className={styles.typingdemo}>Eu desenvolvo soluções.</h2>
        <h2 className={styles.description}>Eu desenvolvo soluções</h2>
      </div>
    </div>
  );
}
