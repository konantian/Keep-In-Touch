import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { message } from 'antd';
import { useDispatch } from 'react-redux'; 
import { useCookies } from "react-cookie";
import { login, setUsername, setUserId } from '../redux/actions';
import { LOGIN_API } from '../constants/api';

const DynamicLoginForm= dynamic(() => import('../components/loginForm'))
const DynamicFooter = dynamic(() => import('../components/footer'))

export default function Login ({ cookies }){

    const formRef = useRef(null);
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [cookie, setCookie] = useCookies(["user"]);

    useEffect(() => {
        if(cookies && cookie['user']) {
            router.push('/home');
        }
        const username = localStorage.getItem('username');
        if(username && formRef.current){
            formRef.current.setFieldsValue({username : username});
            localStorage.removeItem('username');
        } 
    },[cookies])

    const onFinish = values => {
        axios.post(LOGIN_API,
            {
                "username" : values.username,
                "password" : values.password
            }).then((res) => {
                setLoading(false);
                dispatch(login());
                dispatch(setUsername(values.username));
                dispatch(setUserId(res.data.userId));
                const user = { username : values.username, 
                               userId : res.data.userId
                            };
                setCookie("user", JSON.stringify(user), {
                    path: "/",
                    maxAge: 3600,
                    sameSite: true,
                });
                router.push('/home');
            }).catch((err) => {
                setLoading(false);
                let msg = JSON.parse(err.response.request.response);
                message.error(msg['error']);
            })
      };

    return (
        <div>
            <Head>
                <title>Login</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            {!cookies ? 
                <div className="main">
                    <div className="authContainer">
                        <DynamicLoginForm 
                            loading={loading} 
                            setLoading={setLoading} 
                            formRef={formRef} 
                            onFinish={onFinish}
                        />
                    </div>
                    <DynamicFooter />
                </div> : null
            }
        </div>
    )
}

Login.getInitialProps = async (ctx) => {
    const cookie = ctx.req?.headers.cookie;
    return { cookies: cookie }
}