
import { LandParcel, RegistrationStatus, RegistrationType, AuditLog } from '../types';
import { NotificationService } from './notificationService';
import { AuditService } from './auditService';

const mockAuditLogs: AuditLog[] = [
  { id: '1', action: 'Application Submitted', userId: 'user1', userEmail: 'ama.s@example.com', timestamp: '2024-05-15T10:30:00Z', details: 'Initial submission' },
  { id: '2', action: 'Status Updated', userId: 'admin', userEmail: 'admin@techimannorth.gov.gh', timestamp: '2024-06-20T11:00:00Z', details: 'Approved after verification' },
];

const mockParcels: LandParcel[] = [
  {
    id: 'LND-2024-001',
    type: RegistrationType.Land,
    applicant: {
      fullName: 'Ama Serwaa',
      address: 'P.O. Box 123, Tuobodom',
      phone: '0244123456',
      email: 'ama.s@example.com',
      idType: 'Ghana Card',
      idNumber: 'GHA-123456789-0',
    },
    location: {
      region: 'Bono East',
      district: 'Techiman North',
      town: 'Tuobodom',
      gpsCoordinates: { latitude: '7.6543', longitude: '-1.9876' },
    },
    sizeAcres: 2.5,
    landUse: 'Agricultural',
    status: RegistrationStatus.Approved,
    submissionDate: '2024-05-15T10:30:00Z',
    dueDate: '2024-05-29T10:30:00Z',
    documents: [{ name: 'Site_Plan_001.pdf', size: 1200000, type: 'application/pdf', url: '#' }],
    statusHistory: [
        { status: RegistrationStatus.Approved, date: '2024-06-20', notes: 'All documents verified and approved.' },
        { status: RegistrationStatus.Pending, date: '2024-05-15', notes: 'Application submitted.' },
    ],
    auditLogs: [...mockAuditLogs],
  },
  {
    id: 'DEV-2024-001',
    type: RegistrationType.Development,
    applicant: {
      fullName: 'Kwabena Asante',
      address: 'H/No. 45, Offinso Road, Tanoso',
      phone: '0555987654',
      email: 'k.asante@example.com',
      idType: 'Ghana Card',
      idNumber: 'GHA-987654321-1',
    },
    location: {
      region: 'Bono East',
      district: 'Techiman North',
      town: 'Tanoso',
      gpsCoordinates: { latitude: '7.5999', longitude: '-1.9555' },
    },
    permitDetails: {
      proposedStructure: '2-Storey Residential Building',
      estimatedCost: 250000,
      architectName: 'Isaac Mensah',
    },
    status: RegistrationStatus.Pending,
    submissionDate: '2024-06-28T14:00:00Z',
    dueDate: '2024-07-12T14:00:00Z',
    documents: [{ name: 'Architectural_Drawings.pdf', size: 2500000, type: 'application/pdf', url: '#' }],
    statusHistory: [
        { status: RegistrationStatus.Pending, date: '2024-06-28', notes: 'Application submitted, pending review by surveyor.' },
    ],
    auditLogs: [{ id: '3', action: 'Application Submitted', performedBy: 'Kwabena Asante', timestamp: '2024-06-28T14:00:00Z', details: 'Initial submission' }],
  },
    {
    id: 'BLD-2024-001',
    type: RegistrationType.Building,
    applicant: {
      fullName: 'Yaa Dufie',
      address: 'Plot 7, Krobo',
      phone: '0208111222',
      email: 'yaa.d@example.com',
      idType: 'Passport',
      idNumber: 'G0123456',
    },
    location: {
      region: 'Bono East',
      district: 'Techiman North',
      town: 'Krobo',
      gpsCoordinates: { latitude: '7.6123', longitude: '-1.9432' },
    },
    permitDetails: {
      proposedStructure: 'Commercial Warehouse',
      estimatedCost: 500000,
      contractorName: 'BuildRight Construction',
    },
    status: RegistrationStatus.Queried,
    submissionDate: '2024-06-10T09:00:00Z',
    dueDate: '2024-06-24T09:00:00Z',
    documents: [{ name: 'Structural_Plan.pdf', size: 1800000, type: 'application/pdf', url: '#' }],
    statusHistory: [
        { status: RegistrationStatus.Queried, date: '2024-07-05', notes: 'Inconsistent boundary markers in site plan. Awaiting revised document.' },
        { status: RegistrationStatus.Pending, date: '2024-06-10', notes: 'Application submitted.' },
    ],
    auditLogs: [{ id: '4', action: 'Application Submitted', performedBy: 'Yaa Dufie', timestamp: '2024-06-10T09:00:00Z', details: 'Initial submission' }],
  },
  {
    id: 'LND-2026-001',
    type: RegistrationType.Land,
    applicant: {
      fullName: 'John Doe',
      address: 'Plot 12, Akrofrom',
      phone: '0244000111',
      email: 'j.doe@example.com',
      idType: 'Ghana Card',
      idNumber: 'GHA-000000000-1',
    },
    location: {
      region: 'Bono East',
      district: 'Techiman North',
      town: 'Akrofrom',
      gpsCoordinates: { latitude: '7.6000', longitude: '-1.9000' },
    },
    sizeAcres: 1.2,
    landUse: 'Residential',
    status: RegistrationStatus.Pending,
    submissionDate: '2026-03-01T10:00:00Z',
    dueDate: '2026-03-03T10:00:00Z', // Due Today
    documents: [],
    statusHistory: [{ status: RegistrationStatus.Pending, date: '2026-03-01', notes: 'Submitted' }],
    auditLogs: [],
  },
  {
    id: 'DEV-2026-001',
    type: RegistrationType.Development,
    applicant: {
      fullName: 'Jane Smith',
      address: 'H/No. 10, Offuman',
      phone: '0555111222',
      email: 'j.smith@example.com',
      idType: 'Ghana Card',
      idNumber: 'GHA-111111111-2',
    },
    location: {
      region: 'Bono East',
      district: 'Techiman North',
      town: 'Offuman',
      gpsCoordinates: { latitude: '7.7000', longitude: '-2.0000' },
    },
    status: RegistrationStatus.Pending,
    submissionDate: '2026-03-02T11:00:00Z',
    dueDate: '2026-03-08T11:00:00Z', // Due in 5 days (Next 7 days)
    documents: [],
    statusHistory: [{ status: RegistrationStatus.Pending, date: '2026-03-02', notes: 'Submitted' }],
    auditLogs: [],
  },
  {
    id: 'BLD-2026-001',
    type: RegistrationType.Building,
    applicant: {
      fullName: 'Peter Parker',
      address: 'Daily Bugle, Tuobodom',
      phone: '0200111222',
      email: 'p.parker@example.com',
      idType: 'Passport',
      idNumber: 'P1234567',
    },
    location: {
      region: 'Bono East',
      district: 'Techiman North',
      town: 'Tuobodom',
      gpsCoordinates: { latitude: '7.6500', longitude: '-1.9800' },
    },
    status: RegistrationStatus.Pending,
    submissionDate: '2026-02-15T09:00:00Z',
    dueDate: '2026-03-01T09:00:00Z', // Overdue
    documents: [],
    statusHistory: [{ status: RegistrationStatus.Pending, date: '2026-02-15', notes: 'Submitted' }],
    auditLogs: [],
  },
];

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const LandRegistryService = {
  getParcels: async (): Promise<LandParcel[]> => {
    await simulateDelay(500);
    return [...mockParcels];
  },

  getParcelById: async (id: string): Promise<LandParcel | undefined> => {
    await simulateDelay(300);
    return mockParcels.find(p => p.id === id);
  },

  addParcel: async (parcelData: Omit<LandParcel, 'id' | 'submissionDate' | 'status' | 'statusHistory' | 'auditLogs' | 'submittedBy'> & { submittedBy?: string }): Promise<LandParcel> => {
    await simulateDelay(1000);
    const prefix = parcelData.type === RegistrationType.Land ? 'LND' : parcelData.type === RegistrationType.Development ? 'DEV' : 'BLD';
    const typeCount = mockParcels.filter(p => p.type === parcelData.type).length;
    const newIdNumber = (typeCount + 1).toString().padStart(3, '0');
    const currentYear = new Date().getFullYear();
    const submissionDate = new Date().toISOString();
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // Default 30 days for approval deadline
    const newParcel: LandParcel = {
      ...parcelData,
      id: `${prefix}-${currentYear}-${newIdNumber}`,
      submissionDate,
      dueDate,
      status: RegistrationStatus.Pending,
      statusHistory: [{ status: RegistrationStatus.Pending, date: new Date().toLocaleDateString('en-CA'), notes: 'Application submitted successfully.' }],
      auditLogs: [{ id: Date.now().toString(), action: 'Application Submitted', userId: parcelData.submittedBy || 'Applicant', userEmail: parcelData.applicant.email, timestamp: new Date().toISOString(), details: 'Initial submission' }],
      submittedBy: parcelData.submittedBy,
    };

    await AuditService.logAction({
      userId: parcelData.submittedBy || 'Applicant',
      userEmail: parcelData.applicant.email,
      action: 'Application Submitted',
      details: `New ${parcelData.type} application submitted: ${newParcel.id}`
    });

    await NotificationService.addNotification({
      userId: 'admin',
      title: 'New Application',
      message: `A new ${parcelData.type} has been submitted by ${parcelData.applicant.fullName}.`,
      type: 'info',
      link: `/admin/registrations/${newParcel.id}`
    });

    mockParcels.unshift(newParcel);
    return newParcel;
  },

  updateParcelStatus: async (id: string, status: RegistrationStatus, notes: string, performedBy: string, userEmail: string): Promise<LandParcel | undefined> => {
    await simulateDelay(500);
    const parcel = mockParcels.find(p => p.id === id);
    if (parcel) {
      const oldStatus = parcel.status;
      parcel.status = status;
      parcel.statusHistory.unshift({
        status,
        date: new Date().toLocaleDateString('en-CA'),
        notes
      });
      parcel.auditLogs.unshift({
        id: Date.now().toString(),
        action: 'Status Updated',
        userId: performedBy,
        userEmail: userEmail,
        timestamp: new Date().toISOString(),
        details: `Status changed from ${oldStatus} to ${status}. Notes: ${notes}`
      });
      
      await AuditService.logAction({
        userId: performedBy,
        userEmail: userEmail,
        action: 'Status Updated',
        details: `Application ${id} status changed to ${status}`
      });

      await NotificationService.addNotification({
        userId: parcel.submittedBy || 'all',
        title: 'Application Update',
        message: `Your application ${id} status has been updated to ${status}.`,
        type: status === RegistrationStatus.Approved ? 'success' : status === RegistrationStatus.Rejected ? 'error' : 'warning',
        link: `/dashboard`
      });

      // Mock email notification
      console.log(`Email sent to ${parcel.applicant.email}: Your application ${parcel.id} status is now ${status}.`);
      
      return { ...parcel };
    }
    return undefined;
  },

  scheduleMeetings: async (id: string, technicalDate: string, spatialDate: string, performedBy: string, userEmail: string): Promise<LandParcel | undefined> => {
    await simulateDelay(500);
    const parcel = mockParcels.find(p => p.id === id);
    if (parcel) {
      parcel.technicalSubcommitteeDate = technicalDate;
      parcel.spatialPlanningCommitteeDate = spatialDate;
      
      parcel.auditLogs.unshift({
        id: Date.now().toString(),
        action: 'Meetings Scheduled',
        userId: performedBy,
        userEmail: userEmail,
        timestamp: new Date().toISOString(),
        details: `Technical Subcommittee: ${technicalDate}, Spatial Planning Committee: ${spatialDate}`
      });

      await AuditService.logAction({
        userId: performedBy,
        userEmail: userEmail,
        action: 'Meetings Scheduled',
        details: `Scheduled meetings for application ${id}`
      });

      return { ...parcel };
    }
    return undefined;
  },

  updateParcel: async (id: string, updatedData: Partial<LandParcel>, performedBy: string): Promise<LandParcel | undefined> => {
    await simulateDelay(500);
    const index = mockParcels.findIndex(p => p.id === id);
    if (index !== -1) {
      const oldParcel = mockParcels[index];
      mockParcels[index] = { ...oldParcel, ...updatedData };
      mockParcels[index].auditLogs.unshift({
        id: Date.now().toString(),
        action: 'Application Edited',
        performedBy,
        timestamp: new Date().toISOString(),
        details: 'Record details updated via Admin CMS'
      });
      return { ...mockParcels[index] };
    }
    return undefined;
  },

  deleteParcel: async (id: string): Promise<boolean> => {
    await simulateDelay(500);
    const index = mockParcels.findIndex(p => p.id === id);
    if (index !== -1) {
      mockParcels.splice(index, 1);
      return true;
    }
    return false;
  },
};
