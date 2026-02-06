/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class SendMessageDto {
    
    @IsUUID()
    recieverId : string;

    @IsString()
    @IsNotEmpty()
    content : string;
    
}
