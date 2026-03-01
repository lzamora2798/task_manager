import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_secret',
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthController],   // 👈 THIS WAS MISSING
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}