import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import useSWR from 'swr';
import ReactMarkDown from "react-markdown";
import { message, Layout, List, Avatar, Spin, Tag, Drawer} from 'antd';
import { MessageOutlined,LikeOutlined } from "@ant-design/icons";
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Header from '../components/header';
import { VISIBLE_POSTS_API }from '../constants/api';

const { Footer } = Layout;

const Home = () => {

    const router = useRouter();
    const isLogged = useSelector((state) => state.isLogged);
    const username = useSelector((state) => state.username);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!isLogged) {
            message.error('Please login first');
            router.push('/');
        };
    }, []);

    const randomColor = () => {
        const colors = ["magenta", "red", "volcano", "orange", "gold","lime","cyan","green",
                        "blue","geekblue", "purple"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const fetchVisiblePosts =  async () => {
        const response = await axios.get(VISIBLE_POSTS_API(username));
        return response.data.posts;    
    }

    const {data : visiblePosts, error} = useSWR(username, fetchVisiblePosts);

    return (
        <div>
            <Head>
                <title>Home</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            {isLogged ? (
                <div>
                    <Header selectedKey={["1"]} />
                    <div className="postList" >
                        {!visiblePosts ? <Spin tip="Loading posts ... " /> :
                            <div>
                                 <List
                                    itemLayout="vertical"
                                    dataSource={visiblePosts}
                                    size="large"
                                    renderItem={item => (
                                    <List.Item
                                        key={item.id}
                                        actions={[
                                            <a className="feedbackButton" >
                                                <LikeOutlined className="feedbackButton"/>
                                                {item.likes}
                                            </a >,
                                            <a  className="feedbackButton"
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
                                                <a>{item.author.username}</a> 
                                            }
                                            description={
                                                <div className="postDescription" >
                                                    {item.createdAt}
                                                    <br />
                                                    {item.tags.map((cat, idx) => (
                                                        <a>
                                                            <Tag key={idx} color={randomColor()}>
                                                                {cat}
                                                            </Tag>
                                                        </a>
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
                        }
                    </div>
                    <Footer className="pageFooter">Keep In Touch ©2020 Created by Yuan Wang</Footer>
                </div>
            ) : null}
        </div>
    )

}


export default Home;