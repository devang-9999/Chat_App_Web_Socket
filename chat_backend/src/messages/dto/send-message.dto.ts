import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  recieverId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  chatId: string;
}
