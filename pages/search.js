import React, { useEffect  } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { message, Layout } from 'antd';

const { Footer } = Layout;
const DynamicHeader= dynamic(() => import('../components/Header'))
const DynamicSearchBar= dynamic(() => import('../components/searchBar'))

const Search = () => {

    const router = useRouter();
    const isLogged = useSelector((state) => state.isLogged);
    
    useEffect(() => {
        if (!isLogged) {
            message.error('Please login first');
            router.push('/');
        };
    }, []);

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
                    <DynamicHeader selectedKey={["3"]}/>
                    <DynamicSearchBar />
                    <Footer className="pageFooter">Keep In Touch ©2020 Created by Yuan Wang</Footer>
                </div>
            ) : null}
        </div>
    )
}

export default Search;