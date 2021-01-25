import socketIOClient from "socket.io-client";
const ENDPOINT="wss://keep-in-touch-backend.herokuapp.com:80";

let socket;

if(!global.socket){
    global.socket = socketIOClient(ENDPOINT);
}

socket = global.socket;

export default socket;