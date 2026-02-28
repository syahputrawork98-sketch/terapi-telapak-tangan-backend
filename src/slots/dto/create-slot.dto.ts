import { SlotStatus } from '../slots.types';

export interface CreateSlotDto {
  date: string;
  start_time: string;
  end_time: string;
  capacity?: number;
  status?: SlotStatus;
}