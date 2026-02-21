
import { LandParcel, RegistrationStatus } from '../types';

const mockParcels: LandParcel[] = [
  {
    id: 'TND-2024-001',
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
    id: 'TND-2024-002',
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
    sizeAcres: 0.8,
    landUse: 'Residential',
    status: RegistrationStatus.Pending,
    submissionDate: '2024-06-28T14:00:00Z',
    documents: [{ name: 'Indenture_002.pdf', size: 2500000, type: 'application/pdf', url: '#' }],
    statusHistory: [
        { status: RegistrationStatus.Pending, date: '2024-06-28', notes: 'Application submitted, pending review by surveyor.' },
    ],
  },
    {
    id: 'TND-2024-003',
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
    sizeAcres: 5.0,
    landUse: 'Commercial',
    status: RegistrationStatus.Queried,
    submissionDate: '2024-06-10T09:00:00Z',
    documents: [{ name: 'Site_Plan_003.pdf', size: 1800000, type: 'application/pdf', url: '#' }],
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
    const newIdNumber = (mockParcels.length + 1).toString().padStart(3, '0');
    const newParcel: LandParcel = {
      ...parcelData,
      id: `TND-2024-${newIdNumber}`,
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
};
