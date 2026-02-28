import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingsStore } from './bookings.store';
import { SlotsModule } from '../slots/slots.module';

@Module({
  imports: [SlotsModule],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsStore],
})
export class BookingsModule {}