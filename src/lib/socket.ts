import { io, type Socket } from 'socket.io-client';
import { SOCKET_URL } from './env';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
  return socket;
}
