import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

type Translations = Record<string, unknown>;

const translationsCache: Record<string, Translations> = {};

export function useTranslation() {
  const router = useRouter();
  const { locale = 'pt-br', locales, asPath } = router;
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      if (translationsCache[locale]) {
        setTranslations(translationsCache[locale]);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/locales/${locale}.json`);
        const data = await response.json();
        translationsCache[locale] = data;
        setTranslations(data);
      } catch (error) {
        console.error(`Failed to load translations for ${locale}:`, error);
        if (locale !== 'pt-br' && translationsCache['pt-br']) {
          setTranslations(translationsCache['pt-br']);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [locale]);

  const t = useCallback((key: string, fallback?: string): string => {
    const keys = key.split('.');
    let value: unknown = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        value = undefined;
        break;
      }
    }

    return typeof value === 'string' ? value : (fallback ?? key);
  }, [translations]);

  const changeLocale = useCallback((newLocale: string) => {
    router.push(asPath, asPath, { locale: newLocale });
  }, [router, asPath]);

  return {
    t,
    locale,
    changeLocale,
    isLoading,
    locales: locales || ['pt-br', 'en'],
  };
}
