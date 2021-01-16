import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCookies } from "react-cookie";
import { message } from 'antd';
import dynamic from 'next/dynamic';

const DynamicHeader= dynamic(() => import('../components/header'))
const DynamicFooter = dynamic(() => import('../components/footer'))

const Chat = () => {

    const router = useRouter();
    const [cookie] = useCookies();

    useEffect(() => {
        if(!cookie['user']) {
            router.push('/');
            message.error("Your Session has expired please login first",[1]);
        }
    }, []);

    return (
        <div>
            <Head>
                <title>Chat</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            {cookie['user'] ? 
                <div className="main" >
                
                    <DynamicHeader selectedKey={["4"]} />
                    <div className="pageContainer" ></div>
                    <DynamicFooter />

                </div> : null
            }
        </div>
        
    )
}

export default Chat;