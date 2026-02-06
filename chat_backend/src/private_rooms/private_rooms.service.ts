import { Injectable } from '@nestjs/common';
import { CreatePrivateRoomDto } from './dto/get-or-private_room.dto';
import { UpdatePrivateRoomDto } from './dto/update-private_room.dto';

@Injectable()
export class PrivateRoomsService {
  create(createPrivateRoomDto: CreatePrivateRoomDto) {
    return 'This action adds a new privateRoom';
  }

  findAll() {
    return `This action returns all privateRooms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} privateRoom`;
  }

  update(id: number, updatePrivateRoomDto: UpdatePrivateRoomDto) {
    return `This action updates a #${id} privateRoom`;
  }

  remove(id: number) {
    return `This action removes a #${id} privateRoom`;
  }
}
