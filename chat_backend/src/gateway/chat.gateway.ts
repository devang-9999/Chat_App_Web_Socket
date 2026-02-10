/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    console.log('Connected');
  }

  @SubscribeMessage('setup')
  async setup(socket: Socket, user) {
    await socket.join(user.id);
    socket.emit('connected');
  }

  @SubscribeMessage('join chat')
  async joinChat(socket: Socket, room: string) {
    await socket.join(room);
  }

  @SubscribeMessage('new message')
  handleNewMessage(_, message) {
    message.chat.users.forEach((user) => {
      if (user.id === message.sender.id) return;
      this.server.to(user.id).emit('message recieved', message);
    });
  }
}
