export type MechanicHireStatus = 'pending' | 'assigned' | 'completed' | 'rejected';
export type ActionType = 'assign' | 'reject';

export interface MechanicHireRow {
  id: number;
  sno: number;
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  mechanicImage?: string;
  costPerHour?: number;
  duration?: string;
  location: string;
  scheduledDate?: string;
  completedDate?: string;
  status: MechanicHireStatus;
  notes?: string;
  createdAt?: string;
}
