import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import axios from 'axios';
import dayjs from 'dayjs';
import { mutate } from 'swr';
import { useSelector } from 'react-redux';
import relativeTime from 'dayjs/plugin/relativeTime';
import ReactMarkDown from "react-markdown";
import { List, Avatar, Tag, BackTop, Tooltip, Dropdown, Menu, Button, message } from 'antd';
import { MessageOutlined, LikeOutlined, EllipsisOutlined, DeleteOutlined } from "@ant-design/icons";
import { randomColor } from '../utils/randomColor';
import { POST_BY_ID } from '../constants/api';

const DynamicCommentList= dynamic(() => import('./commentList'))
dayjs.extend(relativeTime)

const PostList = ({ posts, api }) => {

    const [visible, setVisible] = useState(false);
    const [postId, setPostId] = useState(null);
    const username = useSelector((state) => state.username);

    const menu = (author, postId) => {
         return(
            <Menu>
                <Menu.Item key="1" icon={<LikeOutlined />}>
                    Like
                </Menu.Item>
                <Menu.Item 
                    key="2" 
                    icon={<MessageOutlined />}
                    onClick={() => {
                        setPostId(postId);
                        setVisible(true);
                    }}
                >
                    Comment
                </Menu.Item>
                {author === username ?
                    <Menu.Item 
                        danger 
                        key="3" 
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            axios.delete(POST_BY_ID(postId)).then(res => {
                                message.success(res.data['success'],[0.5]);
                                mutate(api);
                            })
                        }}
                    >
                        Delete
                    </Menu.Item> : null}
            </Menu>
         )
    };

    return (
        <div>
            <BackTop />
            <List
                itemLayout="vertical"
                dataSource={posts}
                size="large"
                renderItem={item => (
                <List.Item
                    key={item.id}
                    actions={[
                        <a  key="like" className="feedbackButton" >
                            <LikeOutlined className="feedbackButton"/>
                            {item.likes}
                        </a >,
                        <a  key="comment" className="feedbackButton"
                            onClick={() => {
                                setPostId(item.id);
                                setVisible(true);
                            }} 
                        >
                            <MessageOutlined className="feedbackButton" />
                            {item.comments}
                        </a>,
                    ]}
                >
                    <List.Item.Meta
                        avatar={<Avatar size={50} src="https://avatars1.githubusercontent.com/u/8186664?s=460&v=4" />}
                        title={
                            <div className="postTitle" >
                                <Link href={`/profile/${item.author.username}`} key={item.author.username} >{item.author.username}</Link> 
                                <Dropdown key="status" overlay={menu(item.author.username, item.id)}>
                                    <Button shape="round"><EllipsisOutlined /></Button>
                                </Dropdown>
                            </div>
                            
                        }
                        key={item.id}
                        description={
                            <div className="postDescription" >
                                <Tooltip title={dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')}>
                                    <span>{dayjs(item.updatedAt).fromNow()}</span>
                                </Tooltip>
                                {item.updatedAt !== item.createdAt ? '  Edited' : ''}
                                <br />
                                {item.tags.map((tag, idx) => (
                                    <Link href={`/tag/${tag}`} key={idx} ><a><Tag key={idx} color={randomColor()}>{tag}</Tag></a></Link>
                                ))}
                            </div>
                        }
                    />
                    <div style={{ overflow: "auto" }}>
                        <h2>{item.title}</h2>
                        {item.contentType === "text" ? (
                            item.content) : 
                            (<ReactMarkDown source={item.content} />)
                        }
                    </div>
                </List.Item>
                )}
            />
            <DynamicCommentList postId={postId} visible={visible} onClose={() => setVisible(false)} updatePost={() => mutate(api)} />
        </div>
    )
}

PostList.propTypes = {
    posts : PropTypes.array.isRequired
};

export default PostList;