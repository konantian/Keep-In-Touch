import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';

const SignUpForm = ({ onFinish, loading }) => {

    return (
        <div>
            <span className="loginPrompt" >Let's get started!</span>
            <Form style={{marginTop : "60px"}} onFinish={onFinish}>
                <Form.Item
                    name="username"
                    rules={[{required: true,message: 'Please input your username!',}]}
                >
                    <Input style={{borderRadius: "15px"}} size="large" placeholder="Username"/>
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[{required: true, type : 'email', message: 'Please input valid email!',}]}
                >
                    <Input  style={{borderRadius: "15px"}} size="large" placeholder="Email"/>
                </Form.Item>
                <Form.Item
                    name="name"
                    rules={[{required: true,message: 'Please input your name!',}]}
                >
                    <Input style={{borderRadius: "15px"}} size="large" placeholder="Name" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{required: true,message: 'Please input your password!',}]}
                >
                    <Input.Password  style={{borderRadius: "15px"}} size="large" placeholder="Password"/>
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
                    <Input.Password style={{borderRadius: "15px"}} size="large" placeholder="Re-enter Password"/>
                </Form.Item>
                <Form.Item >
                    <Button className="authButton" style={{height : "50px", fontSize : "20px"}} loading={loading} type="primary" shape="round" size="large" htmlType="submit">Sign Up</Button>
                </Form.Item>
            </Form>
            <div className="signupNav" >
                <span>Already have an account?</span>
                <Link href="/">
                    <Button style={{color : '#1890ff', height : "50px", width : "120px", fontSize : "20px"}} size="large" shape="round">Log In</Button>
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