import { LogisticsRow } from '../types/logistics.types';

export const getTabLists = (rows: LogisticsRow[]) => ({
  all: rows,
  pending: rows.filter((r) => r.status === 'pending'),
  inTransit: rows.filter((r) => r.status === 'in_transit'),
  delivered: rows.filter((r) => r.status === 'delivered'),
});

export const getFilteredData = (rows: LogisticsRow[], search: string): LogisticsRow[] => {
  if (!search.trim()) return rows;
  const q = search.toLowerCase();
  return rows.filter(
    (r) =>
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.origin?.toLowerCase().includes(q) ||
      r.destination?.toLowerCase().includes(q) ||
      r.cargoType?.toLowerCase().includes(q),
  );
};
