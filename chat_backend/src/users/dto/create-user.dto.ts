/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsString } from "class-validator";

/* eslint-disable prettier/prettier */
export class CreateUserDto {

    @IsString()
    name : string

    @IsEmail()
    email : string

    @IsString()
    password : string
}
