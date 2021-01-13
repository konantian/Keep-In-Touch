import React, { useState, useEffect, useRef }  from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import axios from 'axios';
import dayjs from 'dayjs';
import useSWR, { mutate } from 'swr';
import { useSelector } from 'react-redux';
import { MenuOutlined, 
        EditOutlined, 
        CloseOutlined, 
        UserAddOutlined, 
        SaveOutlined } from '@ant-design/icons';
import { PageHeader,  Descriptions, Button, Dropdown, Menu, message, Input } from 'antd';
import { FOLLOW_API, UNFOLLOW_API, IF_FOLLOW_API, USER_BY_USERNAME } from '../constants/api';

const ProfileHeader = ({ profile, username }) => {

    const inputRef = useRef(null);
    const currentUser = useSelector((state) => state.username);
    const userId = useSelector((state) => state.userId);
    const [followers, setFollowers] = useState(profile.followers);
    const [bio, setBio] = useState(profile.bio);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        setFollowers(profile.followers);
        setBio(profile.bio);
    },[profile])

    const getFollow = async () => {
        const config = {
            withCredentials: true,
            params: {
                user : currentUser,
                follower : username
            },
          }
        const response = await axios.get(IF_FOLLOW_API, config);
        return response.data.status;
    }

    const {data : status, error}  = useSWR(IF_FOLLOW_API, getFollow);

    const handleMenuClick = (e) => {
        if(e.key === '1'){
            const data = {userId : profile.id, followerId : userId};
            const config = {withCredentials: true};
            axios.post(UNFOLLOW_API, data, config).then((res) => {
                message.success(res.data['success'],[0.5]);
                setFollowers(followers - 1);
                mutate(IF_FOLLOW_API);
            }).catch((err) => {
                console.log(err);
            })
        }
    }

    const follow = () => {
        const data = {user : username, follower : currentUser};
        const config = {withCredentials: true};
        axios.post(FOLLOW_API, data, config).then((res) => {
            message.success(res.data['success'],[0.5]);
            setFollowers(followers + 1);
            mutate(IF_FOLLOW_API);
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

    const update_bio = ( value ) => {
        setIsEdit(false);
        const data = { bio : value };
        const config = {withCredentials: true};
        axios.patch(USER_BY_USERNAME(username), data, config).then(res =>{
            message.success(res.data['success'],[0.5]);
            setBio(value);
        }).catch((err) => {
            console.log(err);
        })
    }


    return (
        <PageHeader
            ghost={false}
            title={profile.name}
            subTitle={username}
            extra={[currentUser !== username ? 
                (status !== 'Follow' ? 
                    <Dropdown key="status" overlay={menu}>
                        <Button size="large" key="statusButton" shape="round">{status} <MenuOutlined /></Button>
                    </Dropdown> : 
                    <Button onClick={() => follow()} key="followButton" size="large" type="primary" shape="round">{status} <UserAddOutlined /></Button>
                ) : (
                    isEdit ? <Button type="primary" key="saveButton" onClick={() => update_bio(inputRef.current.state.value)} shape="round" size="large" >Save <SaveOutlined /></Button> :
                    <Button type="primary" key="editButton" onClick={() => setIsEdit(true)} shape="round" size="large" >Edit <EditOutlined /></Button>
                )
                
            ]}
            avatar={{ src: profile.avatar }}
        >
            <Descriptions size="middle" column={2} className="descriptions">
                <Descriptions.Item label="Email" labelStyle={{"fontWeight" : "bold"}}>{profile.email}</Descriptions.Item>
                <Descriptions.Item label="Last Login" labelStyle={{"fontWeight" : "bold"}} >{dayjs(profile.lastLogin).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                <Descriptions.Item label="Followers" labelStyle={{"fontWeight" : "bold"}}>
                    {<a href={`/${username}/follower`}>{followers}</a>}
                </Descriptions.Item>
                <Descriptions.Item label="Following" labelStyle={{"fontWeight" : "bold"}}>
                    {<a href={`/${username}/following`}>{profile.following}</a>}
                </Descriptions.Item>
                <Descriptions.Item label="Biography" labelStyle={{"fontWeight" : "bold"}}>
                    {isEdit ? <Input.TextArea ref={inputRef} onPressEnter={(e) => update_bio(e.target.value)} autoSize={{ minRows: 3, maxRows: 5 }} defaultValue={bio}/> : bio }
                </Descriptions.Item>
            </Descriptions>
        </PageHeader>
    )
}

ProfileHeader.propTypes = {
    profile: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
};

export default ProfileHeader;