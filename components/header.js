import React from 'react';
import { Menu,message } from 'antd';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
    HomeOutlined,
    UserOutlined,
    BulbOutlined,
    SearchOutlined,
    LogoutOutlined,
} from "@ant-design/icons";

const Header = () => {

    const router = useRouter();

    const handleLogout = () => {
        dispatch(logout());
        message.success(
            `Remember to always keep in touch with others!`
        );
        router.push('/')
    }

    const dispatch = useDispatch();

    return (
        <Menu className="headerMenu" theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<HomeOutlined />}>
                <Link href="/home">Home</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<BulbOutlined  />}>
                <Link href="/home">Post</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<SearchOutlined />}>
                <Link href="/home">Search</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<UserOutlined />}>
                <Link href="/home">Profile</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<LogoutOutlined />} >
                <a onClick={() => handleLogout()}>Logout</a>
            </Menu.Item>
      </Menu>
    )
}

export default Header;