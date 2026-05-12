import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import krill from '../lang/krill.json';
import ru from '../lang/ru.json';
import uz from '../lang/uz.json';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            uz: { translation: uz },
            krill: { translation: krill },
            ru: { translation: ru },
        },
        lng: localStorage.getItem('lang') || 'uz',
        fallbackLng: 'uz',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
            caches: ['localStorage', 'cookie'],
        },
    });

export default i18n;
