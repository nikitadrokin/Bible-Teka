import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useLocaleStore } from '@/store/locale-store';

// English translations
const enResources = {
  translation: {
    // App title
    appTitle: 'BibleTeka',

    // Bible navigation
    selectBook: 'Select a Book',
    selectChapter: 'Select a Chapter',
    oldTestament: 'Old Testament',
    newTestament: 'New Testament',

    // Audio player
    failedToLoadAudio: 'Failed to load audio file:',
    unknownError: 'Unknown error',

    // Language switcher
    english: 'English',
    russian: 'Русский',

    // History dialog
    viewHistory: 'View History',
    readingHistory: 'Reading History',
    clearHistory: 'Clear History',
    noHistory: 'No history yet',
  },
};

// Russian translations
const ruResources = {
  translation: {
    // App title
    appTitle: 'БиблияТека',

    // Bible navigation
    selectBook: 'Выберите книгу',
    selectChapter: 'Выберите главу',
    oldTestament: 'Ветхий Завет',
    newTestament: 'Новый Завет',

    // Audio player
    failedToLoadAudio: 'Не удалось загрузить аудиофайл:',
    unknownError: 'Неизвестная ошибка',

    // Language switcher
    english: 'English',
    russian: 'Русский',

    // History dialog
    viewHistory: 'История чтения',
    readingHistory: 'История чтения',
    clearHistory: 'Очистить историю',
    noHistory: 'История чтения пуста',
  },
};

// Initialize i18n
i18n.use(initReactI18next).init({
  resources: {
    en: enResources,
    ru: ruResources,
  },
  lng: 'en', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

// Function to change the language
export const changeLanguage = (locale: string) => {
  return i18n.changeLanguage(locale);
};

// Hook to sync i18n with our Zustand store
export const useSyncLanguage = () => {
  const locale = useLocaleStore((state) => state.locale);

  // Update i18n language when locale changes in store
  if (i18n.language !== locale) {
    changeLanguage(locale);
  }

  return { i18n, locale };
};

export default i18n;
