import React from 'react';
import '../styles/globals.css';
import '../styles/index.css';
import '../styles/signup.css';
import 'antd/dist/antd.css';
import { wrapper } from '../redux/store';
import { useStore } from 'react-redux';
import { Spin } from 'antd';
import { PersistGate } from 'redux-persist/integration/react';
import type { AppProps } from 'next/app';

const MyApp = ({Component, pageProps} : AppProps) => {
    const store = useStore((state) => state);
    return(
        <PersistGate persistor={store.__persistor} loading={<div className="loader" ><Spin size="large" tip="Loading ... "/></div>}>
            <Component {...pageProps} />
        </PersistGate>
    )
};

export default wrapper.withRedux(MyApp);