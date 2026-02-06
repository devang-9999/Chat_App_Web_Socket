/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SendMessageDto } from "src/messages/dto/send-message.dto";
import { generatePrivateRoomId } from "utils/roomIdGenerator";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection , OnGatewayDisconnect{
  
  @WebSocketServer()
  server : Server

  handleConnection(socket: Socket) {

    const userId = socket.handshake.auth?.userId
    if(!userId){
      socket.disconnect()
    }
    
  }

  handleDisconnect(socket: Socket) {
    const userId = socket.data?.userId

    if(!userId){
      return
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(@MessageBody() payload:SendMessageDto ,  @ConnectedSocket() socket: Socket,){

    const senderId = await socket.data.userId;
    const {recieverId , content } = payload
    const roomId = generatePrivateRoomId(senderId,recieverId)

    await socket.join(roomId)

    this.server.to(roomId).emit("message_sent",{
      
      roomId,
      senderId,
      content,
      createdAt : Date.now() ,

    })
  }

}
