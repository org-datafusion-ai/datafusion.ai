
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('api/session')
@ApiTags('session')
export class SessionController {
  @Get()
  @ApiOperation({ summary: `Retrieve the user's session token` })
  @ApiResponse({ status: 200, description: `The user's session token was successfully retrieved.` })
  getSession(@Req() req: Request) {
    const token = req.cookies['session_token'];
    return { token };
  }

  @Get('new')
  @ApiOperation({ summary: 'Generate a new session token' })
  @ApiResponse({ status: 200, description: 'A new session token has been successfully generated.' })
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
