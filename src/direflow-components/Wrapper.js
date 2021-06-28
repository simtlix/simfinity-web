import React, {useState} from 'react';
import {IntlProvider} from 'react-intl';
import en from "../lang/eng.json"
import App from './App'
import PropTypes from "prop-types";


export const Context = React.createContext();

const local = navigator.language;

let lang = en;
if (local === 'en') {
    lang = en;
}

const Wrapper = (props) => {
    const [locale, setLocale] = useState(local);

    const [messages, setMessages] = useState(lang);

    function selectLanguage(e) {
        const newLocale = e.target.value;
        setLocale(newLocale);
        if (newLocale === 'en') {
            setMessages(en);
        } 
    }

    return (
        <Context.Provider value = {{locale, selectLanguage}}>
            <IntlProvider messages={messages} locale={locale}>
                <App url={props.url}></App>
            </IntlProvider>
        </Context.Provider>

    );
}

Wrapper.defaultProps = {
    url: "",
  };
  
Wrapper.propTypes = {
    url: PropTypes.string,
  };

export default Wrapper;