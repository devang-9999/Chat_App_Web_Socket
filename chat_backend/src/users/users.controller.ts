/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/jwt.service';
import { JwtAuthGuard } from 'src/auth/jwt.gaurd';

@Controller('user')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post()
  async register(@Body() body) {
    const user = await this.usersService.create(body);
    return { ...user, token: this.authService.generateToken(user.id) };
  }

  @Post('login')
  async login(@Body() body) {
    const user = await this.usersService.findByEmail(body.email);
    if (user && (await user.matchPassword(body.password))) {
      return { ...user, token: this.authService.generateToken(user.id) };
    }
    throw new Error('Invalid credentials');
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  allUsers(@Query('search') search: string, @Req() req) {
    return this.usersService.searchUsers(search || '', req.user.id);
  }
}
