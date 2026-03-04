
export enum UserRole {
  Admin = 'Admin',
  Head = 'Head',
  DateEntryOfficer = 'Date Entry Officer',
  Secretary = 'Secretary',
  Staff = 'Staff',
  PublicUser = 'Public User',
}

export enum Permission {
  CreateRegistration = 'create_registration',
  EditRegistration = 'edit_registration',
  DeleteRegistration = 'delete_registration',
  ReviewRegistration = 'review_registration',
  ManageUsers = 'manage_users',
  ViewReports = 'view_reports',
}

export interface User {
  username?: string;
  role: UserRole;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  contact?: string;
  whatsapp?: string;
  email?: string;
  office?: 'Akrofrom' | 'Offuman' | 'Tuobodom';
  status?: 'Active' | 'Inactive';
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

export enum RegistrationType {
  Land = 'Land Registration',
  Development = 'Development Permit',
  Building = 'Building Permit',
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details?: string;
}

export interface RegistrationRecord {
  id: string;
  type: RegistrationType;
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
  sizeAcres?: number;
  landUse?: 'Residential' | 'Commercial' | 'Agricultural' | 'Industrial' | 'Mixed-Use';
  permitDetails?: {
    proposedStructure?: string;
    estimatedCost?: number;
    architectName?: string;
    contractorName?: string;
    numFloors?: number;
    floorArea?: number;
    developmentType?: string;
    siteArea?: number;
  };
  status: RegistrationStatus;
  submissionDate: string;
  dueDate?: string;
  technicalSubcommitteeDate?: string;
  spatialPlanningCommitteeDate?: string;
  documents: DocumentFile[];
  statusHistory: { status: RegistrationStatus; date: string; notes: string }[];
  auditLogs: AuditLog[];
  submittedBy?: string;
}

export type LandParcel = RegistrationRecord;

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}
