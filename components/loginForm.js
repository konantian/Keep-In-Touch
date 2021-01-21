import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import styles from './LoginForm.module.css';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const LoginForm = ({ onFinish, formRef, loading }) => {

    const buttonStyle = {height : "50px", fontSize : "20px"};

    return (
        <div className={styles.container} >
            <span className={styles.promptText} >Welcome Back!</span>
            <Form className={styles.loginForm} onFinish={onFinish} ref={formRef} >
                <Form.Item
                    name="email"
                    rules={[{required: true, type : 'email', message: 'Please input valid email!',}]}
                >
                    <Input className={styles.inputField} size="large" placeholder="Email" prefix={<UserOutlined />} />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{required: true,message: 'Please input your password!',}]}
                >
                    <Input.Password className={styles.inputField} size="large" placeholder="Password" prefix={<LockOutlined />} />
                </Form.Item>
                <Form.Item >
                    <Button className={styles.loginButton} style={buttonStyle} loading={loading} type="primary" shape="round" size="large" htmlType="submit">Log In</Button>
                </Form.Item>
            </Form>
            <div className={styles.signupNav} >
                <span>Don't have an account?</span>
                <Link href="/signup">
                    <Button className={styles.signupButton} style={buttonStyle} size="large" shape="round">Sign Up</Button>
                </Link>
            </div>
        </div>
    )
}

LoginForm.propTypes = {
    onFinish: PropTypes.func.isRequired,
    formRef : PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
};

export default LoginForm;