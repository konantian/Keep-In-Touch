import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { message, Upload, Image, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TAGS_API, POSTS_API, UPLOAD_API } from '../constants/api';

const DynamicPost= dynamic(() => import('../components/postForm'))

const PostEditor = () => {

    const router = useRouter();
    const username = useSelector((state) => state.username);
    const [tags, setTags] = useState(null);
    const [loading, setLoading] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        getTags(TAGS_API);
    },[])

    const getTags = async ( url ) => {
        const response = await axios.get(url, {withCredentials: true});
        response.data.tags.sort((a, b) => {
            return a.length - b.length;
        })
        setTags(response.data.tags);;
    }

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
    }

    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async file => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewVisible(true);
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList }) => setFileList(fileList);

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

    const onFinish =  async values => {
        setLoading(true);
        const postData = {
           username : username,
           title : values.title,
           contentType : values.contentType,
           content : values.content,
           visibility : values.visibility
        };
        if(values.tags) {
            const tags = values.tags.map(tag => {
                return {name : tag};
            });
            postData.tags = tags;
        }
        if(fileList){
            const images = await Promise.all(fileList.map(async file => {
                if(!file.preview){
                    const imageUrl = await getBase64(file.originFileObj);
                    return {src : imageUrl};
                }else{
                    return {src: file.preview};
                }
            }));
            postData.images = images;
        }
        const config = {withCredentials: true};

       axios.post(POSTS_API, postData, config).then((res) =>{
           message.success(res.data['success'],[0.5]);
           router.push("/home");
           setLoading(false);
       }).catch((err) => {
           console.log(err);
       })
    }

    return (
        <div>
            
            <div className="uploadImages" >
                <span>Upload Images</span>  
                <Upload
                    action={UPLOAD_API}
                    listType="picture-card"
                    fileList={fileList}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={handleChange}
                >
                    {fileList.length >= 4 ? null :
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>}
                </Upload>

            </div>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <Image alt="preview" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            <DynamicPost onFinish={onFinish} text="Post" tags={tags} loading={loading} initialValues={{visibility : "PUBLIC"}}/>
        </div>
        
    )
}

export default PostEditor;