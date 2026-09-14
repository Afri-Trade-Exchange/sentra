import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { format } from 'date-fns';
import { FaChartBar, FaFileExport, FaPlus, FaQrcode } from 'react-icons/fa';
import NewConsignmentModal from '../NewConsignmentModal';
import QrScannerModal from './QrScannerModal';
import { Consignment, ConsignmentStatus, ExportSettings, NewConsignmentFormData, QrScannerData } from './types';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: {
      head?: string[][];
      body: (string | number)[][];
      startY?: number;
      styles?: {
        fontSize?: number;
        cellPadding?: number;
      };
      headStyles?: {
        fillColor?: number[];
        textColor?: number;
      };
      alternateRowStyles?: {
        fillColor?: number[];
      };
    }) => jsPDF;
    internal: {
      events: PubSub;
      scaleFactor: number;
      pageSize: {
        width: number;
        getWidth: () => number;
        height: number;
        getHeight: () => number;
      };
      pages: number[];
      getEncryptor(objectId: number): (data: string) => string;
    };
  }
}

const QuickActions: React.FC<{
  consignments: Consignment[];
  selectedItems: string[];
  onSubmitNewConsignment: (formData: NewConsignmentFormData) => void;
}> = ({ consignments, selectedItems, onSubmitNewConsignment }) => {
  const [showNewConsignmentModal, setShowNewConsignmentModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState<QrScannerData | null>(null);
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'pdf',
    includeFields: ['Trader Name', 'Document Type', 'Status', 'Upload Date'],
    orientation: 'portrait'
  });

  const handleNewConsignment = () => {
    setShowNewConsignmentModal(true);
  };

  const formatConsignmentData = (data: Consignment[]) => {
    return data.map(c => ({
      'Trader Name': c.traderName,
      'Email': c.traderEmail,
      'Document Type': c.documentType,
      'Status': c.status,
      'Upload Date': format(c.createdAt.toDate(), 'dd/MM/yyyy'),
      'Declaration Number': c.declarationNumber || '',
      'Description': c.description || '',
      'Estimated Value': c.estimatedValue?.toLocaleString() || '',
      'Goods Status': c.goodsStatus || ''
    }));
  };

  const exportToPDF = (data: Consignment[]) => {
    const doc = new jsPDF({
      orientation: exportSettings.orientation,
      unit: 'mm',
      format: 'a4'
    });

    doc.setFontSize(16);
    doc.text('Consignments Report', 14, 15);

    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 25);
    doc.text(`Total Records: ${data.length}`, 14, 30);

    const formattedData = formatConsignmentData(data);
    const tableData = formattedData.map(item =>
      exportSettings.includeFields.map(field => item[field as keyof typeof item])
    );

    doc.autoTable({
      head: [exportSettings.includeFields],
      body: tableData,
      startY: 35,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 10
      );
    }

    const fileName = exportSettings.customFileName ||
      `consignments_report_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`;
    doc.save(fileName);
  };

  const exportToExcel = (data: Consignment[]) => {
    const formattedData = formatConsignmentData(data);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formattedData);

    const colWidths = exportSettings.includeFields.map(() => ({ wch: 15 }));
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Consignments');

    const summaryData = [
      ['Report Summary'],
      ['Generated Date', format(new Date(), 'dd/MM/yyyy HH:mm')],
      ['Total Records', data.length.toString()],
      ['Status Breakdown'],
      ...Object.values(ConsignmentStatus).map(status => [
        status,
        data.filter(c => c.status === status).length
      ])
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

    const fileName = exportSettings.customFileName ||
      `consignments_report_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const exportToCSV = (data: Consignment[]) => {
    const formattedData = formatConsignmentData(data);
    const csv = Papa.unparse(formattedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const fileName = exportSettings.customFileName ||
      `consignments_report_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`;
    saveAs(blob, fileName);
  };

  const handleExport = () => {
    let dataToExport = selectedItems.length > 0
      ? consignments.filter(c => selectedItems.includes(c.id))
      : consignments;

    if (exportSettings.dateRange) {
      dataToExport = dataToExport.filter(c => {
        const date = c.createdAt.toDate();
        return date >= exportSettings.dateRange!.start &&
               date <= exportSettings.dateRange!.end;
      });
    }

    switch (exportSettings.format) {
      case 'pdf':
        exportToPDF(dataToExport);
        break;
      case 'excel':
        exportToExcel(dataToExport);
        break;
      case 'csv':
        exportToCSV(dataToExport);
        break;
    }
  };

  const handleScanSuccess = (data: QrScannerData) => {
    setScannedData(data);
  };

  const handleExportSettingsChange = (newSettings: Partial<ExportSettings>) => {
    setExportSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleGenerateReport = () => {
    console.log('Generating report...');
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          type="button"
          onClick={handleNewConsignment}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
        >
          <FaPlus className="mr-2" /> New Consignment
        </button>
        <button
          type="button"
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
          onClick={handleExport}
        >
          <FaFileExport className="mr-2" /> Export Data
        </button>
        <button
          type="button"
          onClick={handleGenerateReport}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
        >
          <FaChartBar className="mr-2" /> Generate Report
        </button>
        <button
          type="button"
          onClick={() => setShowScanner(true)}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
        >
          <FaQrcode className="mr-2" /> Scan Document
        </button>
        <button
          type="button"
          onClick={() => handleExportSettingsChange({ format: 'pdf' })}
          className="flex items-center px-4 py-2 border border-teal-600 text-teal-600 bg-white rounded-xl hover:bg-teal-50 transition-colors"
        >
          Export Settings
        </button>
      </div>

      <NewConsignmentModal
        isOpen={showNewConsignmentModal}
        onClose={() => setShowNewConsignmentModal(false)}
        onSubmit={onSubmitNewConsignment}
      />

      <QrScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleScanSuccess}
      />

      {scannedData && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Scanned Consignment Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Trader Name</p>
              <p className="mt-1">{scannedData.traderName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Trader Email</p>
              <p className="mt-1">{scannedData.traderEmail}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Document Type</p>
              <p className="mt-1">{scannedData.documentType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="mt-1">{scannedData.goodsStatus}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">Goods Description</p>
              <p className="mt-1">{scannedData.description}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Estimated Value</p>
              <p className="mt-1">{scannedData.estimatedValue}</p>
            </div>
          </div>

          {scannedData.documents && scannedData.documents.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-500 mb-2">Submitted Documents</p>
              <ul className="space-y-1">
                {scannedData.documents.map((docItem, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    • {docItem.type} — {docItem.fileName} ({docItem.sizeKb}KB)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default QuickActions;
