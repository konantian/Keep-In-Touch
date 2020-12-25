import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { List, Avatar, Button,  Input, Drawer, Divider } from 'antd';
import { COMMENTS_BY_POST } from '../constants/api';

const { TextArea } = Input;

const CommentList = ({ postId, visible, onClose }) => {

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
                <List.Item key={item.id} >
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
            <TextArea 
                showCount
                maxLength={140} 
                placeholder="Add your comment here"
                allowClear={true}
                autoSize={{ minRows: 5, maxRows: 7 }}
            />
            <div className="commentButton" ><Button shape="round" size="large" type="primary">Comment</Button></div>
        </Drawer>
    )

}

CommentList.propTypes = {
    postId : PropTypes.number,
    visible : PropTypes.bool.isRequired,
    onClose : PropTypes.func.isRequired
};

export default CommentList;