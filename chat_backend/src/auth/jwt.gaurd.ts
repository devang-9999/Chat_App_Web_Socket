/* eslint-disable @typescript-eslint/no-unsafe-call */
// auth/jwt.guard.ts
import { AuthGuard } from '@nestjs/passport';
export class JwtAuthGuard extends AuthGuard('jwt') {}
