import React, { useState, useEffect, useRef }  from 'react';
import PropTypes from 'prop-types';
import { Input, Form, Modal, Avatar, Upload, message, Divider } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { UPLOAD_API } from '../constants/api';

const UpdateAvatar = ({ visible, setVisible,loading, avatar, updateAvatar }) => {

    useEffect(() => {
        setImageUrl(null);
        setSrc(null);
        setLoading(false);
    },[visible])

    const inputRef = useRef(0);
    const [src, setSrc] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [isLoading, setLoading] = useState(false);

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
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

    const handleSrcChange = src => {
        setImageUrl(null);
        setSrc(src);
    }

    const handleChange = info => {
        setSrc(null);
        if (info.file.status === 'uploading') {
            setLoading(true);
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>{
                setImageUrl(imageUrl);
                setLoading(false);
            });
        }
    };

    return (
        <Modal
            title="Update Avatar"
            visible={visible}
            confirmLoading={loading}
            onCancel={() => setVisible(false)}
            onOk={() => updateAvatar(src || imageUrl)}
            okText={"Save Avatar"}
        >
            <div className="avatars" >
                <p>Current Avatar</p>
                <Avatar size={80} src={avatar} />
                <p>New Avatar</p>
                <Avatar size={80} src={src}/>
            </div>
            <Divider>Use a remote avatar</Divider>
            <Form>
                <Form.Item style={{marginTop : "20px"}} label="Avatar URL"  name="src">
                    <Input.TextArea ref={inputRef} onChange={(e) => handleSrcChange(e.target.value)} autoSize={{ minRows: 1, maxRows: 5 }}  />
                </Form.Item>
            </Form>
            <div className="upload" >
                <Divider>Upload a local avatar</Divider>
                <Upload
                    name="avatar"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    action={UPLOAD_API}
                    onChange={(info) => handleChange(info)}
                >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : 
                    <div>
                        {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>}
                </Upload>
            </div>
            
        </Modal>
    )
}

UpdateAvatar.propTypes = {
    visible : PropTypes.bool.isRequired,
    setVisible : PropTypes.func.isRequired,
    loading : PropTypes.bool.isRequired,
    avatar : PropTypes.string.isRequired,
    updateAvatar : PropTypes.func.isRequired
};

export default UpdateAvatar;