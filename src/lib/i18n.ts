import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const ruResources = {
  translation: {
    appTitle: 'БиблияТека',
    selectBook: 'Выберите книгу',
    selectChapter: 'Выберите главу',
    oldTestament: 'Ветхий Завет',
    newTestament: 'Новый Завет',
    openInBible: 'Читать',
    failedToLoadAudio: 'Не удалось загрузить аудиофайл:',
    unknownError: 'Неизвестная ошибка',
    viewHistory: 'История чтения',
    readingHistory: 'История чтения',
    clearHistory: 'Очистить историю',
    noHistory: 'История чтения пуста',
    close: 'Закрыть',
  },
};

i18n.use(initReactI18next).init({
  resources: {
    ru: ruResources,
  },
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
