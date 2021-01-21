import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styles from './SignupForm.module.css';
import { Form, Input, Button } from 'antd';

const SignUpForm = ({ onFinish, loading }) => {

    const buttonStyle = {height : "50px", fontSize : "20px"};

    return (
        <div className={styles.container} >
            <span className={styles.promptText} >Let's get started!</span>
            <Form className={styles.signupForm} onFinish={onFinish}>
                <Form.Item
                    name="username"
                    rules={[{required: true,message: 'Please input your username!',}]}
                >
                    <Input className={styles.inputField} size="large" placeholder="Username"/>
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[{required: true, type : 'email', message: 'Please input valid email!',}]}
                >
                    <Input className={styles.inputField} size="large" placeholder="Email"/>
                </Form.Item>
                <Form.Item
                    name="name"
                    rules={[{required: true,message: 'Please input your name!',}]}
                >
                    <Input className={styles.inputField} size="large" placeholder="Name" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{required: true,message: 'Please input your password!',}]}
                >
                    <Input.Password className={styles.inputField} size="large" placeholder="Password"/>
                </Form.Item>
                <Form.Item
                    name="confirm"
                    hasFeedback
                    dependencies={['password']}
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
                    <Input.Password className={styles.inputField} size="large" placeholder="Re-enter Password"/>
                </Form.Item>
                <Form.Item >
                    <Button className={styles.signupButton} style={buttonStyle} loading={loading} type="primary" shape="round" size="large" htmlType="submit">Sign Up</Button>
                </Form.Item>
            </Form>
            <div className={styles.loginNav}>
                <span>Already have an account?</span>
                <Link href="/">
                    <Button className={styles.loginButton} style={buttonStyle} size="large" shape="round">Log In</Button>
                </Link>
            </div>
        </div>
        
    )
}


SignUpForm.propTypes = {
    onFinish: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
};

export default SignUpForm;