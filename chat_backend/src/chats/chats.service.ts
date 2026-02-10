import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChatsService {
  constructor(@InjectRepository(Chat) private repo: Repository<Chat>) {}

  async createGroupChat(name: string, users: User[], admin: User) {
    if (users.length < 2) {
      throw new Error('More than 2 users required');
    }

    users.push(admin);

    return this.repo.save({
      chatName: name,
      isGroupChat: true,
      users,
      groupAdmin: admin,
    });
  }

  async renameGroup(chatId: string, chatName: string) {
    await this.repo.update(chatId, { chatName });
    return this.repo.findOne({
      where: { id: chatId },
      relations: ['users', 'groupAdmin'],
    });
  }

  async addToGroup(chatId: string, user: User) {
    const chat = await this.repo.findOne({
      where: { id: chatId },
      relations: ['users'],
    });
    if (!chat) {
      return 'No user exist';
    }
    chat.users.push(user);
    return this.repo.save(chat);
  }

  async removeFromGroup(chatId: string, userId: string) {
    const chat = await this.repo.findOne({
      where: { id: chatId },
      relations: ['users'],
    });
    if (!chat) {
      return 'No user exist';
    }
    chat.users = chat.users.filter((u) => u.id !== userId);
    return this.repo.save(chat);
  }

  async accessChat(currentUser: User, userId: string) {
    const chats = await this.repo
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.users', 'user')
      .where('chat.isGroupChat = false')
      .andWhere('user.id IN (:...ids)', {
        ids: [currentUser.id, userId],
      })
      .getMany();

    if (chats.length) return chats[0];

    return this.repo.save({
      chatName: 'sender',
      isGroupChat: false,
      users: [{ id: currentUser.id }, { id: userId }] as User[],
    });
  }

  fetchChats(userId: string) {
    return this.repo
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.users', 'users')
      .leftJoinAndSelect('chat.groupAdmin', 'groupAdmin')
      .leftJoinAndSelect('chat.latestMessage', 'latestMessage')
      .where('users.id = :userId', { userId })
      .orderBy('chat.updatedAt', 'DESC')
      .getMany();
  }
}
