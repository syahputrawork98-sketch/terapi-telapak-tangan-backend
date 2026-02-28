export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  REJECTED: 'REJECTED',
  CANCELED: 'CANCELED',
  DONE: 'DONE',
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export interface BookingEntity {
  id: string;
  user_id: string;
  slot_id: string;
  complaint: string;
  status: BookingStatus;
  decided_by: string | null;
  decided_at: string | null;
  created_at: string;
}

export interface BookingStatusLogEntity {
  id: string;
  booking_id: string;
  from_status: BookingStatus | null;
  to_status: BookingStatus;
  changed_by: string;
  changed_at: string;
  note: string | null;
}