import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { success } from '../common/utils/envelope';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

interface RequestWithUser {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    const user = this.authService.register(body);
    return success('Register success', user);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() body: LoginDto) {
    const data = this.authService.login(body);
    return success('Login success', data);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() req: RequestWithUser) {
    const user = this.authService.me(req.user!.id);
    return success('Profile fetched', user);
  }
}
