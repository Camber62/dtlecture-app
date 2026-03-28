import React from "react";
import {createRoot} from "react-dom/client";
import {Main} from './Main';
import {store} from "./store";
import {Provider} from "react-redux";
import "@styles/style.scss"
import "@styles/theme.scss"
import './i18n/i18n'
import i18n from "i18next";

i18n.changeLanguage(document.documentElement.lang)
createRoot(document.getElementById('mod-dtlecture-root')).render(
            <Provider store={store}>
                <div className='light-mode'>
                    <Main/>
                </div>
            </Provider>
)