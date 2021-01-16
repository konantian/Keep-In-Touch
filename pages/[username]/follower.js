import React, { useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { useCookies } from "react-cookie";
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Spin, message } from  'antd';
import { FOLLOWER_API } from '../../constants/api';

const DynamicHeader = dynamic(() => import('../../components/header'))
const DynamicFooter = dynamic(() => import('../../components/footer'))
const DynamicFollower = dynamic(() => import('../../components/followerList'))

const Follower = () => {

    const router = useRouter();
    const currentUser = useSelector((state) => state.username)
    const { username }  = router.query;
    const [cookie] = useCookies();

    useEffect(() => {
        if(!cookie['user']) {
            router.push('/');
            message.error("Your Session has expired please login first",[1]);
        }
    }, []);

    const getFollower = async ( url ) => {
        const config = {
            withCredentials: true,
            params: {
                currentUser : currentUser,
            },
        }
        const response = await axios.get(url, config);
        return response.data.followers;
    }

    const { data : follower, error } = useSWR(username !== undefined ? FOLLOWER_API(username) : null, getFollower);

    return (
        <div>
            <Head>
                <title>Follower</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            {cookie['user'] ? 
                <div className="main" >
                
                    <DynamicHeader selectedKey={["5"]}/>
                    <div className="pageContainer" >
                        {!follower ? 
                        <div className="loader" >
                            <Spin size="large" tip="Loading user's follower ... "/>
                        </div> : <DynamicFollower follower={follower} api={FOLLOWER_API(username)} /> }
                    </div>
                    <DynamicFooter />
                </div> : null
            }
        </div>
    )
}

export default Follower;