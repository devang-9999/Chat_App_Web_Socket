/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MessagesService {
  messageRepo: any;
  constructor(
    @InjectRepository(Message) private repo: Repository<Message>,
    @InjectRepository(Chat) private chatRepo: Repository<Chat>,
  ) {}

  allMessages(chatId: string) {
    return this.repo.find({
      where: { chat: { id: chatId } },
      relations: ['sender', 'chat'],
    });
  }

  async sendMessage(user: User, content: string, chatId: string) {
    const message = await this.messageRepo.save({
      sender: user,
      content,
      chat: { id: chatId } as Chat,
    });

    const fullMessage = await this.messageRepo.findOne({
      where: { id: message.id },
      relations: ['sender', 'chat', 'chat.users'],
    });

    if (!fullMessage) {
      throw new Error('Message creation failed');
    }

    const chat = await this.chatRepo.findOne({
      where: { id: chatId },
    });

    if (!chat) {
      throw new Error('Chat not found');
    }

    chat.latestMessage = fullMessage;
    await this.chatRepo.save(chat);

    return fullMessage;
  }
}
