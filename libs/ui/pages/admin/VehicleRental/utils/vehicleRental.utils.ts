import { VehicleRentalRow } from '../types/vehicleRental.types';

export const getTabLists = (rows: VehicleRentalRow[]) => ({
  all: rows,
  pending: rows.filter((r) => r.status === 'pending'),
  active: rows.filter((r) => r.status === 'active'),
  completed: rows.filter((r) => r.status === 'completed'),
});

export const getFilteredData = (rows: VehicleRentalRow[], search: string): VehicleRentalRow[] => {
  if (!search.trim()) return rows;
  const q = search.toLowerCase();
  return rows.filter(
    (r) =>
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.vehicleType?.toLowerCase().includes(q) ||
      r.location?.toLowerCase().includes(q),
  );
};
