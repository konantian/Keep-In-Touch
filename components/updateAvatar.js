import React, { useState, useRef }  from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { mutate } from 'swr';
import { Input, Form, Modal, Avatar, Upload, message, Divider } from 'antd';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { UPLOAD_API, AVATAR_API } from '../constants/api';
import styles from './Styles/UpdateAvatar.module.css';

const { Dragger } = Upload;

const UpdateAvatar = ({ visible, setVisible, avatar, api, username, setAvatar }) => {

    const formRef = useRef(0);
    const [src, setSrc] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const updateAvatar = ( value ) => {
        setSaving(true);
        const data = { avatar : value};
        const config = {withCredentials: true};
        axios.patch(AVATAR_API(username), data, config).then(res =>{
            mutate(api);
            setSaving(false);
            setVisible(false);
            setAvatar(value);
            setSrc(null);
            formRef.current.resetFields();
        }).catch((err) => {
            console.log(err);
        })
    }

    const getBase64 = (img, callback)=>{
        const reader = new FileReader();
        reader.onload = () => callback(reader.result);
        reader.readAsDataURL(img);
      }
      
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must smaller than 5MB!');
        }
        return isJpgOrPng && isLt5M;
    }

    const handleCancel = () => {
        setVisible(false);
        setSrc(null);
        formRef.current.resetFields();
    }

    const handleChange = info => {
        if (info.file.status === 'uploading') {
            setLoading(true);
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>{
                setSrc(imageUrl);
                setLoading(false);
            });
        }
    };

    return (
        <Modal
            title="Update Avatar"
            visible={visible}
            confirmLoading={saving}
            onCancel={() => handleCancel()}
            onOk={() => updateAvatar(src)}
            okText={"Save Avatar"}
        >
            <div className={styles.avatars} >
                <p>Current Avatar</p>
                <Avatar size={80} src={avatar} />
                <p>New Avatar</p>
                <Avatar size={80} src={src}/>
            </div>
            <Divider>Use a remote avatar</Divider>
            <Form ref={formRef} >
                <Form.Item style={{marginTop : "20px"}} label="Avatar URL"  name="src">
                    <Input.TextArea onChange={(e) => setSrc(e.target.value)} autoSize={{ minRows: 2, maxRows: 5 }}  />
                </Form.Item>
            </Form>
            <Divider>Upload a local avatar</Divider>
            <Dragger
                name="avatar"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={beforeUpload}
                action={UPLOAD_API}
                onChange={(info) => handleChange(info)}
            >
                {isLoading ? <LoadingOutlined /> : <UploadOutlined style={{fontSize : "30px"}} />}
                <p>Click or drag file to this area to upload</p>
            </Dragger>
            
            
        </Modal>
    )
}

UpdateAvatar.propTypes = {
    visible : PropTypes.bool.isRequired,
    setVisible : PropTypes.func.isRequired,
    avatar : PropTypes.string.isRequired,
    api : PropTypes.string.isRequired,
    username : PropTypes.string.isRequired,
    setAvatar : PropTypes.func.isRequired
};

export default UpdateAvatar;