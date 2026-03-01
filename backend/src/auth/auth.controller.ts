import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('login') // matches requirement exactly
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post()
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.username, dto.password);
  }
}