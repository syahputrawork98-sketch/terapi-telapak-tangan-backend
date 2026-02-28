import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersStore } from '../users/users.store';
import { DevSeedService } from './dev-seed.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersStore, DevSeedService],
  exports: [UsersStore],
})
export class AuthModule {}
