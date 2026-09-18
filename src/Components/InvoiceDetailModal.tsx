import { FaDownload, FaPrint } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Invoice fields (trader name, item descriptions, notes, ...) ultimately
// trace back to Firestore consignment data, which isn't guaranteed to be
// free of markup. This HTML is built as a raw template string and inserted
// into the live DOM below (for html2canvas to rasterize), so every
// interpolated string must be escaped or a crafted consignment field
// becomes stored XSS against whoever opens this invoice.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface Invoice {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  businessName?: string;
  customerName?: string;
  notes?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  totalAmount: number;
  taxRate: number;
}

interface InvoiceDetailModalProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoiceDetailModal({ 
  invoice, 
  isOpen, 
  onClose 
}: InvoiceDetailModalProps) {
  const downloadInvoice = async () => {
    try {
      // Create a full-page container
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.style.width = '210mm';  // A4 width
      container.style.minHeight = '297mm';  // A4 height
      container.style.fontFamily = "'Inter', Arial, sans-serif";
      container.style.backgroundColor = 'white';
      container.style.padding = '20mm';
      container.style.boxSizing = 'border-box';

      // Create a wrapper for the invoice content
      const invoiceWrapper = document.createElement('div');
      invoiceWrapper.style.maxWidth = '100%';
      invoiceWrapper.style.margin = '0 auto';

      // Add Google Fonts link
      const fontLink = document.createElement('link');
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap';
      fontLink.rel = 'stylesheet';
      container.appendChild(fontLink);

      // Escape every user-influenced string once, up front, so the
      // template below can interpolate freely without re-deriving which
      // fields need it.
      const safe = {
        invoiceNumber: escapeHtml(invoice.invoiceNumber),
        businessName: escapeHtml(invoice.businessName || 'Afritrade'),
        customerName: escapeHtml(invoice.customerName || 'Customer'),
        notes: escapeHtml(invoice.notes || 'No additional notes'),
        items: invoice.items.map((item) => ({
          ...item,
          description: escapeHtml(item.description),
        })),
      };

      // Detailed invoice HTML
      invoiceWrapper.innerHTML = `
        <div style="
          background: #f5f7fa;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <img 
              id="company-logo"
              src="/src/assets/images/africa.png" 
              style="height: 80px; max-width: 200px; object-fit: contain;" 
              alt="Company Logo"
            />
            <div style="text-align: right; color: #2c3e50;">
              <h1 style="
                margin: 0; 
                font-size: 32px; 
                font-weight: 700; 
                text-transform: uppercase;
                letter-spacing: 2px;
              ">
                Invoice
              </h1>
              <p style="margin: 10px 0 5px; font-weight: 600; color: #7f8c8d;">
                Invoice #: ${safe.invoiceNumber}
              </p>
              <p style="margin: 0; font-weight: 500; color: #7f8c8d;">
                Date: ${new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div style="
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 30px;
            background-color: #f1f4f8;
            padding: 20px;
            border-radius: 8px;
          ">
            <div>
              <h3 style="margin: 0 0 10px 0; font-weight: 700; color: #2c3e50; font-size: 16px;">
                From:
              </h3>
              <p style="margin: 0; font-weight: 500; color: #34495e;">
                ${safe.businessName}
              </p>
            </div>
            <div style="text-align: right;">
              <h3 style="margin: 0 0 10px 0; font-weight: 700; color: #2c3e50; font-size: 16px;">
                Bill To:
              </h3>
              <p style="margin: 0; font-weight: 500; color: #34495e;">
                ${safe.customerName}
              </p>
            </div>
          </div>

          <table style="
            width: 100%; 
            border-collapse: separate; 
            border-spacing: 0;
            margin-bottom: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          ">
            <thead>
              <tr style="background-color: #3498db; color: white;">
                <th style="
                  padding: 12px 15px; 
                  text-align: left; 
                  font-weight: 600;
                  border-top-left-radius: 8px;
                ">
                  Description
                </th>
                <th style="
                  padding: 12px 15px; 
                  text-align: right; 
                  font-weight: 600;
                ">
                  Quantity
                </th>
                <th style="
                  padding: 12px 15px; 
                  text-align: right; 
                  font-weight: 600;
                ">
                  Unit Price
                </th>
                <th style="
                  padding: 12px 15px; 
                  text-align: right; 
                  font-weight: 600;
                  border-top-right-radius: 8px;
                ">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              ${safe.items.map((item, index) => `
                <tr style="
                  background-color: ${index % 2 === 0 ? '#f9f9f9' : 'white'};
                  transition: background-color 0.3s ease;
                ">
                  <td style="
                    padding: 12px 15px; 
                    border-bottom: 1px solid #e0e0e0;
                    color: #2c3e50;
                  ">
                    ${item.description}
                  </td>
                  <td style="
                    padding: 12px 15px; 
                    text-align: right; 
                    border-bottom: 1px solid #e0e0e0;
                    color: #34495e;
                  ">
                    ${item.quantity}
                  </td>
                  <td style="
                    padding: 12px 15px; 
                    text-align: right; 
                    border-bottom: 1px solid #e0e0e0;
                    color: #34495e;
                  ">
                    $${item.unitPrice.toFixed(2)}
                  </td>
                  <td style="
                    padding: 12px 15px; 
                    text-align: right; 
                    border-bottom: 1px solid #e0e0e0;
                    color: #2c3e50;
                    font-weight: 600;
                  ">
                    $${item.total.toFixed(2)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="
            display: flex; 
            justify-content: space-between;
            background-color: #f1f4f8;
            padding: 20px;
            border-radius: 8px;
          ">
            <div style="width: 50%;">
              <h3 style="
                margin: 0 0 10px 0; 
                font-weight: 700; 
                color: #2c3e50;
                font-size: 16px;
              ">
                Notes:
              </h3>
              <p style="
                margin: 0; 
                font-weight: 500; 
                color: #34495e;
              ">
                ${safe.notes}
              </p>
            </div>
            <div style="
              text-align: right; 
              width: 50%;
            ">
              <p style="
                margin: 5px 0; 
                color: #7f8c8d;
              ">
                Subtotal: $${invoice.totalAmount.toFixed(2)}
              </p>
              <p style="
                margin: 5px 0; 
                color: #7f8c8d;
              ">
                Tax (${(invoice.taxRate || 0) * 100}%): $${(invoice.totalAmount * (invoice.taxRate || 0)).toFixed(2)}
              </p>
              <p style="
                margin: 5px 0; 
                font-weight: 700; 
                font-size: 18px;
                color: #2c3e50;
              ">
                Total: $${(invoice.totalAmount * (1 + (invoice.taxRate || 0))).toFixed(2)}
              </p>
            </div>
          </div>

          <div style="
            margin-top: 30px; 
            text-align: center; 
            color: #7f8c8d;
            font-size: 12px;
            border-top: 1px solid #e0e0e0;
            padding-top: 15px;
          ">
            <p style="margin: 5px 0;">
              Generated on: ${new Date().toLocaleString()}
            </p>
            <p style="margin: 5px 0;">
              © ${new Date().getFullYear()} ${safe.businessName}. All rights reserved.
            </p>
          </div>
        </div>
      `;

      container.appendChild(invoiceWrapper);
      document.body.appendChild(container);

      // Alternative PDF generation methods
      const generatePDF = async () => {
        try {
          // Method 1: HTML2Canvas
          const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            logging: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            imageTimeout: 15000,
          });

          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });

          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
        } catch (canvasError) {
          console.error('HTML2Canvas Error:', canvasError);
          
          // Fallback Method: Direct Print
          window.print();
        } finally {
          // Clean up
          document.body.removeChild(container);
        }
      };

      // Ensure logo is loaded before generating PDF
      const logoImg = container.querySelector('#company-logo') as HTMLImageElement;
      if (logoImg) {
        logoImg.onload = generatePDF;
        logoImg.onerror = () => {
          console.warn('Logo failed to load, proceeding with PDF generation');
          generatePDF();
        };
      } else {
        generatePDF();
      }

    } catch (error) {
      console.error('Comprehensive Invoice Download Error:', error);
      alert('Multiple issues encountered. Please check console and try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-auto max-w-3xl mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white dark:bg-gray-800 border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200 dark:border-gray-700">
            <h3 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Invoice Details</h3>
            <button
              className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black dark:text-gray-100 bg-transparent border-0 outline-none opacity-5 focus:outline-none"
              onClick={onClose}
            >
              ×
            </button>
          </div>

          {/* Invoice Content */}
          <div className="relative flex-auto p-6 text-gray-900 dark:text-gray-100">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="font-semibold">Invoice Number</p>
                <p>{invoice.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Invoice Date</p>
                <p>{invoice.invoiceDate}</p>
                <p className="font-semibold">Due Date</p>
                <p>{invoice.dueDate}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Invoice Items</h3>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-right">Quantity</th>
                    <th className="p-2 text-right">Unit Price</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                      <td className="p-2">{item.description}</td>
                      <td className="p-2 text-right">{item.quantity}</td>
                      <td className="p-2 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="p-2 text-right">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right">
              <p>Subtotal: ${invoice.totalAmount.toFixed(2)}</p>
              <p>Tax ({invoice.taxRate * 100}%): ${(invoice.totalAmount * invoice.taxRate).toFixed(2)}</p>
              <p className="font-semibold text-xl">Total: ${(invoice.totalAmount * (1 + invoice.taxRate)).toFixed(2)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200 dark:border-gray-700">
            <button
              className="px-6 py-2 mb-1 mr-2 text-sm font-semibold text-teal-600 dark:text-teal-400 uppercase transition-colors duration-150 ease-linear outline-none background-transparent focus:outline-none flex items-center"
              type="button"
              onClick={downloadInvoice}
            >
              <FaDownload className="mr-2" /> Download PDF
            </button>
            <button
              className="px-6 py-2 mb-1 mr-2 text-sm font-semibold text-green-600 dark:text-green-400 uppercase transition-colors duration-150 ease-linear outline-none background-transparent focus:outline-none flex items-center"
              type="button"
              onClick={() => window.print()}
            >
              <FaPrint className="mr-2" /> Print
            </button>
            <button
              className="px-6 py-2 mb-1 text-sm font-semibold text-red-500 dark:text-red-400 uppercase transition-colors duration-150 ease-linear outline-none background-transparent focus:outline-none"
              type="button"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 