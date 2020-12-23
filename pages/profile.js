import React, { useEffect } from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { message, Layout } from 'antd';
import Header from '../components/header';

const { Footer } = Layout;

const Profile = () => {

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
                <title>Profile Page</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            {isLogged ? (
                <div>
                    <Header selectedKey={["4"]}/>
                    <Footer className="pageFooter">Keep In Touch ©2020 Created by Yuan Wang</Footer>
                </div>
            ) : null}
        </div>
    )
}

export default Profile;