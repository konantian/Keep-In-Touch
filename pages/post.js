import React, { useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { message } from 'antd';

const DynamicHeader= dynamic(() => import('../components/header'))
const DynamicFooter = dynamic(() => import('../components/footer'))

const Post = () => {

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
                <title>New Post</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            {isLogged ? (
                <div>
                    <DynamicHeader selectedKey={["2"]}/>
                    <div className="newPost"></div>
                    <DynamicFooter />
                </div>
            ) : null}
        </div>
    )
}

export default Post;