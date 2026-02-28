import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { failure } from '../common/utils/envelope';
import { ROLES } from '../users/roles';
import { SlotsStore } from '../slots/slots.store';
import { SLOT_STATUS } from '../slots/slots.types';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingsStore } from './bookings.store';
import { BOOKING_STATUS, BookingEntity } from './bookings.types';

@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingsStore: BookingsStore,
    private readonly slotsStore: SlotsStore,
  ) {}

  create(user: { id: string; role: string }, payload: CreateBookingDto): BookingEntity {
    if (user.role !== ROLES.USER) {
      throw new HttpException(failure('Forbidden', 'AUTH_FORBIDDEN'), HttpStatus.FORBIDDEN);
    }

    const details: Record<string, string> = {};
    if (!payload.slot_id || payload.slot_id.trim().length === 0) {
      details.slot_id = 'slot_id is required';
    }

    if (!payload.complaint || payload.complaint.trim().length < 5) {
      details.complaint = 'complaint must be at least 5 characters';
    }

    if (Object.keys(details).length > 0) {
      throw new HttpException(failure('Invalid booking payload', 'VALIDATION_ERROR', details), HttpStatus.BAD_REQUEST);
    }

    const slot = this.slotsStore.findById(payload.slot_id);
    if (!slot) {
      throw new HttpException(failure('Slot not found', 'RESOURCE_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }

    if (slot.status !== SLOT_STATUS.OPEN) {
      throw new HttpException(failure('Slot not available', 'SLOT_NOT_AVAILABLE'), HttpStatus.CONFLICT);
    }

    if (this.bookingsStore.hasActiveBooking(slot.id)) {
      throw new HttpException(failure('Slot not available', 'SLOT_NOT_AVAILABLE'), HttpStatus.CONFLICT);
    }

    const booking = this.bookingsStore.create({
      user_id: user.id,
      slot_id: slot.id,
      complaint: payload.complaint.trim(),
      status: BOOKING_STATUS.PENDING,
      decided_by: null,
      decided_at: null,
    });

    this.bookingsStore.createStatusLog({
      booking_id: booking.id,
      from_status: null,
      to_status: BOOKING_STATUS.PENDING,
      changed_by: user.id,
      note: 'Booking created by user',
    });

    this.slotsStore.update(slot.id, { status: SLOT_STATUS.CLOSED });

    return booking;
  }

  listMine(userId: string): BookingEntity[] {
    return this.bookingsStore.listByUserId(userId);
  }

  cancel(user: { id: string; role: string }, bookingId: string): BookingEntity {
    if (user.role !== ROLES.USER) {
      throw new HttpException(failure('Forbidden', 'AUTH_FORBIDDEN'), HttpStatus.FORBIDDEN);
    }

    const booking = this.bookingsStore.findById(bookingId);
    if (!booking) {
      throw new HttpException(failure('Booking not found', 'RESOURCE_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }

    if (booking.user_id !== user.id) {
      throw new HttpException(failure('Forbidden', 'AUTH_FORBIDDEN'), HttpStatus.FORBIDDEN);
    }

    if (booking.status !== BOOKING_STATUS.PENDING) {
      throw new HttpException(failure('Invalid booking state', 'BOOKING_INVALID_STATE'), HttpStatus.CONFLICT);
    }

    const updated = this.bookingsStore.update(booking.id, {
      status: BOOKING_STATUS.CANCELED,
      decided_by: user.id,
      decided_at: new Date().toISOString(),
    })!;

    this.bookingsStore.createStatusLog({
      booking_id: booking.id,
      from_status: BOOKING_STATUS.PENDING,
      to_status: BOOKING_STATUS.CANCELED,
      changed_by: user.id,
      note: 'Canceled by user',
    });

    this.slotsStore.update(booking.slot_id, { status: SLOT_STATUS.OPEN });

    return updated;
  }

  listAdmin(status?: string): BookingEntity[] {
    if (!status) {
      return this.bookingsStore.list();
    }

    const normalized = status.toUpperCase();
    const valid = Object.values(BOOKING_STATUS);
    if (!valid.includes(normalized as (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS])) {
      throw new HttpException(
        failure('Invalid query payload', 'VALIDATION_ERROR', { status: 'invalid booking status' }),
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.bookingsStore.list().filter((row) => row.status === normalized);
  }

  confirm(admin: { id: string }, bookingId: string): BookingEntity {
    const booking = this.mustFindBooking(bookingId);

    if (booking.status !== BOOKING_STATUS.PENDING) {
      throw new HttpException(failure('Invalid booking state', 'BOOKING_INVALID_STATE'), HttpStatus.CONFLICT);
    }

    if (this.bookingsStore.hasActiveBooking(booking.slot_id, booking.id)) {
      throw new HttpException(failure('Slot not available', 'SLOT_NOT_AVAILABLE'), HttpStatus.CONFLICT);
    }

    const updated = this.bookingsStore.update(booking.id, {
      status: BOOKING_STATUS.CONFIRMED,
      decided_by: admin.id,
      decided_at: new Date().toISOString(),
    })!;

    this.bookingsStore.createStatusLog({
      booking_id: booking.id,
      from_status: BOOKING_STATUS.PENDING,
      to_status: BOOKING_STATUS.CONFIRMED,
      changed_by: admin.id,
      note: 'Confirmed by admin',
    });

    this.slotsStore.update(booking.slot_id, { status: SLOT_STATUS.CLOSED });

    return updated;
  }

  reject(admin: { id: string }, bookingId: string): BookingEntity {
    const booking = this.mustFindBooking(bookingId);

    if (booking.status !== BOOKING_STATUS.PENDING) {
      throw new HttpException(failure('Invalid booking state', 'BOOKING_INVALID_STATE'), HttpStatus.CONFLICT);
    }

    const updated = this.bookingsStore.update(booking.id, {
      status: BOOKING_STATUS.REJECTED,
      decided_by: admin.id,
      decided_at: new Date().toISOString(),
    })!;

    this.bookingsStore.createStatusLog({
      booking_id: booking.id,
      from_status: BOOKING_STATUS.PENDING,
      to_status: BOOKING_STATUS.REJECTED,
      changed_by: admin.id,
      note: 'Rejected by admin',
    });

    this.slotsStore.update(booking.slot_id, { status: SLOT_STATUS.OPEN });

    return updated;
  }

  done(admin: { id: string }, bookingId: string): BookingEntity {
    const booking = this.mustFindBooking(bookingId);

    if (booking.status !== BOOKING_STATUS.CONFIRMED) {
      throw new HttpException(failure('Invalid booking state', 'BOOKING_INVALID_STATE'), HttpStatus.CONFLICT);
    }

    const updated = this.bookingsStore.update(booking.id, {
      status: BOOKING_STATUS.DONE,
      decided_by: admin.id,
      decided_at: new Date().toISOString(),
    })!;

    this.bookingsStore.createStatusLog({
      booking_id: booking.id,
      from_status: BOOKING_STATUS.CONFIRMED,
      to_status: BOOKING_STATUS.DONE,
      changed_by: admin.id,
      note: 'Marked done by admin',
    });

    return updated;
  }

  private mustFindBooking(bookingId: string): BookingEntity {
    const booking = this.bookingsStore.findById(bookingId);
    if (!booking) {
      throw new HttpException(failure('Booking not found', 'RESOURCE_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    return booking;
  }
}