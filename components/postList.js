import React, { useState } from 'react';
import ReactMarkDown from "react-markdown";
import { List, Avatar, Tag, Drawer} from 'antd';
import { MessageOutlined,LikeOutlined } from "@ant-design/icons";

const PostList = ({ posts }) => {

    const [visible, setVisible] = useState(false);

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
                            onClick={() => setVisible(true)} 
                        >
                            <MessageOutlined className="feedbackButton" />
                            {item.comments}
                        </a>,
                    ]}
                >
                    <List.Item.Meta
                        avatar={<Avatar size={50} src="https://avatars1.githubusercontent.com/u/8186664?s=460&v=4" />}
                        title={
                            <a href={`/profile/${item.author.username}`}>{item.author.username}</a> 
                        }
                        key={item.id}
                        description={
                            <div className="postDescription" >
                                {`Created At : ${item.createdAt}       `}
                                {`Updated At : ${item.updatedAt}`}
                                <br />
                                {item.tags.map((tag, idx) => (
                                    <a href={`/tag/${tag}`} key={idx} ><Tag key={idx} color={randomColor()}>{tag}</Tag></a>
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
            <Drawer
                title="Comments"
                placement="right"
                closable={true}
                onClose={() => setVisible(false)}
                visible={visible}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
        </div>
    )
}

export default PostList;