import React, { useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { message, Spin} from 'antd';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { POSTS_BY_TAG } from '../../constants/api';

const DynamicPostList= dynamic(() => import('../../components/postList'))
const DynamicHeader= dynamic(() => import('../../components/header'))
const DynamicFooter = dynamic(() => import('../../components/footer'))

const PostByTag = () => {

    const router = useRouter();
    const { tag } = router.query;
    const isLogged = useSelector((state) => state.isLogged);
    const currentUser = useSelector((state) => state.username);

    useEffect(() => {
        if (!isLogged) {
            message.error('Please login first');
            router.push('/');
        };
    }, []);

    const fetchPosts =  async ( url ) => {
        const config = {
            withCredentials: true,
            params: {
                currentUser : currentUser
            },
          }
        const response = await axios.get(url,config);
        response.data.posts.sort((a, b) => {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        })
        return response.data.posts;
    }

    const {data : posts, error} = useSWR(tag !== undefined ? POSTS_BY_TAG(tag) : null, fetchPosts);

    return (
        <div className="main" >
            <Head>
                <title>{`${tag} Posts`}</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <DynamicHeader selectedKey={["1"]} />
            <div className="pageContainer">
                {!posts ? <div className="loader" ><Spin size="large" tip="Loading posts ... "/></div> :
                    <DynamicPostList posts={posts} api={POSTS_BY_TAG(tag)} />
                }
            </div>
            <DynamicFooter />
        </div>
    )
}

export default PostByTag;