import React, { useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useCookies } from "react-cookie";
import { useRouter } from 'next/router';
import { message } from 'antd';

const DynamicHeader= dynamic(() => import('../components/header'))
const DynamicFooter = dynamic(() => import('../components/footer'))
const DynamicSearchBar= dynamic(() => import('../components/searchBar'))

const Search = () => {

    const router = useRouter();
    const [cookie] = useCookies();
    
    useEffect(() => {
        if(!cookie['user']) {
            router.push('/');
            message.error("Your Session has expired please login first",[1]);
        }
    }, []);

    return (
        <div>
            <Head>
                <title>Search</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            {cookie['user'] ? 
                <div className="main">
                    <DynamicHeader selectedKey={["3"]}/>
                    <div className="pageContainer">
                        <DynamicSearchBar />
                    </div>
                    <DynamicFooter />
                </div> : null
            }
        </div>
        
    )
}

export default Search;