import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BookingEntity, BookingStatus, BookingStatusLogEntity } from './bookings.types';

@Injectable()
export class BookingsStore {
  private readonly bookings: BookingEntity[] = [];
  private readonly statusLogs: BookingStatusLogEntity[] = [];

  create(input: Omit<BookingEntity, 'id' | 'created_at'>): BookingEntity {
    const booking: BookingEntity = {
      id: randomUUID(),
      created_at: new Date().toISOString(),
      ...input,
    };

    this.bookings.push(booking);
    return booking;
  }

  list(): BookingEntity[] {
    return [...this.bookings];
  }

  listByUserId(userId: string): BookingEntity[] {
    return this.bookings.filter((booking) => booking.user_id === userId);
  }

  findById(id: string): BookingEntity | null {
    return this.bookings.find((booking) => booking.id === id) ?? null;
  }

  update(
    id: string,
    input: Partial<Omit<BookingEntity, 'id' | 'created_at' | 'user_id' | 'slot_id'>>,
  ): BookingEntity | null {
    const booking = this.findById(id);
    if (!booking) {
      return null;
    }

    Object.assign(booking, input);
    return booking;
  }

  hasActiveBooking(slotId: string, ignoreBookingId?: string): boolean {
    return this.bookings.some((booking) => {
      if (ignoreBookingId && booking.id === ignoreBookingId) {
        return false;
      }

      if (booking.slot_id !== slotId) {
        return false;
      }

      return booking.status === 'PENDING' || booking.status === 'CONFIRMED';
    });
  }

  createStatusLog(input: {
    booking_id: string;
    from_status: BookingStatus | null;
    to_status: BookingStatus;
    changed_by: string;
    note?: string | null;
  }): BookingStatusLogEntity {
    const row: BookingStatusLogEntity = {
      id: randomUUID(),
      booking_id: input.booking_id,
      from_status: input.from_status,
      to_status: input.to_status,
      changed_by: input.changed_by,
      changed_at: new Date().toISOString(),
      note: input.note ?? null,
    };

    this.statusLogs.push(row);
    return row;
  }
}