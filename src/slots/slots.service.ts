import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { failure } from '../common/utils/envelope';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { SLOT_STATUS, SlotEntity, SlotStatus } from './slots.types';
import { SlotsStore } from './slots.store';

@Injectable()
export class SlotsService {
  constructor(private readonly slotsStore: SlotsStore) {}

  list(query: { date?: string; status?: string }): SlotEntity[] {
    if (query.date && !this.isValidDate(query.date)) {
      throw new HttpException(
        failure('Invalid query payload', 'VALIDATION_ERROR', { date: 'date must be YYYY-MM-DD' }),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (query.status && !this.isValidStatus(query.status)) {
      throw new HttpException(
        failure('Invalid query payload', 'VALIDATION_ERROR', { status: 'status must be OPEN or CLOSED' }),
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.slotsStore.list().filter((slot) => {
      const matchDate = query.date ? slot.date === query.date : true;
      const matchStatus = query.status ? slot.status === query.status : true;
      return matchDate && matchStatus;
    });
  }

  create(payload: CreateSlotDto, userId: string): SlotEntity {
    const details = this.validatePayload(payload, false);
    if (Object.keys(details).length > 0) {
      throw new HttpException(failure('Invalid slot payload', 'VALIDATION_ERROR', details), HttpStatus.BAD_REQUEST);
    }

    const slotData = {
      date: payload.date,
      start_time: payload.start_time,
      end_time: payload.end_time,
      capacity: payload.capacity ?? 1,
      status: payload.status ?? SLOT_STATUS.OPEN,
      created_by: userId,
    };

    this.ensureNoOverlap(slotData.date, slotData.start_time, slotData.end_time);

    return this.slotsStore.create(slotData);
  }

  update(id: string, payload: UpdateSlotDto): SlotEntity {
    const existing = this.slotsStore.findById(id);
    if (!existing) {
      throw new HttpException(failure('Slot not found', 'RESOURCE_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }

    const merged = {
      date: payload.date ?? existing.date,
      start_time: payload.start_time ?? existing.start_time,
      end_time: payload.end_time ?? existing.end_time,
      capacity: payload.capacity ?? existing.capacity,
      status: payload.status ?? existing.status,
    };

    const details = this.validatePayload(merged, true);
    if (Object.keys(details).length > 0) {
      throw new HttpException(failure('Invalid slot payload', 'VALIDATION_ERROR', details), HttpStatus.BAD_REQUEST);
    }

    this.ensureNoOverlap(merged.date, merged.start_time, merged.end_time, id);

    return this.slotsStore.update(id, merged)!;
  }

  remove(id: string): { id: string } {
    const deleted = this.slotsStore.delete(id);
    if (!deleted) {
      throw new HttpException(failure('Slot not found', 'RESOURCE_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }

    return { id };
  }

  private validatePayload(payload: Partial<CreateSlotDto>, allowPartial: boolean): Record<string, string> {
    const details: Record<string, string> = {};

    if (!allowPartial || payload.date !== undefined) {
      if (!payload.date || !this.isValidDate(payload.date)) {
        details.date = 'date must be YYYY-MM-DD';
      }
    }

    if (!allowPartial || payload.start_time !== undefined) {
      if (!payload.start_time || !this.isValidTime(payload.start_time)) {
        details.start_time = 'start_time must be HH:mm';
      }
    }

    if (!allowPartial || payload.end_time !== undefined) {
      if (!payload.end_time || !this.isValidTime(payload.end_time)) {
        details.end_time = 'end_time must be HH:mm';
      }
    }

    if (
      (payload.start_time && this.isValidTime(payload.start_time)) &&
      (payload.end_time && this.isValidTime(payload.end_time))
    ) {
      if (this.toMinutes(payload.start_time) >= this.toMinutes(payload.end_time)) {
        details.time = 'start_time must be earlier than end_time';
      }
    }

    if (!allowPartial || payload.capacity !== undefined) {
      if (payload.capacity === undefined || payload.capacity < 1 || !Number.isInteger(payload.capacity)) {
        details.capacity = 'capacity must be an integer >= 1';
      }
    }

    if (!allowPartial || payload.status !== undefined) {
      if (!payload.status || !this.isValidStatus(payload.status)) {
        details.status = 'status must be OPEN or CLOSED';
      }
    }

    return details;
  }

  private ensureNoOverlap(date: string, startTime: string, endTime: string, ignoreId?: string): void {
    const start = this.toMinutes(startTime);
    const end = this.toMinutes(endTime);

    const overlap = this.slotsStore.list().some((slot) => {
      if (ignoreId && slot.id === ignoreId) {
        return false;
      }

      if (slot.date !== date) {
        return false;
      }

      const existingStart = this.toMinutes(slot.start_time);
      const existingEnd = this.toMinutes(slot.end_time);

      return start < existingEnd && existingStart < end;
    });

    if (overlap) {
      throw new HttpException(failure('Slot overlap detected', 'SLOT_OVERLAP'), HttpStatus.CONFLICT);
    }
  }

  private isValidDate(value: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
  }

  private isValidTime(value: string): boolean {
    if (!/^\d{2}:\d{2}$/.test(value)) {
      return false;
    }

    const [h, m] = value.split(':').map(Number);
    return h >= 0 && h <= 23 && m >= 0 && m <= 59;
  }

  private isValidStatus(value: string): value is SlotStatus {
    return value === SLOT_STATUS.OPEN || value === SLOT_STATUS.CLOSED;
  }

  private toMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }
}