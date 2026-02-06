// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { PrivateRoomsModule } from './private_rooms/private_rooms.module';
import { ChatGateway } from './chat/chat.gateway';

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
    PrivateRoomsModule,
  ],
  providers: [ChatGateway],
})
export class AppModule {}
