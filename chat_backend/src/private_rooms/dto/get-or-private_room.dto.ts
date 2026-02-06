/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsUUID } from 'class-validator';

export class GetOrCreatePrivateRoomDto {
  @IsUUID()
  userAId: string;

  @IsUUID()
  userBId: string;
}