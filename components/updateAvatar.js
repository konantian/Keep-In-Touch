import React, { useState }  from 'react';
import PropTypes from 'prop-types';
import { Input,Form,Modal,Avatar } from 'antd';

const UpdateAvatar = ({ visible, setVisible,loading, avatar, updateAvatar }) => {

    const [src, setSrc] = useState(null);

    return (
        <Modal
            title="Update Avatar"
            visible={visible}
            confirmLoading={loading}
            onCancel={() => setVisible(false)}
            onOk={() => updateAvatar(src)}
            okText={"Save Avatar"}
        >
            <div className="avatars" >
                <p>Current Avatar</p>
                <Avatar size={80} src={avatar} />
                <p>New Avatar</p>
                <Avatar size={80} src={src}/>
            </div>
            <Form.Item style={{marginTop : "20px"}} label="Avatar URL"  name="src">
                <Input.TextArea  onChange={(e) => setSrc(e.target.value)} autoSize={{ minRows: 1, maxRows: 5 }}  />
            </Form.Item>
        </Modal>
    )
}

UpdateAvatar.propTypes = {
    visible : PropTypes.bool.isRequired,
    setVisible : PropTypes.func.isRequired,
    loading : PropTypes.bool.isRequired,
    avatar : PropTypes.string.isRequired,
    updateAvatar : PropTypes.func.isRequired
};

export default UpdateAvatar;