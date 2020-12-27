import React, { useRef } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import useSWR, { mutate } from 'swr';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import relativeTime from 'dayjs/plugin/relativeTime';
import { List, Avatar, Button, message, Spin, Input, Drawer, Divider, Form, Comment, Tooltip } from 'antd';
import { DeleteOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { COMMENTS_BY_POST, COMMENTS_API, COMMENT_BY_ID } from '../constants/api';

const { TextArea } = Input;
dayjs.extend(relativeTime)

const CommentList = ({ postId, visible, onClose, updatePost }) => {

    const formRef = useRef(null);
    const username = useSelector((state) => state.username);

    const getComments = async() => {
        const response = await axios.get(COMMENTS_BY_POST(postId));
        response.data.comments.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        })
        return response.data.comments;
    }

    const { data : comments, error} = useSWR(visible === true ? COMMENT_BY_ID : null, getComments);

    const deleteComment = (commentId) => {
        axios.delete(COMMENT_BY_ID(commentId)).then(res =>{
            message.success(res.data['success'],[0.5]);
            mutate(COMMENT_BY_ID);
            updatePost();
        }).catch(err => {
            let msg = JSON.parse(err.response.request.response);
            message.error(msg['error']);
        })
    }

    const onFinish = values => {
        axios.post(COMMENTS_API, {
            content : values.content,
            username : username,
            postId : postId
        }).then((res) => {
            message.success(res.data['success'],[0.5]);
            formRef.current.resetFields();
            mutate(COMMENT_BY_ID);
            updatePost();
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
                        author={<a href={`/profile/${item.author.username}`} 
                                    key={item.author.username} 
                                >
                                    <span className="commentAuthor" >{item.author.username}</span>
                                </a>}
                        avatar={<Avatar size={40} src="https://avatars1.githubusercontent.com/u/8186664?s=460&v=4" />}
                        content={item.content}
                        datetime={<Tooltip title={dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                                    <span className="commentDate" >{dayjs(item.createdAt).fromNow()}</span>
                                </Tooltip>}
                        actions={[
                            item.author.username === username ? 
                            <a  key="delete" onClick={() => deleteComment(item.id)} className="feedbackButton" >
                                <DeleteOutlined className="feedbackButton" />{"Delete"}
                            </a > : null,
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
                <div className="commentButton" >
                    <Form.Item>
                        <Button 
                            shape="round" 
                            size="large" 
                            type="primary"
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
    onClose : PropTypes.func.isRequired
};

export default CommentList;