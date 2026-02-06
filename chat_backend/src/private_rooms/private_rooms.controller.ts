import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrivateRoomsService } from './private_rooms.service';
import { CreatePrivateRoomDto } from './dto/get-or-private_room.dto';
import { UpdatePrivateRoomDto } from './dto/update-private_room.dto';

@Controller('private-rooms')
export class PrivateRoomsController {
  constructor(private readonly privateRoomsService: PrivateRoomsService) {}

  @Post()
  create(@Body() createPrivateRoomDto: CreatePrivateRoomDto) {
    return this.privateRoomsService.create(createPrivateRoomDto);
  }

  @Get()
  findAll() {
    return this.privateRoomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.privateRoomsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrivateRoomDto: UpdatePrivateRoomDto) {
    return this.privateRoomsService.update(+id, updatePrivateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.privateRoomsService.remove(+id);
  }
}
