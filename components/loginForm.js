import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const LoginForm = ({ onFinish, formRef, loading }) => {


    return (
        <div>
            <span className="loginPrompt" >Welcome Back!</span>
            <Form style={{marginTop : "60px"}} onFinish={onFinish} ref={formRef} >
                <Form.Item
                    name="username"
                    style={{width : "500px"}}
                    rules={[{required: true,message: 'Please input your username!',}]}
                >
                    <Input style={{borderRadius: "15px"}} size="large" placeholder="Username" prefix={<UserOutlined className="site-form-item-icon" />} />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{required: true,message: 'Please input your password!',}]}
                >
                    <Input.Password style={{borderRadius: "15px"}} size="large" placeholder="Password" prefix={<LockOutlined className="site-form-item-icon" />} />
                </Form.Item>
                <Form.Item >
                    <Button className="authButton" style={{height : "50px", fontSize : "20px"}} loading={loading} type="primary" shape="round" size="large" htmlType="submit">Log In</Button>
                </Form.Item>
            </Form>
            <div className="signupNav" >
                <span>Don't have an account?</span>
                <Link href="/signup">
                    <Button style={{color : '#1890ff', height : "50px", width : "120px", fontSize : "20px"}} size="large" shape="round">Sign Up</Button>
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