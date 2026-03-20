export type LogisticsStatus = 'pending' | 'in_transit' | 'delivered' | 'rejected';
export type ActionType = 'dispatch' | 'reject';

export interface LogisticsRow {
  id: number;
  sno: number;
  name: string;
  email: string;
  phone?: string;
  origin: string;
  destination: string;
  cargoType: string;
  weight?: string;
  status: LogisticsStatus;
  notes?: string;
  scheduledDate?: string;
  deliveredDate?: string;
  createdAt?: string;
}
