// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { ChatsModule } from './chats/chats.module';
import { ChatGateway } from './gateway/chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'chat_app',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    MessagesModule,
    ChatsModule,
  ],
  providers: [ChatGateway],
})
export class AppModule {}
