import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import useSWR from 'swr';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { message, Layout, Form, Input, AutoComplete } from 'antd';
import Header from '../components/header';
import { USERS_API } from '../constants/api';

const { Footer } = Layout;

const Search = () => {

    const router = useRouter();
    const isLogged = useSelector((state) => state.isLogged);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (!isLogged) {
            message.error('Please login first');
            router.push('/');
        };
    }, []);

    const getUsers = async () => {
        const response = await axios.get(USERS_API);
        const users = response.data.users.map((username) => {
            return { value: username };
        });
        return users;
    }

    const {data : users, error} = useSWR(USERS_API, getUsers);

    const handleSearch = (value) => {
        setOptions(value ? users : []);
    };


    return (
        <div>
            <Head>
                <title>Search Page</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            {isLogged ? (
                <div>
                    <Header selectedKey={["3"]}/>
                    <div className="searchBar">
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Enter the username' }]}
                        >
                            <AutoComplete
                                options={options}
                                onSearch={handleSearch}
                                onSelect={(value) => router.push(`/profile/${value}`)}
                                filterOption={(inputValue, option) =>
                                    option.value.indexOf(inputValue) !== -1
                                }
                            >
                                <Input.Search
                                    size="large"
                                    placeholder={users ? 
                                        "Select the username" : "Loading available username..."}
                                    enterButton
                                    loading={!users}
                                />
                            </AutoComplete>
                        </Form.Item>
                    </div>
                    
                    <Footer className="pageFooter">Keep In Touch ©2020 Created by Yuan Wang</Footer>
                </div>
            ) : null}
        </div>
    )
}

export default Search;