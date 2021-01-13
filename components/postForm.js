import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkDown from "react-markdown";
import { Form, Input, Button, Radio, Select, Tag, Modal } from 'antd';
import { randomColor } from '../utils/randomColor';

const { Option } = Select;
const { TextArea } = Input;

const PostForm = ({ onFinish, text, tags, initialValues }) => {

    const formRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [type, setType] = useState(null);

    useEffect(() => {
        if(initialValues !== null){
            setType(initialValues.contentType)
        }
    }, [initialValues])

    return (
        <div>
            <Form 
                layout="horizontal" 
                onFinish={onFinish} 
                style={{"marginTop" : "15%"}}
                ref={formRef}
                initialValues={initialValues}
            >
                <Form.Item label="Content Type" name="contentType" >
                    <Radio.Group onChange={(e) => setType(e.target.value)} >
                        <Radio.Button value="markdown">Markdown</Radio.Button>
                        <Radio.Button value="text">Text</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item 
                    label="Title" 
                    name="title" 
                    rules={[{required: true,message: 'Please enter your title !',}]}
                >
                    <Input placeholder="Please type your title" />
                </Form.Item>
                <Form.Item
                    name="tags"
                    label="Tags"
                >
                    <Select mode="tags" placeholder="Please select or enter your tags">
                        {!tags ? null  : tags.map((tag,idx) => 
                            <Option key={idx} value={tag}>
                                <Tag color={randomColor()}>{tag}</Tag>
                            </Option>
                        )}
                    </Select>
                </Form.Item>
                <Form.Item 
                    label="Visibility" 
                    name="visibility"
                >
                    <Select>
                        <Select.Option value="PUBLIC">PUBLIC</Select.Option>
                        <Select.Option value="FOLLOWERS">FOLLOWERS</Select.Option>
                        <Select.Option value="FRIENDS">FRIENDS</Select.Option>
                        <Select.Option value="PRIVATE">PRIVATE</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item 
                    name="content"
                    rules={[{required: true,message: 'Please enter your content!',}]}
                >
                    <TextArea 
                        showCount
                        placeholder="Add your content here"
                        allowClear={true}
                        autoSize={{ minRows: 12, maxRows: 20}}
                    />
                </Form.Item>
                <div className="loginButtons">
                    <Form.Item >
                        <Button className="authButton" type="primary" htmlType="submit" shape="round" size="large" >{text}</Button>
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

PostForm.propTypes = {
    onFinish : PropTypes.func.isRequired,
    text : PropTypes.string.isRequired,
    tags : PropTypes.array,
    initialValues : PropTypes.object,
};

export default PostForm;