import { SlotStatus } from '../slots.types';

export interface UpdateSlotDto {
  date?: string;
  start_time?: string;
  end_time?: string;
  capacity?: number;
  status?: SlotStatus;
}