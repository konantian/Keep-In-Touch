import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux'; 
import { login, setUsername } from '../redux/actions';
import { LOGIN_API } from '../constants/api';

const DynamicLoginForm= dynamic(() => import('../components/loginForm'))

const Login = () => {

    const formRef = useRef(null);
    const router = useRouter();
    const dispatch = useDispatch();
    const isLogged = useSelector(state => state.isLogged);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(isLogged) {
            router.push('/home');
        }else{
            const username = localStorage.getItem('username');
            if(username){
                formRef.current.setFieldsValue({username : username});
                localStorage.removeItem('username');
            }
        }   
    },[])

    const onFinish = values => {
        axios.post(LOGIN_API,
            {
                "username" : values.username,
                "password" : values.password
            }).then((res) => {
                setLoading(false);
                dispatch(login());
                dispatch(setUsername(values.username));
                router.push('/home');
            }).catch((err) => {
                setLoading(false);
                let msg = JSON.parse(err.response.request.response);
                message.error(msg['error']);
            })
      };

    return (
        <div className="authContainer">
            <Head>
                <title>Login</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            {isLogged ? null :
                <DynamicLoginForm 
                    loading={loading} 
                    setLoading={setLoading} 
                    formRef={formRef} 
                    onFinish={onFinish}
                />
            }
        </div>
        
    )
}

export default Login;