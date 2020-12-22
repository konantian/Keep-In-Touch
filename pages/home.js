import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { message, Layout } from 'antd';
import Header from '../components/header';

const { Footer } = Layout;

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
            {isLogged ? (
                <div>
                    <Header />
                    <Footer className="pageFooter">Keep In Touch ©2020 Created by Yuan Wang</Footer>
                </div>
            ) : null}
        </div>
    )

}

export default Home;