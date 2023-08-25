import Image from "next/image";
import terminalIcon from "../components/images/svg/terminal-branco.svg";
import styles from "@/styles/navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navbarNav}>
        <li className={styles.navitem}>
          <a href="/" className={styles.navlogo}>
            <Image
              priority
              src={terminalIcon}
              alt="logo terminal"
              height={30}
            />
          </a>
        </li>
        <li className={styles.navitem}>
          <a href="#" className={styles.navlink}>
            Sobre
          </a>
        </li>
        <li className={styles.navitem}>
          <a href="#" className={styles.navlink}>
            Projetos
          </a>
        </li>
        <li className={styles.navitem}>
          <a href="#" className={styles.navlink}>
            Contato
          </a>
        </li>
      </ul>
    </nav>
  );
}
