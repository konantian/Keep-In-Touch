import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCookies } from "react-cookie";
import { message, Spin } from 'antd';
import { POST_BY_ID, TAGS_API } from '../../constants/api';

const DynamicHeader = dynamic(() => import('../../components/header'))
const DynamicFooter = dynamic(() => import('../../components/footer'))
const DynamicPostForm = dynamic(() => import('../../components/postForm'))

const EditPost = () => {

    const router = useRouter();
    const [initialValues, setInitialValues] = useState(null);
    const [cookie] = useCookies(["user"]);

    useEffect(() => {
        if(!cookie['user']) {
            router.push('/');
            message.error("Please login first",[1]);
        }
    }, []);

    useEffect(() => {
        if (router.asPath !== router.route) {
            getPost(router.query.id)
        }
    }, [router])

    const getPost = async ( postId ) => {
        const response = await axios.get(POST_BY_ID(postId), {withCredentials: true});
        const post = response.data;
        setInitialValues(post);
    }

    const getTags = async ( url ) => {
        const response = await axios.get(url,  {withCredentials: true});
        response.data.tags.sort((a, b) => {
            return a.length - b.length;
        })
        return response.data.tags;
    }

    const onFinish = values => {
        const postData = {
           title : values.title,
           contentType : values.contentType,
           content : values.content,
           visibility : values.visibility
        };

        const config =  {withCredentials: true};

       axios.patch(POST_BY_ID(router.query.id), postData, config).then((res) =>{
           message.success(res.data['success'],[0.5]);
           router.push("/home");
       }).catch((err) => {
           console.log(err);
       })
    }

    const { data : tags, error} = useSWR(TAGS_API, getTags);

    return (
        <div>
            <Head>
                <title>Edit Post</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            {cookie['user'] ? 
                <div className="main">
                    <DynamicHeader selectedKey={["2"]}/>
                    <div className="pageContainer">
                        {!initialValues ? 
                            <div className="loader" >
                                <Spin size="large" tip="Loading user's profile ... "/>
                            </div> : 
                            <DynamicPostForm 
                                onFinish={onFinish} 
                                text="Save" 
                                tags={tags} 
                                initialValues={initialValues}
                            />
                        }
                    </div>
                    <DynamicFooter />

                </div> : null
            }
        </div>
    )
}

export default EditPost;

