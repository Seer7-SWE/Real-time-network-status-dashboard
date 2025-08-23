import { io } from 'socket.io-client';

// Same origin & default path since Socket.io is attached to Vite's server
const socket = io('/', {
  path: '/socket.io',
  transports: ['websocket']
});

export default socket;
