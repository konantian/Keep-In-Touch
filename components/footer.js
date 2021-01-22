import React from 'react';
import { Layout } from 'antd';
import styles from './Styles/Footer.module.css';

const { Footer } = Layout;

const PageFooter = () => {

    return (
        <Footer className={styles.pageFooter}>Keep In Touch ©2020 Created by Yuan Wang</Footer>
    )
}

export default PageFooter