/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() dto:CreateUserDto){
    const user = await this.usersService.createUser(dto)
    return {
      id : user.id ,
      name : user.name
    }
  }
}
