/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import bcrypt from "bcrypt"
import { LoginDto } from './dto/login-user.dto';
import jwt from "jsonwebtoken"

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async createUser(dto: CreateUserDto) {
    const { name, email, password } = dto
    const exisitingUser = await this.userRepository.find({
      where: { email }
    })

    if (exisitingUser) {
      throw new BadRequestException("User already in use")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword
    })

    await this.userRepository.save(user)
    return user
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) throw new BadRequestException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new BadRequestException('Invalid credentials');

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    return { token };
  }

  async findUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: id }
    })

    if (!user) {
      throw new HttpException("User not found", 404)
    }
  }

}
