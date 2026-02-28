import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';
import { SlotsStore } from './slots.store';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  controllers: [SlotsController],
  providers: [SlotsService, SlotsStore, RolesGuard, Reflector],
})
export class SlotsModule {}