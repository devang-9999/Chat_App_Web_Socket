/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { JwtAuthGuard } from 'src/auth/jwt.gaurd';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private service: ChatsService) {}

  @Post()
  accessChat(@Req() req, @Body('userId') userId: string) {
    return this.service.accessChat(req.user, userId);
  }

  @Get()
  fetchChats(@Req() req) {
    return this.service.fetchChats(req.user.id);
  }
}
