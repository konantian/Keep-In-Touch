import React, { useEffect  } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { message } from 'antd';

const DynamicHeader= dynamic(() => import('../components/header'))
const DynamicFooter = dynamic(() => import('../components/footer'))
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
                    <DynamicFooter />
                </div>
            ) : null}
        </div>
    )
}

export default Search;