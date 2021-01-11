import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { message } from 'antd';
import { useRouter } from 'next/router';
import { useCookies } from "react-cookie";
import { SIGNUP_API } from '../constants/api';

const DynamicSignUpForm= dynamic(() => import('../components/signupForm'))

export default function SignUp ({ cookies }){

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [cookie] = useCookies();

    useEffect(() => {
        if(cookies && cookie['user']) {
            router.push('/home');
        }
    },[])

    const onFinish = values => {
        setLoading(true);
        axios.post(SIGNUP_API,
            {
                "username" : values.username,
                "name" : values.name,
                "email" : values.email,
                "password" : values.password
            }).then((res) => {
                message.success(res.data['success'],[1]);
                localStorage.setItem('username', values.username);
                router.push('/');
                setLoading(false);
            }).catch((err) => {
                setLoading(false);
                let msg = JSON.parse(err.response.request.response);
                message.error(msg['error']);
            })
      };

    return (
        <div>
            <Head>
                <title>Sign Up</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            {!cookies ? 
                <div className="loginPage" >
                    <img
                        src="/background.png"
                        alt="Background Picture"
                        className="backgroundImg"
                    />
                    <div className="authContainer">
                        <DynamicSignUpForm 
                            loading={loading} 
                            onFinish={onFinish} 
                        />
                    </div>
                </div> : null
            }
        </div> 
    )
}

SignUp.getInitialProps = async (ctx) => {
    const cookie = ctx.req?.headers.cookie;
    return { cookies: cookie }
}