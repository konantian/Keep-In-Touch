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
import utc from 'dayjs/plugin/utc';
import ReactMarkDown from "react-markdown";
import { List, Avatar, Popconfirm, Tag, BackTop, 
       Tooltip, Dropdown, Menu, Button, message } from 'antd';
import { CommentOutlined,
         HeartOutlined, 
         EllipsisOutlined, 
         DeleteOutlined, 
         EditOutlined,
         LoadingOutlined } from "@ant-design/icons";
import { randomColor } from '../utils/randomColor';
import { POST_BY_ID, LIKE_API } from '../constants/api';
import styles from './Styles/PostList.module.css';

const DynamicCommentList= dynamic(() => import('./commentList'))
const DynamicImageWall = dynamic(() => import('./imageWall'))
dayjs.extend(relativeTime)
dayjs.extend(utc)

const PostList = ({ posts, api }) => {

    const [visible, setVisible] = useState(false);
    const [postId, setPostId] = useState(null);
    const [author, setAuthor] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const username = useSelector((state) => state.username);
    const userId = useSelector((state) => state.userId);

    const deletePost = postId => {
        setDeleting(postId);
        axios.delete(POST_BY_ID(postId),{withCredentials: true}).then(res => {
            mutate(api);
            setDeleting(null);
            message.success(res.data['success'],[0.5]);
        }).catch(err => {
            console.log(err);
        })
    }

    const updateLike = postId => {
        const data = {userId : userId, postId : postId};
        const config = {withCredentials: true};
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
                        <FcLike className="actionButton"/> : 
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
                        setAuthor(author);
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
                            <a  key="delete" className="actionButton" >
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
                        <a  key="like" onClick={() => updateLike(item.id)} className="actionButton" >
                            {item.liked.includes(userId) ?
                                <FcLike className="actionButton"/> :
                                <HeartOutlined className="actionButton"/>
                            }
                            {item.likes}
                        </a >,
                        <a  key="comment" className="actionButton"
                            onClick={() => {
                                setPostId(item.id);
                                setVisible(true);
                                setAuthor(item.author.username);
                            }} 
                        >
                            <CommentOutlined className="actionButton" />
                            {item.comments} comment(s)
                        </a>,
                        <a key="edit" className="actionButton" >
                            {item.author.username === username ? 
                                <Link href={`/post/${item.id}`} >
                                    <span><EditOutlined className="actionButton" />Edit</span>
                                </Link> : null
                            }
                        </a>,
                        <div>
                            {item.author.username === username ? 
                                <Popconfirm
                                    placement="bottom"
                                    title="Are you sure to delete this post?"
                                    onConfirm={() => deletePost(item.id)}
                                    disabled={deleting === item.id}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                <a  key="delete" className={styles.deleteIcon} >
                                    {deleting !== item.id ? <DeleteOutlined  /> : <LoadingOutlined />} Delete
                                </a > 
                            </Popconfirm>  : null
                            }
                        </div>
                    ]}
                >
                    <List.Item.Meta
                        avatar={
                        <Link href={`/profile/${item.author.username}`} >
                            <a><Avatar size={50} src={item.author.avatar} /></a>
                        </Link>
                        
                    }
                        title={
                            <div className={styles.postTitle} >
                                <Link href={`/profile/${item.author.username}`} key={item.author.username} >{item.author.username}</Link> 
                                <Dropdown key="status" overlay={menu(item.author.username, item.id, item.liked)}>
                                    <Button shape="round"><EllipsisOutlined /></Button>
                                </Dropdown>
                            </div>
                            
                        }
                        key={item.id}
                        description={
                            <div className={styles.postDescription} >
                                <Tooltip title={dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')}>
                                    <span>{dayjs(item.updatedAt).from(dayjs().utc().format())}</span>
                                </Tooltip>
                                {item.updatedAt !== item.createdAt ? '  Edited' : ''}
                                <br  style={{marginBottom : "10px"}} />
                                <div className={styles.postTags} >
                                    {item.tags.map((tag, idx) => (
                                        <Link href={`/tag/${tag}`} key={idx} ><a><Tag key={idx} color={randomColor()}>{tag}</Tag></a></Link>
                                    ))}
                                </div>
                                
                            </div>
                        }
                    />
                    <div className={styles.postContent}>
                        <h2>{item.title}</h2>
                        {item.contentType === "text" ? (
                            item.content) : 
                            (<ReactMarkDown source={item.content} />)
                        }
                    </div>
                    {item.images.length > 0 ? <DynamicImageWall images={item.images} /> : null}
                </List.Item>
                )}
            />
            <DynamicCommentList postId={postId} author={author} visible={visible} onClose={() => setVisible(false)} updatePost={() => mutate(api)} />
        </div>
    )
}

PostList.propTypes = {
    posts : PropTypes.array.isRequired,
    api : PropTypes.string.isRequired,
};

export default PostList;