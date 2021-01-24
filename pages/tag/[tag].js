import React, { useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { message, Spin } from 'antd';
import { useCookies } from "react-cookie";
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { POSTS_BY_TAG } from '../../constants/api';
import socket from '../../lib/socket-context';
import { openNotificationWithIcon } from '../../utils/notification';

const DynamicPostList= dynamic(() => import('../../components/postList'))
const DynamicHeader= dynamic(() => import('../../components/header'))
const DynamicFooter = dynamic(() => import('../../components/footer'))

const PostByTag = () => {

    const router = useRouter();
    const { tag } = router.query;
    const currentUser = useSelector((state) => state.username);
    const [cookie] = useCookies();

    useEffect(() => {
        if(!cookie['user']) {
            router.push('/');
            message.error("Your Session has expired please login first",[1]);
        }
        socket.on("follow", data => {
            if(data.user === currentUser){
                openNotificationWithIcon('info','New follower', `${data.follower} just followed you`);
            }
        });

        return () => socket.off('follow');
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
        <div>
            <Head>
                <title>{`${tag} Posts`}</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            {cookie['user'] ? 
                <div className="main" >
                    <DynamicHeader selectedKey={["1"]} />
                    <div className="pageContainer">
                        {!posts ? <div className="loader" ><Spin size="large" tip="Loading posts ... "/></div> :
                            <DynamicPostList posts={posts} api={POSTS_BY_TAG(tag)} />
                        }
                    </div>
                    <DynamicFooter />
                </div> : null
            }
        </div>
    )
}

export default PostByTag;