import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { failure } from '../common/utils/envelope';
import { hashPassword } from '../common/utils/password';
import { ROLES } from '../users/roles';
import { UserEntity, UsersStore } from '../users/users.store';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

@Injectable()
export class SuperAdminService {
  constructor(private readonly usersStore: UsersStore) {}

  createAdmin(payload: CreateAdminDto): PublicUser {
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

    if (payload.role !== ROLES.ADMIN) {
      details.role = 'role must be ADMIN';
    }

    if (Object.keys(details).length > 0) {
      throw new HttpException(failure('Invalid create admin payload', 'VALIDATION_ERROR', details), HttpStatus.BAD_REQUEST);
    }

    const normalizedEmail = payload.email.trim().toLowerCase();

    if (this.usersStore.findByEmail(normalizedEmail)) {
      throw new HttpException(
        failure('Email already registered', 'VALIDATION_ERROR', { email: 'email already registered' }),
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = this.usersStore.create({
      name: payload.name.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(payload.password),
      role: ROLES.ADMIN,
    });

    return this.toPublicUser(user);
  }

  listAdmins(): PublicUser[] {
    return this.usersStore.listByRole(ROLES.ADMIN).map((user) => this.toPublicUser(user));
  }

  updateAdmin(id: string, payload: UpdateAdminDto): PublicUser {
    const user = this.usersStore.findById(id);

    if (!user || user.role !== ROLES.ADMIN) {
      throw new HttpException(failure('Admin not found', 'RESOURCE_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }

    const details: Record<string, string> = {};

    if (payload.name !== undefined && payload.name.trim().length < 3) {
      details.name = 'name must be at least 3 characters';
    }

    if (payload.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      details.email = 'email must be valid';
    }

    if (payload.role !== undefined && payload.role !== ROLES.ADMIN) {
      details.role = 'role must be ADMIN';
    }

    if (Object.keys(details).length > 0) {
      throw new HttpException(failure('Invalid update admin payload', 'VALIDATION_ERROR', details), HttpStatus.BAD_REQUEST);
    }

    const normalizedEmail = payload.email?.trim().toLowerCase();
    if (normalizedEmail && normalizedEmail !== user.email) {
      const existing = this.usersStore.findByEmail(normalizedEmail);
      if (existing) {
        throw new HttpException(
          failure('Email already registered', 'VALIDATION_ERROR', { email: 'email already registered' }),
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const updated = this.usersStore.update(id, {
      name: payload.name?.trim(),
      email: normalizedEmail,
      role: payload.role,
    });

    if (!updated) {
      throw new HttpException(failure('Admin not found', 'RESOURCE_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }

    return this.toPublicUser(updated);
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
