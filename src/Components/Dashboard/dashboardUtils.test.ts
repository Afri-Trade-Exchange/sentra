import { describe, expect, it } from 'vitest';
import {
  calculateProcessingEfficiency,
  calculateRejectionRate,
  calculateRiskLevel,
  calculateValueGrowth,
  generateInvoice,
  getStatusStyles,
} from './dashboardUtils';
import { ConsignmentStatus } from '../CustomsDashboard/types';
import type { Activity } from '../../types/dashboard';

describe('generateInvoice', () => {
  const activity: Activity = {
    id: 'A1',
    category: 'Import',
    date: '2026-01-01',
    status: 'Pending',
    amount: 500,
  };

  it('builds an invoice from the activity, defaulting the customer name', () => {
    const invoice = generateInvoice(activity);

    expect(invoice.id).toBe('INV-A1');
    expect(invoice.customerName).toBe('Customer');
    expect(invoice.totalAmount).toBe(500);
    expect(invoice.dueDate).toBe('2026-01-31');
    expect(invoice.items).toEqual([
      { description: 'Import declaration', quantity: 1, unitPrice: 500, total: 500 },
    ]);
  });

  it('uses the user display name when provided', () => {
    const invoice = generateInvoice(activity, { displayName: 'Jane Doe' } as never);
    expect(invoice.customerName).toBe('Jane Doe');
  });
});

describe('getStatusStyles', () => {
  it('returns distinct classes per status', () => {
    expect(getStatusStyles(ConsignmentStatus.Approved)).toContain('green');
    expect(getStatusStyles(ConsignmentStatus.Rejected)).toContain('red');
    expect(getStatusStyles(ConsignmentStatus.Pending)).toContain('yellow');
    expect(getStatusStyles('Unknown')).toContain('gray');
  });
});

describe('calculateProcessingEfficiency', () => {
  it('returns 0 for an empty list', () => {
    expect(calculateProcessingEfficiency([])).toBe(0);
  });

  it('computes the approved percentage', () => {
    const consignments = [
      { status: ConsignmentStatus.Approved },
      { status: ConsignmentStatus.Approved },
      { status: ConsignmentStatus.Rejected },
      { status: ConsignmentStatus.Pending },
    ];
    expect(calculateProcessingEfficiency(consignments)).toBe(50);
  });
});

describe('calculateValueGrowth', () => {
  it('returns 0 when there is no activity in either month', () => {
    expect(calculateValueGrowth([])).toBe(0);
  });

  it('returns 100 when there was no spend last month but there is this month', () => {
    const now = new Date();
    const consignments = [{ estimatedValue: 200, createdAt: now }];
    expect(calculateValueGrowth(consignments)).toBe(100);
  });

  it('computes percentage change between this month and last month', () => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);
    const consignments = [
      { estimatedValue: 150, createdAt: now },
      { estimatedValue: 100, createdAt: lastMonth },
    ];
    expect(calculateValueGrowth(consignments)).toBe(50);
  });
});

describe('calculateRejectionRate', () => {
  it('returns 0 when nothing has been decided yet', () => {
    expect(calculateRejectionRate([{ status: ConsignmentStatus.Pending }])).toBe(0);
  });

  it('only counts decided consignments in the denominator', () => {
    const consignments = [
      { status: ConsignmentStatus.Rejected },
      { status: ConsignmentStatus.Approved },
      { status: ConsignmentStatus.Pending },
    ];
    expect(calculateRejectionRate(consignments)).toBe(50);
  });
});

describe('calculateRiskLevel', () => {
  it('classifies rejection rate into risk bands', () => {
    expect(calculateRiskLevel(0).level).toBe('Low');
    expect(calculateRiskLevel(14.9).level).toBe('Low');
    expect(calculateRiskLevel(15).level).toBe('Medium');
    expect(calculateRiskLevel(39.9).level).toBe('Medium');
    expect(calculateRiskLevel(40).level).toBe('High');
  });
});
