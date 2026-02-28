import { Injectable, OnModuleInit } from '@nestjs/common';
import { hashPassword } from '../common/utils/password';
import { ENV } from '../config/env';
import { ROLES } from '../users/roles';
import { UsersStore } from '../users/users.store';

@Injectable()
export class DevSeedService implements OnModuleInit {
  constructor(private readonly usersStore: UsersStore) {}

  onModuleInit(): void {
    if (!ENV.DEV_SEED_ENABLED) {
      return;
    }

    const existing = this.usersStore.findByEmail(ENV.DEV_SUPER_ADMIN_EMAIL);
    if (existing) {
      return;
    }

    this.usersStore.create({
      name: ENV.DEV_SUPER_ADMIN_NAME,
      email: ENV.DEV_SUPER_ADMIN_EMAIL,
      passwordHash: hashPassword(ENV.DEV_SUPER_ADMIN_PASSWORD),
      role: ROLES.SUPER_ADMIN,
    });
  }
}