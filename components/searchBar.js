import React, { useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { Form, Input, AutoComplete } from 'antd';
import { USERS_API } from '../constants/api';

const SearchBar = () => {

    const router = useRouter();
    const [options, setOptions] = useState([]);


    const getUsers = async () => {
        const response = await axios.get(USERS_API,{withCredentials: true});
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
            <Form.Item>
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
                            "Search other authors by username" : 
                            "Loading available username..."}
                        enterButton
                        loading={!users}
                    />
                </AutoComplete>
            </Form.Item>
        </div>
    )
}

export default SearchBar;