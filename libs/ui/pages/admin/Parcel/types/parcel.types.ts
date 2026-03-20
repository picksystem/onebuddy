export type ParcelStatus = 'pending' | 'in_transit' | 'delivered' | 'rejected';
export type ActionType = 'dispatch' | 'reject';

export interface ParcelRow {
  id: number;
  sno: number;
  name: string;
  email: string;
  phone?: string;
  pickupLocation: string;
  dropLocation: string;
  parcelType?: string;
  weight?: string;
  status: ParcelStatus;
  notes?: string;
  createdAt?: string;
}
