export type VehicleRentalStatus = 'pending' | 'active' | 'completed' | 'rejected';
export type ActionType = 'assign' | 'reject';

export interface VehicleRentalRow {
  id: number;
  sno: number;
  name: string;
  email: string;
  phone?: string;
  vehicleType: string;
  vehicleImage?: string;
  costPerDay?: number;
  duration?: string;
  location: string;
  startDate?: string;
  endDate?: string;
  status: VehicleRentalStatus;
  notes?: string;
  createdAt?: string;
}
