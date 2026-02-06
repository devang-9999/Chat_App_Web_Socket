import { Module } from '@nestjs/common';
import { PrivateRoomsService } from './private_rooms.service';
import { PrivateRoomsController } from './private_rooms.controller';

@Module({
  controllers: [PrivateRoomsController],
  providers: [PrivateRoomsService],
})
export class PrivateRoomsModule {}
