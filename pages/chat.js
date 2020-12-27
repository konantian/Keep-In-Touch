import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const DynamicHeader= dynamic(() => import('../components/header'))
const DynamicFooter = dynamic(() => import('../components/footer'))

const Chat = () => {

    return (
        <div className="main" >
            <Head>
                <title>Message</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <DynamicHeader selectedKey={["4"]} />
            <div className="pageContainer" ></div>
            <DynamicFooter />
        </div>
    )
}

export default Chat;