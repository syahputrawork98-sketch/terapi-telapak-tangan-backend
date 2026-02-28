import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SlotEntity } from './slots.types';

@Injectable()
export class SlotsStore {
  private readonly slots: SlotEntity[] = [];

  list(): SlotEntity[] {
    return [...this.slots];
  }

  create(input: Omit<SlotEntity, 'id' | 'created_at'>): SlotEntity {
    const slot: SlotEntity = {
      id: randomUUID(),
      created_at: new Date().toISOString(),
      ...input,
    };

    this.slots.push(slot);
    return slot;
  }

  findById(id: string): SlotEntity | null {
    return this.slots.find((slot) => slot.id === id) ?? null;
  }

  update(id: string, input: Partial<Omit<SlotEntity, 'id' | 'created_at'>>): SlotEntity | null {
    const slot = this.findById(id);
    if (!slot) {
      return null;
    }

    Object.assign(slot, input);
    return slot;
  }

  delete(id: string): boolean {
    const idx = this.slots.findIndex((slot) => slot.id === id);
    if (idx < 0) {
      return false;
    }

    this.slots.splice(idx, 1);
    return true;
  }
}