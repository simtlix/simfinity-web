import { IntlProvider } from 'react-intl';
import { ConfigProvider } from 'antd';
import en from '../src/lang/eng.json';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const locale = 'en';
  const messages = en;

  return (
    <IntlProvider messages={messages} locale={locale}>
      <ConfigProvider>
        <Component {...pageProps} />
      </ConfigProvider>
    </IntlProvider>
  );
}

export default MyApp; 