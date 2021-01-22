import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import dayjs from 'dayjs';
import { mutate } from 'swr';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { List, Avatar, Button, message } from  'antd';
import { UserDeleteOutlined, UserAddOutlined, LoadingOutlined} from "@ant-design/icons";
import { UNFOLLOW_API, FOLLOW_API } from '../constants/api';
import styles from './Follow.module.css';

const FollowerList = ({ follower, api }) => {

    const currentUser = useSelector((state) => state.username);
    const userId = useSelector((state) => state.userId);
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
            const data = {userId : userId, followerId : followerId};
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
            dataSource={follower}
            renderItem={item => (
            <List.Item>
                <List.Item.Meta
                    avatar={
                    <Link href={`/profile/${item.follower.username}`}>
                        <a><Avatar size={60} src={item.follower.avatar} /></a>
                    </Link>
                    }
                    title={
                        <div className={styles.followTitle} >
                            <Link href={`/profile/${item.follower.username}`} key={item.follower.id} >{item.follower.username}</Link>
                        </div>
                    }
                    description={
                        <div className={styles.followDescription} >
                            Followed At {dayjs(item.followedAt).format('YYYY-MM-DD HH:mm:ss')}
                            {item.status !== 'Self' ? 
                                 <Button 
                                    size="large" 
                                    key="statusButton"
                                    shape="round"
                                    style={{marginTop : "-20px"}}
                                    onClick={() => handleFollow(item.follower.id, item.follower.username, item.status)}
                                >
                                    {loading === item.follower.id ? <LoadingOutlined /> : 
                                     (item.status === 'Follow' ? <UserAddOutlined /> : <UserDeleteOutlined />)}
                                    {item.status}
                                </Button> : null
                            }
                        </div>
                    }
                />
            </List.Item>
            )}
        />
    )
}

FollowerList.propTypes = {
    follower : PropTypes.array.isRequired,
    api : PropTypes.string.isRequired,
};


export default FollowerList;