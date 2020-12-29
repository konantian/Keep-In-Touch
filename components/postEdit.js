import React, { useState, useRef } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import ReactMarkDown from "react-markdown";
import { message, Form, Input, Button, Radio, Select, Tag, Modal } from 'antd';
import { TAGS_API, POSTS_API } from '../constants/api';
import { randomColor } from '../utils/randomColor';

const { Option } = Select;
const { TextArea } = Input;

const PostEditor = () => {

    const formRef = useRef(null);
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [type, setType] = useState('text');
    const username = useSelector((state) => state.username);

    const getTags = async ( url ) => {
        const response = await axios.get(url);
        response.data.tags.sort((a, b) => {
            return a.length - b.length;
        })
        return response.data.tags;
    }

    const { data : tags, error} = useSWR(TAGS_API, getTags);

    const onFinish = values => {
        const postData = {
           username : username,
           title : values.title,
           contentType : values.type,
           content : values.content,
        };
        if(values.tags) {
            const tags = values.tags.map(tag => {
                return {name : tag};
            });
            postData.tags = tags;
        }

       axios.post(POSTS_API,postData).then((res) =>{
           message.success(res.data['success'],[0.5]);
           router.push("/home");
       }).catch((err) => {
           console.log(err);
       })
    }

    return (
        <div>
            <Form 
                layout="horizontal" 
                onFinish={onFinish} 
                style={{"marginTop" : "15%"}} 
                onValuesChange={({type}) => setType(type)}
                ref={formRef}
            >
                <Form.Item label="Content Type" name="type">
                    <Radio.Group>
                        <Radio.Button value="markdown">Markdown</Radio.Button>
                        <Radio.Button value="text">Text</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="Title" name="title" >
                    <Input placeholder="Please type your title" />
                </Form.Item>
                <Form.Item
                    name="tags"
                    label="Tags"
                >
                    <Select mode="tags" placeholder="Please select your tags">
                        {!tags ? null  : tags.map((tag,idx) => 
                            <Option key={idx} value={tag}>
                                <Tag color={randomColor()}>{tag}</Tag>
                            </Option>
                        )}
                    </Select>
                </Form.Item>
                <Form.Item name="content">
                    <TextArea 
                        showCount
                        placeholder="Add your content here"
                        allowClear={true}
                        autoSize={{ minRows: 12, maxRows: 20}}
                    />
                </Form.Item>
                <div className="loginButtons">
                    <Form.Item >
                        <Button className="authButton" type="primary" htmlType="submit" shape="round" size="large" >Post</Button>
                    </Form.Item>
                    {type === 'markdown' ?
                    <Form.Item >
                        <Button className="authButton" type="primary" onClick={() => setVisible(true)} shape="round" size="large" >Preview</Button>
                    </Form.Item> : null}

                </div>
            </Form>
            <Modal
                title="Markdown post preview"
                centered
                visible={visible}
                onCancel={() => setVisible(false)}
                onOk={() => setVisible(false)}
                width={1000}
                bodyStyle={{"height" : "700px"}}
            > 
                <ReactMarkDown source={formRef.current ? formRef.current.getFieldValue("content") : ''} />
            </Modal>
        </div>
        
        
    )
}

export default PostEditor;