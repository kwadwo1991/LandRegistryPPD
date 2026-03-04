import { AuditLog } from '../types';

let auditLogs: AuditLog[] = [];

export const AuditService = {
  logAction: async (log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> => {
    const newLog: AuditLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    auditLogs = [newLog, ...auditLogs];
    console.log('Audit Log:', newLog);
  },

  getLogs: async (): Promise<AuditLog[]> => {
    return auditLogs;
  },

  getLogsByParcel: async (parcelId: string): Promise<AuditLog[]> => {
    return auditLogs.filter(log => log.details.includes(parcelId));
  }
};
