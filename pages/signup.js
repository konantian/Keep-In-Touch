import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { Form, Input, Button,message } from 'antd';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux'; 
import { SIGNUP_API } from '../constants/api';

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
            <Form className="form" onFinish={onFinish}>
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{required: true,message: 'Please input your username!',}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{required: true, type : 'email', message: 'Please input valid email!',}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{required: true,message: 'Please input your name!',}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true,message: 'Please input your password!',}]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="Confirm"
                    dependencies={['password']}
                    hasFeedback
                    rules={[{required: true,message: 'Please confirm your password!',},
                    ({ getFieldValue }) => ({
                        validator(rule, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject('Two passwords not match!');
                        },
                    }),]}
                >
                    <Input.Password  />
                </Form.Item>
                <div className="loginButtons">
                    <Form.Item >
                        <Link href="/">
                            <Button className="loginButton" type="primary" shape="round" size="large" >Log in</Button>
                        </Link>
                    </Form.Item>
                    <Form.Item >
                        <Button className="signButton" loading={loading} type="primary" onClick={() => setLoading(true)} shape="round" size="large" htmlType="submit">Sign Up</Button>
                    </Form.Item>
                </div>
            </Form>
        </div>
        
    )
}

export default SignUp;