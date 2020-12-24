import React from 'react';
import { Menu, message } from 'antd';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import PropTypes from 'prop-types';
import {
    HomeOutlined,
    UserOutlined,
    EditOutlined,
    SearchOutlined,
    LogoutOutlined,
} from "@ant-design/icons";

const Header = ({ selectedKey }) => {

    const router = useRouter();
    const dispatch = useDispatch();
    const username = useSelector((state) => state.username);

    const handleLogout = () => {
        dispatch(logout());
        message.success(
            `Remember to always keep in touch with others!`
        );
        router.push('/')
    }

    return (
        <Menu className="headerMenu" theme="dark" mode="horizontal" selectedKeys={selectedKey}>
            <Menu.Item key="1" icon={<HomeOutlined />}>
                <Link href="/home">Home</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<EditOutlined  />}>
                <Link href="/post">Post</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<SearchOutlined />}>
                <Link href="/search">Search</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<UserOutlined />}>
                <Link href={`/profile/${username}`}>Profile</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<LogoutOutlined />} >
                <a onClick={() => handleLogout()}>Logout</a>
            </Menu.Item>
      </Menu>
    )
}

Header.propTypes = {
    selectedKey: PropTypes.array.isRequired
};

export default Header;