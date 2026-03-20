import { ParcelRow } from '../types/parcel.types';

export const getTabLists = (rows: ParcelRow[]) => ({
  all: rows,
  pending: rows.filter((r) => r.status === 'pending'),
  inTransit: rows.filter((r) => r.status === 'in_transit'),
  delivered: rows.filter((r) => r.status === 'delivered'),
  rejected: rows.filter((r) => r.status === 'rejected'),
});

export const getFilteredData = (rows: ParcelRow[], search: string): ParcelRow[] => {
  if (!search.trim()) return rows;
  const q = search.toLowerCase();
  return rows.filter(
    (r) =>
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.pickupLocation?.toLowerCase().includes(q) ||
      r.dropLocation?.toLowerCase().includes(q) ||
      r.parcelType?.toLowerCase().includes(q),
  );
};
