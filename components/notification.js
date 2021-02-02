import React, { useEffect, useContext } from 'react';
import { SocketContext } from '../context/socket';
import { openNotificationWithIcon } from '../utils/notification';

const Notification = () => {

    const socket = useContext(SocketContext);

    useEffect(() => {
        socket.on("follow", data => {
            if(data.user === username){
                openNotificationWithIcon('info','New follower', `${data.follower} just followed you`);
            }
        });

        return () => socket.off('follow');
        
    }, []);

    return (
        <div>
            
        </div>
    );
    
}

export default Notification;