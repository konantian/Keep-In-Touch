import React from 'react';
import Link from 'next/link';
import axios from 'axios';
import dayjs from 'dayjs';
import { mutate } from 'swr';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { List, Avatar, Button, message } from  'antd';
import { UserDeleteOutlined } from "@ant-design/icons";
import { UNFOLLOW_API } from '../constants/api';

const FollowingList = ({ following, username, api}) => {

    const currentUser = useSelector((state) => state.username);
    const userId = useSelector((state) => state.userId);

    const unFollow = ( followerId ) => {
        axios.post(UNFOLLOW_API,{
            userId : followerId,
            followerId : userId
        }).then((res) => {
            message.success(res.data['success'],[0.5]);
            mutate(api);
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <List
            itemLayout="vertical"
            dataSource={following}
            renderItem={item => (
            <List.Item>
                <List.Item.Meta
                    avatar={<Avatar size={40} src="/boy.png" />}
                    title={
                        <div className="postTitle" >
                            <Link href={`/profile/${item.user.username}`} key={item.user.id} >{item.user.username}</Link>
                            {currentUser === username ?
                                 <Button 
                                    size="large" 
                                    key="statusButton"
                                    shape="round"
                                    onClick={() => unFollow(item.user.id)}
                                >
                                    <UserDeleteOutlined />Unfollow
                                </Button> : null}
                        </div>
                    }
                    description={
                        <div className="followDescription">
                            Followed At {dayjs(item.followedAt).format('YYYY-MM-DD HH:mm:ss')}
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