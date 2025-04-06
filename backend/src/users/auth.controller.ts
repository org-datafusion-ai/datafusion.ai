import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  register(@Body() user: User) {
    this.authService.register(user);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  login(@Body() credentials: { email: string; password: string }) {
    const token = this.authService.login(
      credentials.email,
      credentials.password,
    );
    return { access_token: token };
  }

  @Post('logout')
  @HttpCode(204) // HTTP 204 No Content
  logout(@Req() req: { headers: { authorization?: string } }) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    this.authService.logout(token);
    return; // Return nothing, status code 204
  }

  @Get('me')
  getProfile(@Body('token') token: string) {
    const user = this.authService.verifyToken(token);
    if (!user) {
      return { error: 'User not found or token invalid' };
    }
    return { user };
  }
}
