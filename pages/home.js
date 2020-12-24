import React, { useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { message, Spin} from 'antd';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { VISIBLE_POSTS_API }from '../constants/api';

const DynamicPostList= dynamic(() => import('../components/postList'))
const DynamicHeader= dynamic(() => import('../components/header'))
const DynamicFooter = dynamic(() => import('../components/footer'))

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
                    <DynamicHeader selectedKey={["1"]} />
                    <div className="postList" >
                        {!visiblePosts ? <div className="loader" ><Spin size="large" tip="Loading posts ... "/></div> 
                            : <DynamicPostList posts={visiblePosts} />}
                    </div>
                    <DynamicFooter />
                </div>
            ) : null}
        </div>
    )

}


export default Home;