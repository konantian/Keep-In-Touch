import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { List, Avatar, Button, message, Input, Drawer, Divider, Form } from 'antd';
import { DeleteOutlined } from "@ant-design/icons";
import { COMMENTS_BY_POST, COMMENTS_API, COMMENT_BY_ID } from '../constants/api';

const { TextArea } = Input;

const CommentList = ({ postId, visible, onClose }) => {

    const formRef = useRef(null);
    const username = useSelector((state) => state.username);
    const [comments, setComments] = useState([]);
    
    useEffect(() => {
        if(postId) getComments();
    },[postId])

    const getComments = async() => {
        const response = await axios.get(COMMENTS_BY_POST(postId));
        response.data.comments.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        })
        setComments(response.data.comments);
    }

    const deleteComment = (commentId) => {
        axios.delete(COMMENT_BY_ID(commentId)).then(res =>{
            message.success(res.data['success'],[0.5]);
            getComments();
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
            getComments();
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
        >
            <List
                itemLayout="vertical"
                dataSource={comments}
                renderItem={item => (
                <List.Item 
                    key={item.id}
                    actions={[
                        <a  key="delete" onClick={() => deleteComment(item.id)} className="feedbackButton" >
                            <DeleteOutlined className="feedbackButton" />
                        </a >,
                    ]}
                >
                    <List.Item.Meta
                        avatar={<Avatar size={40} src="https://avatars1.githubusercontent.com/u/8186664?s=460&v=4" />}
                        title={
                            <Link href={`/profile/${item.author.username}`} key={item.author.username} >{item.author.username}</Link> 
                        }
                        key={item.id}
                        description={
                            <div className="postDescription" >{`Created At : ${item.createdAt}`}</div>
                        }
                    />
                    <div style={{ overflow: "auto" }}>{item.content}</div>
                </List.Item>
                )}
            />
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