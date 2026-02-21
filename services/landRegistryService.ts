
import { LandParcel, RegistrationStatus, RegistrationType } from '../types';

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
    documents: [{ name: 'Site_Plan_001.pdf', size: 1200000, type: 'application/pdf', url: '#' }],
    statusHistory: [
        { status: RegistrationStatus.Approved, date: '2024-06-20', notes: 'All documents verified and approved.' },
        { status: RegistrationStatus.Pending, date: '2024-05-15', notes: 'Application submitted.' },
    ],
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
    documents: [{ name: 'Architectural_Drawings.pdf', size: 2500000, type: 'application/pdf', url: '#' }],
    statusHistory: [
        { status: RegistrationStatus.Pending, date: '2024-06-28', notes: 'Application submitted, pending review by surveyor.' },
    ],
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
    documents: [{ name: 'Structural_Plan.pdf', size: 1800000, type: 'application/pdf', url: '#' }],
    statusHistory: [
        { status: RegistrationStatus.Queried, date: '2024-07-05', notes: 'Inconsistent boundary markers in site plan. Awaiting revised document.' },
        { status: RegistrationStatus.Pending, date: '2024-06-10', notes: 'Application submitted.' },
    ],
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

  addParcel: async (parcelData: Omit<LandParcel, 'id' | 'submissionDate' | 'status' | 'statusHistory' | 'submittedBy'> & { submittedBy?: string }): Promise<LandParcel> => {
    await simulateDelay(1000);
    const prefix = parcelData.type === RegistrationType.Land ? 'LND' : parcelData.type === RegistrationType.Development ? 'DEV' : 'BLD';
    const typeCount = mockParcels.filter(p => p.type === parcelData.type).length;
    const newIdNumber = (typeCount + 1).toString().padStart(3, '0');
    const currentYear = new Date().getFullYear();
    const newParcel: LandParcel = {
      ...parcelData,
      id: `${prefix}-${currentYear}-${newIdNumber}`,
      submissionDate: new Date().toISOString(),
      status: RegistrationStatus.Pending,
      statusHistory: [{ status: RegistrationStatus.Pending, date: new Date().toLocaleDateString('en-CA'), notes: 'Application submitted successfully.' }],
      submittedBy: parcelData.submittedBy,
    };
    mockParcels.unshift(newParcel);
    return newParcel;
  },

  updateParcelStatus: async (id: string, status: RegistrationStatus, notes: string): Promise<LandParcel | undefined> => {
    await simulateDelay(500);
    const parcel = mockParcels.find(p => p.id === id);
    if (parcel) {
      parcel.status = status;
      parcel.statusHistory.unshift({
        status,
        date: new Date().toLocaleDateString('en-CA'),
        notes
      });
      return { ...parcel };
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
