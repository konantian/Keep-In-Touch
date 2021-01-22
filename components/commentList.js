import React, { useRef, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import dayjs from 'dayjs';
import useSWR, { mutate } from 'swr';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import relativeTime from 'dayjs/plugin/relativeTime';
import { List, Avatar, Button, message, Popconfirm, Tag, 
         Spin, Input, Drawer, Divider, Form, Comment, Tooltip } from 'antd';
import { DeleteOutlined, CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { COMMENTS_BY_POST, COMMENTS_API, COMMENT_BY_ID } from '../constants/api';
import styles from './Styles/CommentList.module.css';

const { TextArea } = Input;
dayjs.extend(relativeTime)

const CommentList = ({ postId, visible, onClose, updatePost, author }) => {

    const formRef = useRef(null);
    const username = useSelector((state) => state.username);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(null);

    const getComments = async( url ) => {
        const response = await axios.get(url, {withCredentials: true});
        response.data.comments.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        })
        return response.data.comments;
    }

    const { data : comments, error} = useSWR(visible === true ? COMMENTS_BY_POST(postId) : null, getComments);

    const deleteComment = (commentId) => {
        setDeleting(commentId);
        const config = {withCredentials: true};
        axios.delete(COMMENT_BY_ID(commentId), config).then(res =>{
            mutate(COMMENTS_BY_POST(postId));
            updatePost();
            setDeleting(null);
            message.success(res.data['success'],[0.5]);
        }).catch(err => {
            let msg = JSON.parse(err.response.request.response);
            message.error(msg['error']);
        })
    }

    const onFinish = values => {
        setLoading(true);
        const data = {
            content : values.content,
            username : username,
            postId : postId
        };
        const config = {withCredentials: true};
        axios.post(COMMENTS_API, data, config).then((res) => {
            formRef.current.resetFields();
            mutate(COMMENTS_BY_POST(postId));
            updatePost();
            setLoading(false);
            message.success(res.data['success'],[0.5]);
        }).catch(err => {
            let msg = JSON.parse(err.response.request.response);
            message.error(msg['error']);
        })
    }

    return (
        <Drawer
            title="Comments"
            placement="right"
            closable={true}
            onClose={onClose}
            visible={visible}
            width={450}
            closeIcon={<CloseCircleOutlined />}
        >
            {!comments ? <div className="loader" >
                            <Spin size="large" tip="Loading comments ... "/>
                        </div> :
            <List
                itemLayout="vertical"
                dataSource={comments}
                renderItem={item => (
                    <Comment
                        author={<Link href={`/profile/${item.author.username}`} 
                                    key={item.author.username} 
                                >
                                    <a className={styles.commentAuthor} >{item.author.username}</a>
                                </Link>}
                        avatar={<Avatar size={40} src={item.author.avatar} />}
                        content={item.content}
                        datetime={
                                <div>
                                    <Tooltip title={dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                                        <span className={styles.commentDate} >{dayjs(item.createdAt).fromNow()}</span>
                                    </Tooltip>
                                    {author === item.author.username ?
                                         <Tag style={{marginLeft : "10px"}} color='orange' >Author</Tag> : 
                                         null
                                    }
                                </div>
                                }
                        actions={[
                            item.author.username === username ? 
                            
                            <Popconfirm
                                placement="left"
                                title="Are you sure to delete this comment?"
                                onConfirm={() => deleteComment(item.id)}
                                disabled={deleting === item.id}
                                okText="Yes"
                                cancelText="No"
                            >
                                <a  key="delete" className="feedbackButton" >
                                    {
                                        deleting !== item.id ? 
                                        <DeleteOutlined className="feedbackButton" /> : 
                                        <LoadingOutlined className="feedbackButton" />
                                    }
                                    Delete
                                </a > 
                            </Popconfirm> : null,
                        ]}

                    />
                )}
            /> }
            <Divider />
            <Form onFinish={onFinish} ref={formRef}>
                <Form.Item name="content">
                    <TextArea 
                        showCount
                        maxLength={140}
                        placeholder="Add your comment here"
                        allowClear={true}
                        autoSize={{ minRows: 4, maxRows: 7 }}
                    />
                </Form.Item>
                <div className={styles.commentButton} >
                    <Form.Item>
                        <Button 
                            shape="round" 
                            size="large" 
                            type="primary"
                            loading={loading}
                            htmlType="submit"
                        >Comment
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </Drawer>
    )
}

CommentList.propTypes = {
    postId : PropTypes.number,
    visible : PropTypes.bool.isRequired,
    onClose : PropTypes.func.isRequired,
    updatePost : PropTypes.func.isRequired,
    author : PropTypes.string
};

export default CommentList;