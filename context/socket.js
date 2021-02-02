import React from 'react'
import socketIOClient from "socket.io-client";
const ENDPOINT="wss://myraspberrypi.work";
const socket = socketIOClient(ENDPOINT);

export const SocketContext = React.createContext(socket);