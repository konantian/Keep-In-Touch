import React, { useState, useEffect }  from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { MenuOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { PageHeader,  Descriptions, Button, Dropdown, Menu, message } from 'antd';
import { FOLLOW_API, UNFOLLOW_API, IF_FOLLOW_API } from '../constants/api';

const ProfileHeader = ({ profile, username }) => {

    const currentUser = useSelector((state) => state.username);
    const userId = useSelector((state) => state.userId);
    const [followers, setFollowers] = useState(0);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        setFollowers(profile.followers);
        getFollow(username);
    },[])

    const getFollow = async (username) => {
        const response = await axios.get(IF_FOLLOW_API,
            { params: {
                user : currentUser,
                follower : username
            }});
        setStatus(response.data.status);
    }

    const handleMenuClick = (e) => {
        if(e.key === '1'){
            axios.post(UNFOLLOW_API,{
                userId : profile.id,
                followerId : userId
            }).then((res) => {
                message.success(res.data['success'],[0.5]);
                setFollowers(followers - 1);
                getFollow(username);
            }).catch((err) => {
                console.log(err);
            })
        }
    }

    const follow = () => {
        axios.post(FOLLOW_API,{
            user : username,
            follower : currentUser
        }).then((res) => {
            message.success(res.data['success'],[0.5]);
            setFollowers(followers + 1);
            getFollow(username);
        }).catch((err) => {
            console.log(err);
        })
    }

    const menu = (
        <Menu onClick={handleMenuClick}>
          <Menu.Item key="1" icon={<CloseOutlined />}>
            Unfollow
          </Menu.Item>
        </Menu>
      );

    return (
        <PageHeader
            ghost={false}
            title={profile.name}
            subTitle={username}
            extra={[currentUser !== username ? 
                (status !== 'Follow' ? 
                    <Dropdown key="status" overlay={menu}>
                        <Button size="large" shape="round">{status} <MenuOutlined /></Button>
                    </Dropdown> : 
                    <Button onClick={() => follow()} size="large" type="primary" shape="round">{status} <PlusOutlined /></Button>
                ) : null
            ]}
            avatar={{ src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4' }}
        >
            <Descriptions size="middle" column={2} className="descriptions">
                <Descriptions.Item label="Email" labelStyle={{"fontWeight" : "bold"}}>{profile.email}</Descriptions.Item>
                <Descriptions.Item label="Last Login" labelStyle={{"fontWeight" : "bold"}} >{dayjs(profile.lastLogin).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                <Descriptions.Item label="Followers" labelStyle={{"fontWeight" : "bold"}}>{followers}</Descriptions.Item>
                <Descriptions.Item label="Following" labelStyle={{"fontWeight" : "bold"}}>{profile.following}</Descriptions.Item>
                <Descriptions.Item label="Biography" labelStyle={{"fontWeight" : "bold"}}>{profile.bio}</Descriptions.Item>
            </Descriptions>
        </PageHeader>
    )
}

ProfileHeader.propTypes = {
    profile: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
};

export default ProfileHeader;