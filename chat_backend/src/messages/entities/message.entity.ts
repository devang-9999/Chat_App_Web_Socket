import { Chat } from 'src/chats/entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => Chat)
  chat: Chat;

  @ManyToMany(() => User)
  @JoinTable()
  readBy: User[];

  @CreateDateColumn()
  createdAt: Date;
}
