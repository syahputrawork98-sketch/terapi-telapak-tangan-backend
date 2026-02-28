import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Role } from './roles';

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  created_at: string;
}

@Injectable()
export class UsersStore {
  private readonly users: UserEntity[] = [];

  create(input: { name: string; email: string; passwordHash: string; role: Role }): UserEntity {
    const user: UserEntity = {
      id: randomUUID(),
      name: input.name,
      email: input.email,
      password_hash: input.passwordHash,
      role: input.role,
      created_at: new Date().toISOString(),
    };

    this.users.push(user);
    return user;
  }

  findByEmail(email: string): UserEntity | null {
    return this.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  findById(id: string): UserEntity | null {
    return this.users.find((user) => user.id === id) ?? null;
  }
}
