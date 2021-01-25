import socketIOClient from "socket.io-client";
const ENDPOINT="http://myraspberrypi.work:5000";

let socket;

if(!global.socket){
    global.socket = socketIOClient(ENDPOINT);
}

socket = global.socket;

export default socket;