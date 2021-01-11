import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const LoginForm = ({ onFinish, formRef, loading }) => {


    return (
        <Form onFinish={onFinish} ref={formRef} >
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
                    <Button className="authButton" loading={loading} type="primary" shape="round" size="large" htmlType="submit">Log In</Button>
                </Form.Item>
                <Form.Item >
                    <Link href="/signup">
                        <Button className="authButton" type="primary" shape="round" size="large" >Sign Up</Button>
                    </Link>
                </Form.Item>
            </div>
        </Form>
    )
}

LoginForm.propTypes = {
    onFinish: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    formRef : PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
};

export default LoginForm;