import { useMess } from '@/context/AppContext';
import { translate } from '@/lib/i18n';

export function useTranslation() {
  const { language, setLanguage } = useMess();
  return {
    language,
    setLanguage,
    t: (key: string, variables?: Record<string, string | number>) => translate(language, key, variables),
  };
}