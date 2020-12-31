import React from 'react';
import axios from 'axios';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { message} from 'antd';
import { TAGS_API, POSTS_API } from '../constants/api';

const DynamicPost= dynamic(() => import('../components/postForm'))

const PostEditor = () => {

    const router = useRouter();
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
           visibility : values.visibility
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
            <DynamicPost onFinish={onFinish} text="Post" tags={tags} initialValues={null}/>
        </div>
        
    )
}

export default PostEditor;