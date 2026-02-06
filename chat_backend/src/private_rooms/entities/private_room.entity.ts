/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Private_rooms')
export class PrivateRoom {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userAId: string

    @Column()
    userBId: string

    @CreateDateColumn()
    createdAt: Date

}
