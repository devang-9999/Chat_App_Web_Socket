/* eslint-disable prettier/prettier */
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Messages')
export class Message {

@PrimaryGeneratedColumn('uuid')
id : number

@Column()
senderId : number

@Column()
roomId : number

@Column('text')
content : number

@Column({nullable:true})
deliveredAt : number

@Column({nullable:true})
readAt : number

@ManyToOne(() => User , (user) => user.messages)
@JoinColumn({name:"senderId"})
sender : User

}
