import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import uz from './uz';
import ru from './ru';
import en from './en';
import krill from './krill';

const resources = {
  uz: { translation: uz },
  ru: { translation: ru },
  en: { translation: en },
  krill: { translation: krill },
};

const getLocale = () => {
  const code = Localization.getLocales()?.[0]?.languageCode || 'uz';
  return resources[code as keyof typeof resources] ? code : 'uz';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getLocale(),
    fallbackLng: 'uz',
    interpolation: {
      escapeValue: false,
    },
  } as any);

export default i18n;
