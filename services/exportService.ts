import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { LandParcel } from '../types';

// Extend jsPDF with autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: {
      head: string[][];
      body: (string | number | undefined)[][];
      startY: number;
      theme: string;
      headStyles: { fillColor: number[] };
    }) => jsPDF;
  }
}

export const ExportService = {
  exportToCSV: (data: LandParcel[], filename: string = 'land_registrations.csv') => {
    const headers = ['ID', 'Type', 'Applicant', 'Location', 'Size (Acres)', 'Status', 'Submission Date'];
    const rows = data.map(item => [
      item.id,
      item.type,
      item.applicant.fullName,
      `${item.location.town}, ${item.location.district}`,
      item.sizeAcres || 'N/A',
      item.status,
      new Date(item.submissionDate).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  },

  exportToExcel: (data: LandParcel[], filename: string = 'land_registrations.xlsx') => {
    const worksheetData = data.map(item => ({
      'ID': item.id,
      'Type': item.type,
      'Applicant Name': item.applicant.fullName,
      'Applicant Email': item.applicant.email,
      'Town': item.location.town,
      'District': item.location.district,
      'Size (Acres)': item.sizeAcres || 'N/A',
      'Status': item.status,
      'Submission Date': new Date(item.submissionDate).toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    XLSX.writeFile(workbook, filename);
  },

  exportToPDF: (data: LandParcel[], filename: string = 'land_registrations.pdf') => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Techiman North District Assembly - Land Registrations', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = ['ID', 'Type', 'Applicant', 'Location', 'Status', 'Date'];
    const tableRows = data.map(item => [
      item.id,
      item.type,
      item.applicant.fullName,
      item.location.town,
      item.status,
      new Date(item.submissionDate).toLocaleDateString()
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [22, 163, 74] } // Tailwind green-600
    });

    doc.save(filename);
  }
};
