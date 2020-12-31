import React from 'react';
import Link from 'next/link';
import axios from 'axios';
import dayjs from 'dayjs';
import { mutate } from 'swr';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { List, Avatar, Button, message } from  'antd';
import { CloseOutlined } from "@ant-design/icons";
import { UNFOLLOW_API } from '../constants/api';

const FollowerList = ({ follower, username, api }) => {

    const currentUser = useSelector((state) => state.username);
    const userId = useSelector((state) => state.userId);

    const unFollow = ( followerId ) => {
        axios.post(UNFOLLOW_API,{
            userId : userId,
            followerId : followerId
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
            dataSource={follower}
            renderItem={item => (
            <List.Item>
                <List.Item.Meta
                    avatar={<Avatar size={40} src="/boy.png" />}
                    title={
                        <div className="postTitle" >
                            <Link href={`/profile/${item.follower.username}`} key={item.follower.id} >{item.follower.username}</Link>
                            {currentUser === username ?
                                 <Button 
                                    size="large" 
                                    key="statusButton"
                                    shape="round"
                                    onClick={() => unFollow(item.follower.id)}
                                >
                                    <CloseOutlined />Remove
                                </Button> : null}
                        </div>
                    }
                    description={
                        <div style={{"marginTop" : "-15px"}}>
                            Followed At {dayjs(item.followedAt).format('YYYY-MM-DD HH:mm:ss')}
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
    username : PropTypes.string.isRequired,
    api : PropTypes.string.isRequired,
};


export default FollowerList;