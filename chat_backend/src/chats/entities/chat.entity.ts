/* eslint-disable prettier/prettier */
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';


@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  chatName: string;

  @Column({ default: false })
  isGroupChat: boolean;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @ManyToOne(() => User, { nullable: true })
  groupAdmin: User;

  @OneToOne(() => Message, { nullable: true })
  @JoinColumn()
  latestMessage: Message;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
