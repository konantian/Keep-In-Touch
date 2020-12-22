import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { message } from 'antd';

const Home = () => {

    const router = useRouter();
    const isLogged = useSelector((state) => state.isLogged);

    useEffect(() => {
        if (!isLogged) {
            message.error('Please login first');
            router.push('/');
        };
    }, []);

    return (
        <div>
            <Head>
                <title>Home Page</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
        </div>
    )

}

export default Home;