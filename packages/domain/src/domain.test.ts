import { describe, expect, it } from 'vitest';
import { allocateFifo, assertTransition, calculateStock, can, type StockEntry } from './index.js';

const entries: StockEntry[] = [
  {
    id: 'a',
    type: 'load',
    quantity: 120,
    unit: 'kg',
    operationDate: '2026-01-10',
    status: 'locked',
  },
  {
    id: 'b',
    type: 'load',
    quantity: 80,
    unit: 'kg',
    operationDate: '2026-02-01',
    status: 'validated',
  },
  {
    id: 'c',
    type: 'unload',
    quantity: 50,
    unit: 'kg',
    operationDate: '2026-02-10',
    status: 'locked',
  },
];

describe('stock', () => {
  it('calcola la giacenza valida per unità', () => expect(calculateStock(entries, 'kg')).toBe(150));
  it('alloca FIFO', () =>
    expect(allocateFifo(entries, 150, 'kg')).toEqual([
      { loadEntryId: 'a', quantity: 120 },
      { loadEntryId: 'b', quantity: 30 },
    ]));
  it('rifiuta giacenza insufficiente', () =>
    expect(() => allocateFifo(entries, 250, 'kg')).toThrow('Giacenza insufficiente'));
});

describe('FIR state machine', () => {
  it('consente una transizione valida', () =>
    expect(
      assertTransition('draft', 'ready_for_numbering', 'operator', {
        wasteProfileId: '1',
        quantity: 2,
        carrierPartyId: '3',
        destinationPartyId: '4',
      }).action,
    ).toBe('validate'));
  it('nega transizioni sparse', () =>
    expect(() => assertTransition('draft', 'transmitted', 'owner', {})).toThrow('non ammessa'));
});

describe('permissions', () => {
  it('nega le mutation al viewer', () => expect(can('viewer', 'createMovements')).toBe(false));
  it('consente al responsabile ambientale', () =>
    expect(can('environmental_manager', 'submitFir')).toBe(true));
});
