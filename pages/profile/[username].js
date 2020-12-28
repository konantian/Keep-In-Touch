import React, { useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { message, Divider, Spin} from 'antd';
import { USER_BY_USERNAME } from '../../constants/api';

const DynamicPostList = dynamic(() => import('../../components/postList'))
const DynamicHeader = dynamic(() => import('../../components/header'))
const DynamicFooter = dynamic(() => import('../../components/footer'))
const DynamicProfileHeader = dynamic(() => import('../../components/profileHeader'))

const Profile = () => {

    const router = useRouter();
    const { username }  = router.query;
    const isLogged = useSelector((state) => state.isLogged);
    const currentUser = useSelector((state) => state.username);
    
    useEffect(() => {
        if (!isLogged) {
            message.error('Please login first');
            router.push('/');
        };
    }, []);

    const getProfile = async ( url ) => {
        const response = await axios.get(url,{
            params: {
                currentUser : currentUser
            }
        });
        response.data.posts.sort((a,b) => {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        })
        return response.data;
    }

    const {data : profile, error } = useSWR(username !== undefined ? USER_BY_USERNAME(username) : null,getProfile);

    return (
        <div className="main" >
            <Head>
                <title>{username === currentUser ? "Profile" : `${username}'s Profile`}</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <DynamicHeader selectedKey={["5"]}/>
            <div className="pageContainer">
            {!profile ? 
                <div className="loader" >
                    <Spin size="large" tip="Loading user's profile ... "/>
                </div> : 
                <div>
                    <DynamicProfileHeader username={username} profile={profile} />
                    <Divider />
                    <DynamicPostList posts={profile.posts} api={USER_BY_USERNAME(username)} />
                </div>
            }
            </div>
            <DynamicFooter />
        </div>
    )
}

export default Profile;