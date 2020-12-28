import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { List, Avatar, Button } from  'antd';
import { CloseOutlined } from "@ant-design/icons";

const FollowingList = ({ following, api }) => {

    const userId = useSelector((state) => state.userId);

    return (
        <List
            itemLayout="vertical"
            dataSource={following}
            renderItem={item => (
            <List.Item>
                <List.Item.Meta
                    avatar={<Avatar size={40} src="https://avatars1.githubusercontent.com/u/8186664?s=460&v=4" />}
                    title={
                        <div className="postTitle" >
                            <Link href={`/profile/${item}`} key={item} >{item}</Link>
                            <Button type="danger" size="large" shape="round"><CloseOutlined />Unfollow</Button>
                        </div>
                    }
                />
            </List.Item>
        )}
    />)
}

export default FollowingList;