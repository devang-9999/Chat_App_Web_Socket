// messages/messages.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from 'src/auth/jwt.gaurd';
import type { RequestWithUser } from 'src/interfaces/userInterface';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('message')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get(':chatId')
  allMessages(@Param('chatId') chatId: string) {
    return this.messagesService.allMessages(chatId);
  }

  @Post()
  sendMessage(@Req() req: RequestWithUser, @Body() body: SendMessageDto) {
    return this.messagesService.sendMessage(
      req.user,
      body.content,
      body.chatId,
    );
  }
}
