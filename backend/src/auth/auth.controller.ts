import { Body, Controller, Post, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('login')
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly auth: AuthService,
  ) {}

  @Post()
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.username, dto.password);
  }
}