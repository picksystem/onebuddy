import { MechanicHireRow } from '../types/mechanicHire.types';

export const getTabLists = (rows: MechanicHireRow[]) => ({
  all: rows,
  pending: rows.filter((r) => r.status === 'pending'),
  assigned: rows.filter((r) => r.status === 'assigned'),
  completed: rows.filter((r) => r.status === 'completed'),
});

export const getFilteredData = (rows: MechanicHireRow[], search: string): MechanicHireRow[] => {
  if (!search.trim()) return rows;
  const q = search.toLowerCase();
  return rows.filter(
    (r) =>
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.serviceType?.toLowerCase().includes(q) ||
      r.location?.toLowerCase().includes(q),
  );
};
