import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions';
import Link from 'next/link';
import { Button, message } from 'antd';

const Logout = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        message.success(
            `Remember to always keep in touch with others!`
        );
    };

    return (
        <div className="logoutContainer">
            <Link href="/">
                <Button
                    className="logoutButton"
                    type="primary"
                    size="large"
                    shape="round"
                    onClick={handleLogout}
                >
                    Log Out
                </Button>
            </Link>
        </div>
    );
};

export default Logout;