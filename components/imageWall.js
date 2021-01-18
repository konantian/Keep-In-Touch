import React from 'react';
import { Image } from 'antd';
import PropTypes from 'prop-types';

const ImageWall = ({ images }) => {

    return (
        <Image.PreviewGroup>
            <div className="postImages" >
                {images.map((image, index) =>
                    <Image
                        width={200}
                        height={200}
                        src={image}
                        className="image"
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