import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

type User = {
  id: number;
  username: string;
  passwordHash: string;
};

// ✅ recomendado: hash constante o inicialización lazy (para Lambda)
const HASH_TEST1234 = bcrypt.hashSync('Test1234', 10);
const seedUsers: User[] = [
  { id: 1, username: 'user1', passwordHash: HASH_TEST1234 },
  { id: 2, username: 'user2', passwordHash: HASH_TEST1234 },
  { id: 3, username: 'user3', passwordHash: HASH_TEST1234 },
];

@Injectable()
export class AuthService {
  constructor(
    @Inject(JwtService) private readonly jwt: JwtService,
  ) {}

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

  getUserById(id: number) {
    return seedUsers.find((u) => u.id === id);
  }
}