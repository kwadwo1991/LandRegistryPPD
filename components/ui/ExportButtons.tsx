import React from 'react';
import { FileText, Table, FileSpreadsheet } from 'lucide-react';
import { ExportService } from '../../services/exportService';
import { LandParcel } from '../../types';

interface ExportButtonsProps {
  data: LandParcel[];
  filename?: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ data, filename }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mr-2">Export:</span>
      <button
        onClick={() => ExportService.exportToCSV(data, `${filename || 'registrations'}.csv`)}
        className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        title="Export to CSV"
      >
        <Table className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
        CSV
      </button>
      <button
        onClick={() => ExportService.exportToExcel(data, `${filename || 'registrations'}.xlsx`)}
        className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        title="Export to Excel"
      >
        <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5 text-green-600" />
        Excel
      </button>
      <button
        onClick={() => ExportService.exportToPDF(data, `${filename || 'registrations'}.pdf`)}
        className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        title="Export to PDF"
      >
        <FileText className="h-3.5 w-3.5 mr-1.5 text-red-600" />
        PDF
      </button>
    </div>
  );
};

export default ExportButtons;
