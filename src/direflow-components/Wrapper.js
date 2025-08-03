import React, { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import en from '../lang/eng.json';
import App from './App';
import PropTypes from 'prop-types';
import './App.css';

export const Context = React.createContext();

const local = navigator.language.split(/[-_]/)[0]; // language without region code

let lang = { ...en };

const Wrapper = (props) => {
  const [locale, setLocale] = useState(local);

  const [messages, setMessages] = useState(lang);

  const getData = () => {
    fetch(props.lang || `./lang/${locale}.json`)
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setMessages((lang) => ({ ...lang, ...myJson }));
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  function selectLanguage(e) {
    const newLocale = e.target.value;
    setLocale(newLocale);
    if (newLocale === 'en') {
      setMessages(en);
    }
  }

  return (
    <Context.Provider value={{ locale, selectLanguage }}>
      <IntlProvider messages={messages} locale={locale}>
        <App url={props.url}></App>
      </IntlProvider>
    </Context.Provider>
  );
};

Wrapper.defaultProps = {
  url: '',
  lang: '',
};

Wrapper.propTypes = {
  url: PropTypes.string,
  lang: PropTypes.string,
};

export default Wrapper;
