import React, { useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { message, Spin } from 'antd';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useCookies } from "react-cookie";
import { VISIBLE_POSTS_API }from '../constants/api';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { openNotificationWithIcon } from '../utils/notification';

const client = new W3CWebSocket('wss://echo.websocket.org');
const DynamicPostList= dynamic(() => import('../components/postList'))
const DynamicHeader= dynamic(() => import('../components/header'))
const DynamicFooter = dynamic(() => import('../components/footer'))

export default function Home(){

    const router = useRouter();
    const username = useSelector((state) => state.username);
    const [cookie] = useCookies();

    useEffect(() => {
        if(!cookie['user']) {
            router.push('/');
            message.error("Your Session has expired please login first",[1]);
        }

        client.onopen = () => {
            console.log("WebSocket connected");
        }        

        client.onmessage = ( message ) => {
            const data = JSON.parse(message.data);
            console.log(data.user);
            console.log(username)
            if(data.user === username){
                
                openNotificationWithIcon('info','New follower', `${data.follower} just followed you`);
            }
        }
    }, []);

    const fetchVisiblePosts =  async ( url ) => {
        const response = await axios.get(url, {withCredentials: true});
        response.data.posts.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        })
        return response.data.posts;
    }

    const {data : visiblePosts, error} = useSWR(username !== null ? VISIBLE_POSTS_API(username) : null, fetchVisiblePosts);

    return (

        <div>
            <Head>
                <title>Home</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            {cookie['user'] ? 
                <div className="main" >
                    <DynamicHeader selectedKey={["1"]} />
                    <div className="pageContainer" >
                        {!visiblePosts ? <div className="loader" ><Spin size="large" tip="Loading posts ... "/></div> 
                            : <DynamicPostList posts={visiblePosts} api={VISIBLE_POSTS_API(username)} />}
                    </div>
                    <DynamicFooter />
                </div> : null
            }
        </div>
    )
}