/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */


import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";

@WebSocketGateway({ cors: { origin: "*" } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  ROOM="group"

  @WebSocketServer()
  server: Server

  handleConnection(client: Socket) {
    console.log("New client Connected", client.id)
    this.server.emit("user-joined",{
      message : `  User joined the chat with client id ${client.id}`
    })

  }

  handleDisconnect(client: Socket) {
    console.log("Client Disconnected", client.id)
    this.server.emit("user-left",{
      message : `  User left the chat with client id ${client.id}`
    })
  }

  @SubscribeMessage('joinChat')
  async handleMessage(client: Socket, payload: string) {
    console.log(`${payload} is joining the chat`)
    client.emit("replyEvent","This is the reply from server")
    await client.join(this.ROOM)
    // client.to(this.ROOM).emit('roomNotice',payload);
    // console.log("Recived Message")
  }
}
