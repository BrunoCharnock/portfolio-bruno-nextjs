import { useRouter } from 'next/router';
import styles from '@/styles/navbar.module.css';

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale, asPath } = router;

  const toggleLocale = () => {
    const newLocale = locale === 'pt-br' ? 'en' : 'pt-br';
    router.push(asPath, asPath, { locale: newLocale });
  };

  const isPtBr = locale === 'pt-br';

  return (
    <button
      onClick={toggleLocale}
      className={styles.languageSwitcher}
      aria-label={isPtBr ? 'Switch to English' : 'Mudar para Português'}
      title={isPtBr ? 'Switch to English' : 'Mudar para Português'}
    >
      <span className={styles.languageFlag}>
        {isPtBr ? '🇧🇷' : '🇺🇸'}
      </span>
      <span className={styles.languageCode}>
        {isPtBr ? 'PT' : 'EN'}
      </span>
    </button>
  );
}
