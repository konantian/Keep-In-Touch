import React, { useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { message, Layout, Spin} from 'antd';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { POSTS_BY_TAG } from '../../constants/api';

const { Footer } = Layout;
const DynamicPostList= dynamic(() => import('../../components/postList'))
const DynamicHeader= dynamic(() => import('../../components/Header'))

const PostByTag = () => {

    const isLogged = useSelector((state) => state.isLogged);
    const router = useRouter();
    const { tag } = router.query;

    useEffect(() => {
        if (!isLogged) {
            message.error('Please login first');
            router.push('/');
        };
    }, []);

    const fetchPosts =  async () => {
        const response = await axios.get(POSTS_BY_TAG(tag));
        return response.data.posts;
    }

    const {data : posts, error} = useSWR(tag, fetchPosts);

    return (
        <div>
            <Head>
                <title>{`${tag} Posts`}</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <DynamicHeader selectedKey={["1"]} />
            <div className="postList">
                {!posts ? <div className="loader" ><Spin size="large" tip="Loading posts ... "/></div> :
                    <DynamicPostList posts={posts} />
                }
            </div>
            <Footer className="pageFooter">Keep In Touch ©2020 Created by Yuan Wang</Footer>
        </div>
    )
}

export default PostByTag;