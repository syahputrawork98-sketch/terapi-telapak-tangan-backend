import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersStore, UserEntity } from '../users/users.store';
import { ROLES } from '../users/roles';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { failure } from '../common/utils/envelope';
import { hashPassword, verifyPassword } from '../common/utils/password';
import { signToken } from '../common/utils/token';

interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly usersStore: UsersStore) {}

  register(payload: RegisterDto): PublicUser {
    const details: Record<string, string> = {};

    if (!payload.name || payload.name.trim().length < 3) {
      details.name = 'name must be at least 3 characters';
    }

    if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      details.email = 'email must be valid';
    }

    if (!payload.password || payload.password.length < 8) {
      details.password = 'password must be at least 8 characters';
    }

    if (Object.keys(details).length > 0) {
      throw new HttpException(failure('Invalid register payload', 'VALIDATION_ERROR', details), HttpStatus.BAD_REQUEST);
    }

    if (this.usersStore.findByEmail(payload.email)) {
      throw new HttpException(
        failure('Email already registered', 'VALIDATION_ERROR', { email: 'email already registered' }),
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = this.usersStore.create({
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      passwordHash: hashPassword(payload.password),
      role: ROLES.USER,
    });

    return this.toPublicUser(user);
  }

  login(payload: LoginDto): { access_token: string; user: PublicUser } {
    const details: Record<string, string> = {};

    if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      details.email = 'email must be valid';
    }

    if (!payload.password || payload.password.length === 0) {
      details.password = 'password is required';
    }

    if (Object.keys(details).length > 0) {
      throw new HttpException(failure('Invalid login payload', 'VALIDATION_ERROR', details), HttpStatus.BAD_REQUEST);
    }

    const user = this.usersStore.findByEmail(payload.email);

    if (!user || !verifyPassword(payload.password, user.password_hash)) {
      throw new HttpException(failure('Invalid email or password', 'AUTH_UNAUTHORIZED'), HttpStatus.UNAUTHORIZED);
    }

    return {
      access_token: signToken({
        sub: user.id,
        role: user.role,
        email: user.email,
      }),
      user: this.toPublicUser(user),
    };
  }

  me(userId: string): PublicUser {
    const user = this.usersStore.findById(userId);

    if (!user) {
      throw new HttpException(failure('Unauthorized', 'AUTH_UNAUTHORIZED'), HttpStatus.UNAUTHORIZED);
    }

    return this.toPublicUser(user);
  }

  private toPublicUser(user: UserEntity): PublicUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
  }
}
