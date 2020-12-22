import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { message, Layout } from 'antd';
import Header from '../components/header';

const { Footer } = Layout;

const Post = () => {

    const router = useRouter();
    const isLogged = useSelector((state) => state.isLogged);

    useEffect(() => {
        if (!isLogged) {
            message.error('Please login first');
            router.push('/');
        };
    }, []);

    return (
        <div>
            {isLogged ? (
                <div>
                    <Header selectedKey={["2"]}/>
                    <Footer className="pageFooter">Keep In Touch ©2020 Created by Yuan Wang</Footer>
                </div>
            ) : null}
        </div>
    )
}

export default Post;