import Image from "next/image";
import { useState, useEffect } from "react";
import terminalIcon from "../components/images/svg/terminal-branco.svg";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "@/styles/navbar.module.css";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : styles.navbarTransparent}`}>
      <div className={styles.container}>
        <ul className={styles.navbarNav}>
          {/* Logo */}
          <li className={`${styles.navitem} ${styles.logoItem} ${isVisible ? styles.navitemVisible : ''}`}>
            <div className={styles.logoContainer} onClick={handleLogoClick}>
              <div className={styles.logoGlow}></div>
              <div className={styles.logoWrapper}>
                <Image
                  priority
                  src={terminalIcon}
                  alt="logo terminal"
                  height={30}
                  width={30}
                  className={styles.navlogo}
                  style={{ height: 'auto', width: '30px' }}
                />
              </div>
            </div>
          </li>

          {/* Navigation Links */}
          <li className={`${styles.navitem} ${isVisible ? styles.navitemVisible : ''}`}>
            <a href="#sobre" className={styles.navlink}>
              {t('nav.about')}
            </a>
          </li>

          <li className={`${styles.navitem} ${isVisible ? styles.navitemVisible : ''}`}>
            <a href="#projetos" className={styles.navlink}>
              {t('nav.projects')}
            </a>
          </li>

          <li className={`${styles.navitem} ${isVisible ? styles.navitemVisible : ''}`}>
            <a href="#contato" className={styles.navlink}>
              {t('nav.contact')}
            </a>
          </li>

          {/* Language Switcher */}
          <li className={`${styles.navitem} ${isVisible ? styles.navitemVisible : ''}`}>
            <LanguageSwitcher />
          </li>
        </ul>
      </div>
    </nav>
  );
}
