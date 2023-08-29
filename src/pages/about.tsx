import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import styles from "@/styles/about.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Contact() {
  const { ref, inView, entry } = useInView();

  return (
    <section id="about" className={styles.aboutcontainer}>
      <h2 className={styles.aboutheading}>Sobre mim.</h2>
      <div className={styles.inner}>
        <div>
          <p ref={ref} className={inView ? styles.about : styles.about}>
            TEXTO PLACEHOLDER
          </p>
          <ul className={styles.listSkills}>
            <li>Typescript</li>
            <li>C#</li>
            <li>.Net Framework</li>
            <li>SQL</li>
          </ul>
          <div className={styles.content}>TESTE</div>
        </div>
      </div>
    </section>
  );
}
