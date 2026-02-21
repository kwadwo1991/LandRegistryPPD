
export enum UserRole {
  Admin = 'Admin',
  Head = 'Head',
  DateEntryOfficer = 'Date Entry Officer',
  Secretary = 'Secretary',
  Staff = 'Staff',
}

export interface User {
  username?: string;
  role: UserRole;
}

export enum RegistrationStatus {
  Pending = 'Pending Review',
  Approved = 'Approved',
  Queried = 'Queried',
  Rejected = 'Rejected',
}

export interface Applicant {
  fullName: string;
  address: string;
  phone: string;
  email: string;
  idType: 'Ghana Card' | 'Passport' | 'Drivers License';
  idNumber: string;
}

export interface DocumentFile {
  name: string;
  size: number; // in bytes
  type: string;
  url: string; // mock url
}

export interface LandParcel {
  id: string;
  applicant: Applicant;
  location: {
    region: string;
    district: string;
    town: string;
    gpsCoordinates: {
      latitude: string;
      longitude: string;
    };
  };
  sizeAcres: number;
  landUse: 'Residential' | 'Commercial' | 'Agricultural' | 'Industrial' | 'Mixed-Use';
  status: RegistrationStatus;
  submissionDate: string;
  documents: DocumentFile[];
  statusHistory: { status: RegistrationStatus; date: string; notes: string }[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}
