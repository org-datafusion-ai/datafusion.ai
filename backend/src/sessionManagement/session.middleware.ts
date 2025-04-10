/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const COOKIE_NAME = 'session_token';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const existingToken = (req.cookies as { [key: string]: string })[
      COOKIE_NAME
    ];

    if (!existingToken) {
      const newToken = uuidv4();
      res.cookie(COOKIE_NAME, newToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });
      req.cookies[COOKIE_NAME] = newToken;
    }

    next();
  }
}
