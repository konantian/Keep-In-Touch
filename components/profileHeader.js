import React, { useState, useEffect, useRef }  from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import dayjs from 'dayjs';
import useSWR, { mutate } from 'swr';
import { useSelector } from 'react-redux';
import { MenuOutlined, 
        EditOutlined, 
        CloseOutlined, 
        UserAddOutlined, 
        SmileOutlined,
        SaveOutlined } from '@ant-design/icons';
import { PageHeader,  Descriptions, Button, Dropdown, Menu, message, Input} from 'antd';
import dynamic from 'next/dynamic';
import { FOLLOW_API, UNFOLLOW_API, IF_FOLLOW_API, USER_BY_USERNAME, AVATAR_API } from '../constants/api';

const DynamicAvatar= dynamic(() => import('./updateAvatar'))

const ProfileHeader = ({ profile, username, api }) => {

    const inputRef = useRef(null);
    
    const currentUser = useSelector((state) => state.username);
    const userId = useSelector((state) => state.userId);
    const [followers, setFollowers] = useState(profile.followers);
    const [bio, setBio] = useState(profile.bio);
    const [avatar, setAvatar] = useState(profile.avatar);
    const [isEdit, setIsEdit] = useState(false);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFollowers(profile.followers);
        setBio(profile.bio);
        setAvatar(profile.avatar);
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

    const updateBio = ( value ) => {
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

    const updateAvatar = ( value ) => {
        const data = { avatar : value};
        const config = {withCredentials: true};
        axios.patch(AVATAR_API(username), data, config).then(res =>{
            message.success(res.data['success'],[0.5]);
            mutate(api);
            setVisible(false);
            setLoading(false);
            setAvatar(value);
        }).catch((err) => {
            console.log(err);
        })
    }


    return (
        <div>
            <PageHeader
                ghost={false}
                title={profile.name}
                subTitle={username}
                extra={
                    currentUser !== username ? 
                    [(status !== 'Follow' ? 
                        <Dropdown key="status" overlay={menu}>
                            <Button size="large" key="statusButton" shape="round">{status} <MenuOutlined /></Button>
                        </Dropdown> : 
                        <Button onClick={() => follow()} key="followButton" size="large" type="primary" shape="round">{status} <UserAddOutlined /></Button>
                    )] : [
                        (
                        isEdit ? <Button key="saveButton" onClick={() => updateBio(inputRef.current.state.value)} shape="round" size="large" >Save Bio<SaveOutlined /></Button> :
                        <Button key="editButton" onClick={() => setIsEdit(true)} shape="round" size="large" >Edit Bio<EditOutlined /></Button>
                        ),
                        <Button size="large" key="avatar" onClick={() => setVisible(true)} type="primary" shape="round">Avatar <SmileOutlined /></Button>
                    ]
                }
                avatar={{ src: avatar, size : 70 }}
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
                        {isEdit ? <Input.TextArea ref={inputRef} onPressEnter={(e) => updateBio(e.target.value)} autoSize={{ minRows: 3, maxRows: 5 }} defaultValue={bio}/> : bio }
                    </Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <DynamicAvatar  visible={visible} setVisible={setVisible} loading={loading} avatar={avatar} updateAvatar={updateAvatar} />
        </div>
        
    )
}

ProfileHeader.propTypes = {
    profile: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
    api : PropTypes.string.isRequired
};

export default ProfileHeader;