import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import axios from 'axios';
import dayjs from 'dayjs';
import { mutate } from 'swr';
import { FcLike } from 'react-icons/fc';
import { useSelector } from 'react-redux';
import relativeTime from 'dayjs/plugin/relativeTime';
import ReactMarkDown from "react-markdown";
import { List, Avatar, Popconfirm, Tag, BackTop, Tooltip, Dropdown, Menu, Button, message } from 'antd';
import { CommentOutlined,
         HeartOutlined, 
         EllipsisOutlined, 
         DeleteOutlined, 
         EditOutlined } from "@ant-design/icons";
import { randomColor } from '../utils/randomColor';
import { POST_BY_ID, LIKE_API } from '../constants/api';

const DynamicCommentList= dynamic(() => import('./commentList'))
dayjs.extend(relativeTime)

const PostList = ({ posts, api }) => {

    const [visible, setVisible] = useState(false);
    const [postId, setPostId] = useState(null);
    const username = useSelector((state) => state.username);
    const userId = useSelector((state) => state.userId);
    const token = useSelector((state) => state.token);
    const headers = {'Authorization': token}

    const deletePost = postId => {
        axios.delete(POST_BY_ID(postId)).then(res => {
            message.success(res.data['success'],[0.5]);
            mutate(api);
        }).catch(err => {
            console.log(err);
        })
    }

    const updateLike = postId => {
        const data = {userId : userId, postId : postId};
        const config = { headers : headers};
        axios.patch(LIKE_API, data, config).then(() => {
            mutate(api);
        }).catch(err => {
            console.log(err);
        })
    }

    const menu = (author, postId, liked) => {
         return(
            <Menu>
                <Menu.Item 
                    key="1" 
                    icon={liked.includes(userId) ? 
                        <FcLike className="feedbackButton"/> : 
                        <HeartOutlined /> }
                    onClick={() => updateLike(postId)}
                >
                    {liked.includes(userId) ? "Unlike" : "like"}
                </Menu.Item>
                <Menu.Item 
                    key="2" 
                    icon={<CommentOutlined />}
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
                    >
                        <Popconfirm
                            placement="bottom"
                            title="Are you sure to delete this post?"
                            onConfirm={() => deletePost(postId)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <a  key="delete" className="feedbackButton" >
                                Delete
                            </a > 
                        </Popconfirm> 
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
                        <a  key="like" onClick={() => updateLike(item.id)} className="feedbackButton" >
                            {item.liked.includes(userId) ?
                                <FcLike className="feedbackButton"/> :
                                <HeartOutlined className="feedbackButton"/>
                            }
                            {item.likes}
                        </a >,
                        <a  key="comment" className="feedbackButton"
                            onClick={() => {
                                setPostId(item.id);
                                setVisible(true);
                            }} 
                        >
                            <CommentOutlined className="feedbackButton" />
                            {item.comments} comment(s)
                        </a>,
                        <div>
                            {item.author.username === username ? 
                            <a href={`/post/${item.id}`} key="edit" className="feedbackButton">
                                <EditOutlined className="feedbackButton" />
                                Edit
                            </a> : null}
                        </div>
                    ]}
                >
                    <List.Item.Meta
                        avatar={<Avatar size={50} src="/boy.png" />}
                        title={
                            <div className="postTitle" >
                                <Link href={`/profile/${item.author.username}`} key={item.author.username} >{item.author.username}</Link> 
                                <Dropdown key="status" overlay={menu(item.author.username, item.id, item.liked)}>
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
    posts : PropTypes.array.isRequired,
    api : PropTypes.string.isRequired,
};

export default PostList;