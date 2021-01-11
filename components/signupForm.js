import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';

const SignUpForm = ({ onFinish, loading }) => {

    return (
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
                        <Button className="authButton" type="primary" shape="round" size="large" >Log in</Button>
                    </Link>
                </Form.Item>
                <Form.Item >
                    <Button className="authButton" loading={loading} type="primary" shape="round" size="large" htmlType="submit">Sign Up</Button>
                </Form.Item>
            </div>
        </Form>
    )
}


SignUpForm.propTypes = {
    onFinish: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
};

export default SignUpForm;