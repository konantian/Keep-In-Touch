import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Form, Input, Button,message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux'; 
import { login, setUsername } from '../redux/actions';
import { LOGIN_API } from '../constants/api';

const Login = () => {

    const formRef = useRef(null);
    const router = useRouter();
    const dispatch = useDispatch();
    const isLogged = useSelector(state => state.isLogged);
    const username = useSelector(state => state.username);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(isLogged) {
            message.success(`Welcome come back ${username}!`);
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
                message.success(res.data['success']);
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

            <Form className="form" onFinish={onFinish} ref={formRef} >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{required: true,message: 'Please input your username!',}]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true,message: 'Please input your password!',}]}
                >
                    <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
                </Form.Item>
                <div className="loginButtons">
                    <Form.Item >
                        <Button className="loginButton" loading={loading} onClick={() => setLoading(true)} type="primary" shape="round" size="large" htmlType="submit">Log In</Button>
                    </Form.Item>
                    <Form.Item >
                        <Link href="/signup">
                            <Button className="loginButton" type="primary" shape="round" size="large" >Sign Up</Button>
                        </Link>
                    </Form.Item>
                </div>
            </Form>
        </div>
        
    )
}

export default Login;