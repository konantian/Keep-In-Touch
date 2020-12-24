import React  from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { PageHeader,  Descriptions, Button } from 'antd';

const ProfileHeader = ({ profile, username }) => {

    const currentUser = useSelector((state) => state.username);

    return (
        <PageHeader
            ghost={false}
            title={profile.name}
            subTitle={username}
            extra={[currentUser !== username ?
                <Button className="followButton" size="large" shape="round" type="primary" key="3">Follow</Button> : null,
            ]}
            avatar={{ src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4' }}
        >
            <Descriptions size="middle" column={2} className="descriptions">
                <Descriptions.Item label="Email" labelStyle={{"fontWeight" : "bold"}}>{profile.email}</Descriptions.Item>
                <Descriptions.Item label="Last Login" labelStyle={{"fontWeight" : "bold"}} >{profile.lastLogin}</Descriptions.Item>
                <Descriptions.Item label="Followers" labelStyle={{"fontWeight" : "bold"}}>{profile.followers}</Descriptions.Item>
                <Descriptions.Item label="Following" labelStyle={{"fontWeight" : "bold"}}>{profile.following}</Descriptions.Item>
                <Descriptions.Item label="Biography" labelStyle={{"fontWeight" : "bold"}}>{profile.bio}</Descriptions.Item>
            </Descriptions>
        </PageHeader>
    )
}

ProfileHeader.propTypes = {
    profile: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
};

export default ProfileHeader;