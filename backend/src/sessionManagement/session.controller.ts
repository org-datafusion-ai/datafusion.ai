
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('api/session')
export class SessionController {
  @Get()
  getSession(@Req() req: Request) {
    const token = req.cookies['session_token'];
    return { token };
  }
}
