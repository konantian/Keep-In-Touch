import React, { useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import useSWR from 'swr';
import { message, Layout, Spin} from 'antd';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Header from '../components/header';
import PostList from '../components/postList';
import { VISIBLE_POSTS_API }from '../constants/api';

const { Footer } = Layout;

const Home = () => {

    const router = useRouter();
    const isLogged = useSelector((state) => state.isLogged);
    const username = useSelector((state) => state.username);

    useEffect(() => {
        if (!isLogged) {
            message.error('Please login first');
            router.push('/');
        };
    }, []);

    const fetchVisiblePosts =  async () => {
        const response = await axios.get(VISIBLE_POSTS_API(username));
        return response.data.posts;
    }

    const {data : visiblePosts, error} = useSWR(username, fetchVisiblePosts);

    return (
        <div>
            <Head>
                <title>Home</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            {isLogged ? (
                <div>
                    <Header selectedKey={["1"]} />
                    <div className="postList" >
                        {!visiblePosts ? <Spin tip="Loading posts ... " /> : <PostList posts={visiblePosts} />}
                    </div>
                    <Footer className="pageFooter">Keep In Touch ©2020 Created by Yuan Wang</Footer>
                </div>
            ) : null}
        </div>
    )

}


export default Home;