import React from 'react';
import Head from 'next/head';
import axios from 'axios';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Spin } from  'antd';
import {  FOLLOWER_API  } from '../../constants/api';

const DynamicHeader = dynamic(() => import('../../components/header'))
const DynamicFooter = dynamic(() => import('../../components/footer'))
const DynamicFollower = dynamic(() => import('../../components/followerList'))

const Follower = () => {

    const router = useRouter();
    const { username }  = router.query;

    const getFollower = async ( url ) => {
        const response = await axios.get(url);
        return response.data.followers;
    }

    const { data : follower, error } = useSWR(username !== undefined ? FOLLOWER_API(username) : null, getFollower);

    return (
        <div className="main" >
            <Head>
                <title>Follower</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <DynamicHeader selectedKey={["5"]}/>
            <div className="pageContainer" >
                {!follower ? 
                <div className="loader" >
                    <Spin size="large" tip="Loading user's follower ... "/>
                </div> : <DynamicFollower follower={follower} username={username} api={FOLLOWER_API(username)} /> }
            </div>
            <DynamicFooter />
        </div>
    )

}

export default Follower;