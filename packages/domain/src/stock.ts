export interface StockEntry {
  id: string;
  type: 'load' | 'unload';
  quantity: number;
  unit: string;
  operationDate: string;
  status: 'draft' | 'validated' | 'locked' | 'corrected' | 'cancelled';
}

export interface Allocation {
  loadEntryId: string;
  quantity: number;
}

export function calculateStock(entries: readonly StockEntry[], unit: string): number {
  return entries
    .filter(
      (entry) => entry.unit === unit && !['draft', 'cancelled', 'corrected'].includes(entry.status),
    )
    .reduce(
      (total, entry) => total + (entry.type === 'load' ? entry.quantity : -entry.quantity),
      0,
    );
}

export function allocateFifo(
  loads: readonly StockEntry[],
  requested: number,
  unit: string,
): Allocation[] {
  if (requested <= 0) throw new Error('La quantità richiesta deve essere positiva');
  const available = loads
    .filter(
      (entry) =>
        entry.type === 'load' &&
        entry.unit === unit &&
        ['validated', 'locked'].includes(entry.status),
    )
    .sort((a, b) => a.operationDate.localeCompare(b.operationDate));
  let remaining = requested;
  const result: Allocation[] = [];
  for (const load of available) {
    if (remaining <= 0) break;
    const quantity = Math.min(load.quantity, remaining);
    result.push({ loadEntryId: load.id, quantity });
    remaining -= quantity;
  }
  if (remaining > 0) throw new Error('Giacenza insufficiente');
  return result;
}
