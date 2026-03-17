import { DriverHireRow } from '../types/driverHire.types';

export const getTabLists = (rows: DriverHireRow[]) => ({
  all: rows,
  pending: rows.filter((r) => r.status === 'pending'),
  matched: rows.filter((r) => r.status === 'matched'),
  rejected: rows.filter((r) => r.status === 'rejected'),
});

export const getFilteredData = (rows: DriverHireRow[], search: string): DriverHireRow[] => {
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
