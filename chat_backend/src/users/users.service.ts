/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) { }

  create(data: Partial<User>) {
    return this.repo.save(data);
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

searchUsers(search: string, userId: string) {
  return this.repo
    .createQueryBuilder('user')
    .where(
      '(user.name ILIKE :search OR user.email ILIKE :search)',
      { search: `%${search}%` },
    )
    .andWhere('user.id != :userId', { userId })
    .getMany();
}

}
