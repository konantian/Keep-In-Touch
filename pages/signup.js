import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { message } from 'antd';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux'; 
import { SIGNUP_API } from '../constants/api';

const DynamicSignUpForm= dynamic(() => import('../components/signupForm'))

const SignUp = () =>{

    const router = useRouter();
    const isLogged = useSelector(state => state.isLogged);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(isLogged) {
            message.success("Welcome come back!");
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
                message.success(res.data['success']);
                localStorage.setItem('username', values.username);
                router.push('/');
            }).catch((err) => {
                setLoading(false);
                let msg = JSON.parse(err.response.request.response);
                message.error(msg['error']);
            })
      };

    return (
        <div className="authContainer">
            <Head>
                <title>Sign Up</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <DynamicSignUpForm loading={loading} setLoading={setLoading} onFinish={onFinish} />
        </div>
        
    )
}

export default SignUp;