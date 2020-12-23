import React, { useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import useSWR from 'swr';
import { message, Layout, Spin} from 'antd';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Header from '../../components/header';
import PostList from '../../components/postList';
import { POSTS_BY_TAG } from '../../constants/api';

const { Footer } = Layout;

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
            <Header selectedKey={["1"]} />
            <div className="postList">
                {!posts ? <Spin tip="Loading posts ..." /> :
                    <PostList posts={posts} />
                }
            </div>
            <Footer className="pageFooter">Keep In Touch ©2020 Created by Yuan Wang</Footer>
        </div>
    )
}

export default PostByTag;