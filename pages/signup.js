import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { message } from 'antd';
import { useRouter } from 'next/router';
import { useCookies } from "react-cookie";
import { SIGNUP_API } from '../constants/api';

const DynamicSignUpForm= dynamic(() => import('../components/signupForm'))
const DynamicFooter = dynamic(() => import('../components/footer'))

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
        axios.post(SIGNUP_API,
            {
                "username" : values.username,
                "name" : values.name,
                "email" : values.email,
                "password" : values.password
            }).then((res) => {
                setLoading(false);
                message.success(res.data['success'],[1]);
                localStorage.setItem('username', values.username);
                router.push('/');
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
                <div className="main" >
                    <div className="authContainer">
                        <DynamicSignUpForm loading={loading} setLoading={setLoading} onFinish={onFinish} />
                    </div>
                    <DynamicFooter />
                </div> : null
            }
        </div> 
    )
}

SignUp.getInitialProps = async (ctx) => {
    const cookie = ctx.req?.headers.cookie;
    return { cookies: cookie }
}