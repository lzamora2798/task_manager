import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

type User = {
  id: number;
  username: string;
  passwordHash: string;
};

// Usuarios de prueba (lo que te piden entregar)
const seedUsers: User[] = [
  // password: Test1234
  { id: 1, username: 'user1', passwordHash: bcrypt.hashSync('Test1234', 10) },
  { id: 2, username: 'user2', passwordHash: bcrypt.hashSync('Test1234', 10) },
  { id: 3, username: 'user3', passwordHash: bcrypt.hashSync('Test1234', 10) },
];

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  async login(username: string, password: string) {
    const user = seedUsers.find((u) => u.username === username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwt.signAsync(payload),
      user: { id: user.id, username: user.username },
    };
  }

  // útil para Tasks (owner)
  getUserById(id: number) {
    return seedUsers.find((u) => u.id === id);
  }
}