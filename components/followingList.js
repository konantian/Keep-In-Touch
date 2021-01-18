import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import dayjs from 'dayjs';
import { mutate } from 'swr';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { List, Avatar, Button, message } from  'antd';
import { UserDeleteOutlined, UserAddOutlined, LoadingOutlined  } from "@ant-design/icons";
import { UNFOLLOW_API, FOLLOW_API } from '../constants/api';

const FollowingList = ({ following, api}) => {

    const userId = useSelector((state) => state.userId);
    const currentUser = useSelector((state) => state.username);
    const [loading, setLoading] = useState(null);

    const handleFollow = ( followerId, user, status ) => {
        setLoading(followerId);
        const config = {withCredentials: true};
        if(status === 'Follow'){
            const data = {user : user, follower : currentUser};
            axios.post(FOLLOW_API, data, config).then((res) => {
                mutate(api);
                message.success(res.data['success'],[0.5]);
                setLoading(null);
            }).catch((err) => {
                console.log(err);
            })
        }else{
            const data = {userId : followerId, followerId : userId};
            axios.post(UNFOLLOW_API, data, config).then((res) => {
                mutate(api);
                message.success(res.data['success'],[0.5]);
                setLoading(null);
            }).catch((err) => {
                console.log(err);
            })
        }
    }

    return (
        <List
            itemLayout="vertical"
            dataSource={following}
            renderItem={item => (
            <List.Item>
                <List.Item.Meta
                    avatar={<Avatar size={60} src={item.user.avatar} />}
                    title={
                        <div className="postTitle" >
                            <Link href={`/profile/${item.user.username}`} key={item.user.id} >{item.user.username}</Link>
                        </div>
                    }
                    description={
                        <div className="followDescription">
                            Followed At {dayjs(item.followedAt).format('YYYY-MM-DD HH:mm:ss')}
                            {item.status !== 'Self' ? 
                                 <Button 
                                    size="large" 
                                    key="statusButton"
                                    shape="round"
                                    style={{marginTop : "-20px"}}
                                    onClick={() => handleFollow(item.user.id, item.user.username, item.status)}
                                >
                                    {loading === item.user.id ? <LoadingOutlined /> : 
                                     (item.status === 'Follow' ? <UserAddOutlined /> : <UserDeleteOutlined />)}
                                    {item.status}
                                </Button> : null
                            }
                        </div>
                    }
                />
            </List.Item>
        )}
    />)
}

FollowingList.propTypes = {
    following : PropTypes.array.isRequired,
    username : PropTypes.string.isRequired,
    api : PropTypes.string.isRequired,
};

export default FollowingList;