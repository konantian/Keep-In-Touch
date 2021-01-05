import React from 'react';
import { Menu, message } from 'antd';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useCookies } from "react-cookie";
import Link from 'next/link';
import axios from 'axios';
import PropTypes from 'prop-types';
import { FcOrgUnit } from 'react-icons/fc';
import {
    HomeOutlined,
    UserOutlined,
    FormOutlined,
    SearchOutlined,
    LogoutOutlined,
    MessageOutlined
} from "@ant-design/icons";
import { LOGOUT_API } from '../constants/api';

const Header = ({ selectedKey }) => {

    const router = useRouter();
    const dispatch = useDispatch();
    const username = useSelector((state) => state.username);
    const [ , , removeCookie] = useCookies();

    const handleLogout = async () => {
        removeCookie('user');
        const response = await axios.post(LOGOUT_API);
        dispatch(logout());
        message.success(response.data['success'],[0.5]);
        router.push('/')
    }

    return (
        <Menu className="headerMenu" theme="dark" mode="horizontal" selectedKeys={selectedKey}>
            <Menu.Item>
                <FcOrgUnit />
            </Menu.Item>    
            <Menu.Item key="1" icon={<HomeOutlined />}>
                <Link href="/home">Home</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<FormOutlined  />}>
                <Link href="/post/creat">Post</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<SearchOutlined />}>
                <Link href="/search">Search</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<MessageOutlined />}>
                <Link href="/chat">Chat</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<UserOutlined />}>
                <Link href={`/profile/${username}`}>Profile</Link>
            </Menu.Item>
            <Menu.Item key="6" icon={<LogoutOutlined />} >
                <a onClick={() => handleLogout()}>Logout</a>
            </Menu.Item>
      </Menu>
    )
}

Header.propTypes = {
    selectedKey: PropTypes.array.isRequired
};

export default Header;