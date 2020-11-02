import '../styles/index.css';
import type { AppProps } from 'next/app';
import { FC, useEffect } from 'react';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';

const queryCache = new QueryCache();

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    const setFillHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', setFillHeight, { passive: true });

    setFillHeight();

    return () => window.removeEventListener('resize', setFillHeight);
  }, []);

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </ReactQueryCacheProvider>
  );
};

export default MyApp;
