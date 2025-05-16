import { useLocaleStore, type Locale } from '@/store/locale-store';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsList, TabsTrigger } from './tabs';

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocaleStore();
  const { i18n, t } = useTranslation();

  const handleValueChange = (value: string) => {
    setLocale(value as Locale);
    i18n.changeLanguage(value);
  };

  return (
    <Tabs value={locale} onValueChange={handleValueChange}>
      <TabsList>
        <TabsTrigger value='en'>{t('english')}</TabsTrigger>
        <TabsTrigger value='ru'>{t('russian')}</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
