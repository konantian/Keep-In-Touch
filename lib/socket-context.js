import socketIOClient from "socket.io-client";
const ENDPOINT="wss://myraspberrypi.work";

let socket;

if(!global.socket){
    global.socket = socketIOClient(ENDPOINT);
}

socket = global.socket;

export default socket;