import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { message, Layout, Divider, Spin} from 'antd';
import { USER_BY_USERNAME  } from '../../constants/api';

const { Footer } = Layout;

const DynamicPostList= dynamic(() => import('../../components/postList'))
const DynamicHeader= dynamic(() => import('../../components/Header'))
const DynamicProfileHeader = dynamic(() => import('../../components/profileHeader'))

const Profile = () => {

    const router = useRouter();
    const [username, setUsername] = useState(null);
    const [profile, setProfile] = useState(null);
    const isLogged = useSelector((state) => state.isLogged);
    
    useEffect(() => {
        if (!isLogged) {
            message.error('Please login first');
            router.push('/');
        };
    }, []);

    useEffect(() => {
        if (router.asPath !== router.route) {
            setUsername(router.query.username);
            getProfile(router.query.username);
        }
    }, [router])

    const getProfile = async (username) => {
        const response = await axios.get(USER_BY_USERNAME(username));
        setProfile(response.data);
    }

    return (
        <div>
            <Head>
                <title>Profile</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            {isLogged ? (
                <div>
                    <DynamicHeader selectedKey={["4"]}/>
                    <div className="profileHeader">
                    {!profile ? <div className="loader" ><Spin size="large" tip="Loading user's profile ... "/></div>: 
                        <div>
                            <DynamicProfileHeader username={username} profile={profile} />
                            <Divider />
                            <DynamicPostList posts={profile.posts} />
                         </div>
                    }
                    </div>
                    <Footer className="pageFooter">Keep In Touch ©2020 Created by Yuan Wang</Footer>
                </div>
            ) : null}
        </div>
    )
}

export default Profile;