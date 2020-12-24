import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import ReactMarkDown from "react-markdown";
import { List, Avatar, Tag } from 'antd';
import { MessageOutlined,LikeOutlined } from "@ant-design/icons";

const DynamicCommentList= dynamic(() => import('./commentList'))

const PostList = ({ posts }) => {

    const [visible, setVisible] = useState(false);
    const [postId, setPostId] = useState(null);

    const randomColor = () => {
        const colors = ["magenta", "red", "volcano", "orange", "gold","lime","cyan","green",
                        "blue","geekblue", "purple"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div>
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
                            <Link href={`/profile/${item.author.username}`} key={item.author.username} >{item.author.username}</Link> 
                        }
                        key={item.id}
                        description={
                            <div className="postDescription" >
                                {`Created At : ${item.createdAt}`}
                                <br />
                                {`Updated At: ${item.updatedAt}`}
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
            <DynamicCommentList postId={postId} visible={visible} onClose={() => setVisible(false)} />
        </div>
    )
}

PostList.propTypes = {
    posts : PropTypes.array.isRequired
};

export default PostList;