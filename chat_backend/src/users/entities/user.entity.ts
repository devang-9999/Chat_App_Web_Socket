/* eslint-disable prettier/prettier */

import { Message } from "src/messages/entities/message.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Users')
export class User {

@PrimaryGeneratedColumn('uuid')
id : string

@Column()
name : string

@Column()
email : string

@Column()
password : string

@CreateDateColumn()
createdAt : Date

@OneToMany(() => Message , (message) => message.sender)
messages : Message[]    

}
