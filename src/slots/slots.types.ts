export const SLOT_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
} as const;

export type SlotStatus = (typeof SLOT_STATUS)[keyof typeof SLOT_STATUS];

export interface SlotEntity {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  status: SlotStatus;
  created_by: string;
  created_at: string;
}