import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Activity } from '../types/activity';
import { InvoiceItem } from '../types/invoiceItem';

export function generateInvoice(activity: Activity): Invoice {
  const taxRate = 0.16; // 16% tax rate(For Kenya)
  const items: InvoiceItem[] = [
    {
      description: `${activity.category} Service`,
      quantity: 1,
      unitPrice: activity.amount,
      total: activity.amount
    }
  ];

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * taxRate;
  const totalAmount = subtotal + tax;

  return {
    id: uuidv4(),
    invoiceNumber: `INV-${activity.id}`,
    customerName: 'Client Name', // TODO: Replace with actual customer name
    businessName: 'Afritrade Logistics',
    activity,
    invoiceDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    totalAmount,
    status: activity.status === 'Completed' ? 'Paid' : 
            activity.status === 'In Transit' ? 'Pending' : 'Overdue',
    items,
    taxRate,
    notes: 'Thank you for your business!'
  };
} 