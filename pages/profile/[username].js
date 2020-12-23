import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { message, Layout, PageHeader, Divider, Descriptions, Spin, Button } from 'antd';
import Header from '../../components/header';
import PostList from '../../components/postList';
import { USER_BY_USERNAME  } from '../../constants/api';

const { Footer } = Layout;

const Profile = () => {

    const router = useRouter();
    const [username, setUsername] = useState(null);
    const [profile, setProfile] = useState(null);
    const isLogged = useSelector((state) => state.isLogged);
    const currentUser = useSelector((state) => state.username);
    
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
                    <Header selectedKey={["4"]}/>
                    <div className="profileHeader">
                    {!profile ? <Spin tip="Loading user's profile ... "/> : 
                        <div>
                            <PageHeader
                                ghost={false}
                                title={profile.name}
                                subTitle={username}
                                extra={[currentUser !== username ?
                                    <Button className="followButton" size="large" shape="round" type="primary" key="3">Follow</Button> : null,
                                ]}
                                avatar={{ src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4' }}
                            >
                                <Descriptions size="middle" column={2} className="descriptions">
                                    <Descriptions.Item label="Email" labelStyle={{"fontWeight" : "bold"}}>{profile.email}</Descriptions.Item>
                                    <Descriptions.Item label="Last Login" labelStyle={{"fontWeight" : "bold"}} >{profile.lastLogin}</Descriptions.Item>
                                    <Descriptions.Item label="Followers" labelStyle={{"fontWeight" : "bold"}}>{profile.followers}</Descriptions.Item>
                                    <Descriptions.Item label="Following" labelStyle={{"fontWeight" : "bold"}}>{profile.following}</Descriptions.Item>
                                    <Descriptions.Item label="Biography" labelStyle={{"fontWeight" : "bold"}}>{profile.bio}</Descriptions.Item>
                                </Descriptions>
                            </PageHeader>
                            <Divider />
                            <PostList posts={profile.posts} />
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