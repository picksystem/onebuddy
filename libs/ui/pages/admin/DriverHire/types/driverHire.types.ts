export type DriverHireStatus = 'pending' | 'matched' | 'rejected' | 'completed';
export type ActionType = 'match' | 'reject';

export interface DriverHireRow {
  id: number;
  sno: number;
  name: string;
  email: string;
  phone?: string;
  vehicleType: string;
  vehicleNumber?: string;
  location: string;
  preferredDate?: string;
  duration?: string;
  status: DriverHireStatus;
  notes?: string;
  createdAt?: string;
}
