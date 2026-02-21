import { LandParcel, RegistrationStatus } from '../types';

// This is a mock service. In a real application, you would make API calls to a backend.

const parcels: LandParcel[] = [
  // ... initial mock data
];

export const RegistrationService = {
  async getParcels(): Promise<LandParcel[]> {
    return Promise.resolve(parcels);
  },

  async getParcelById(id: string): Promise<LandParcel | undefined> {
    return Promise.resolve(parcels.find(p => p.id === id));
  },

  async updateParcelStatus(id: string, status: RegistrationStatus, notes: string): Promise<LandParcel | undefined> {
    const parcel = parcels.find(p => p.id === id);
    if (parcel) {
      parcel.status = status;
      parcel.statusHistory.push({ status, notes, date: new Date().toISOString() });
      return Promise.resolve(parcel);
    }
    return Promise.resolve(undefined);
  },
};
