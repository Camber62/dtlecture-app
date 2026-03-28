import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import HttpBackend from 'i18next-http-backend';

import enTranslation from './en.json';
import ruTranslation from './ru.json';
import hiTranslation from './hi.json';

const resources = {
    en: { translation: enTranslation.translation },
    ru: { translation: ruTranslation.translation },
    hi: { translation: hiTranslation.translation },
};

i18n
    // .use(HttpBackend)
    .use(initReactI18next)
    .init({
        resources,
        // lng: 'en',
        fallbackLng: 'ru',
        interpolation: {
            escapeValue: false,
        },
        // backend: {
        //     loadPath: 'https://api/lang/{{lng}}',
        // },
        // debug: true,
    });

export default i18n;