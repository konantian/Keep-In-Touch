import React from 'react';
import Head from 'next/head';
import axios from 'axios';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Spin } from  'antd';
import { FOLLOWING_API } from '../../constants/api';

const DynamicHeader = dynamic(() => import('../../components/header'))
const DynamicFooter = dynamic(() => import('../../components/footer'))
const DynamicFollowing = dynamic(() => import('../../components/followingList'))

const Following = () => {

    const router = useRouter();
    const { username }  = router.query;

    const getFollower = async ( url ) => {
        const response = await axios.get(url,  {withCredentials: true});
        return response.data.following;
    }

    const { data : following, error } = useSWR(username !== undefined ? FOLLOWING_API(username) : null, getFollower);

    return (
        <div className="main" >
            <Head>
                <title>Following</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <DynamicHeader selectedKey={["5"]}/>
            <div className="pageContainer" >
                {!following ? 
                <div className="loader" >
                    <Spin size="large" tip="Loading user's following ... "/>
                </div> : <DynamicFollowing following={following} api={FOLLOWING_API(username)} username={username} />}
            </div>
            <DynamicFooter />
        </div>
    )

}

export default Following;