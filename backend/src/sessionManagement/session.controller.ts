
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Controller('api/session')
export class SessionController {
  @Get()
  getSession(@Req() req: Request) {
    const token = req.cookies['session_token'];
    return { token };
  }

  @Get('new')
  createNewSession(@Res() res: Response) {
    const newToken = uuidv4();
    res.cookie('session_token', newToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    return res.json({ token: newToken });
  }
}
