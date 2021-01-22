import React from 'react';
import { Image } from 'antd';
import PropTypes from 'prop-types';
import styles from './Styles/ImageWall.module.css';

const ImageWall = ({ images }) => {

    return (
        <Image.PreviewGroup>
            <div className={styles.postImages} >
                {images.map((image, index) =>
                    <Image
                        width={200}
                        height={200}
                        src={image}
                        className={styles.image}
                        key={index}
                    />)}
            </div>
        </Image.PreviewGroup> 
    )

}

ImageWall.propTypes = {
    images : PropTypes.array.isRequired
};

export default ImageWall;