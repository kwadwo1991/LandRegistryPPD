import { User, UserRole } from '../types';

export interface ManagedUser extends User {
  id: string;
  active: boolean;
  password?: string;
}

export const mockUsers: ManagedUser[] = [
  { id: '0', username: 'admin', role: UserRole.Admin, active: true, password: 'Admin123', email: 'admin@tenda.gov.gh', contact: '0000000000' },
  { id: '1', username: 'head_of_dept', role: UserRole.Head, active: true, password: 'password123', email: 'head@example.com', contact: '1234567890' },
  { id: '2', username: 'deo_officer', role: UserRole.DateEntryOfficer, active: true, password: 'password123' },
  { id: '3', username: 'secretary_staff', role: UserRole.Secretary, active: false, password: 'password123' },
  { id: '4', username: 'staff_member', role: UserRole.Staff, active: true, password: 'password123' },
];

export const UserService = {
  getUsers: async (): Promise<ManagedUser[]> => {
    return [...mockUsers];
  },

  updateUserStatus: async (userId: string, active: boolean): Promise<boolean> => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.active = active;
      return true;
    }
    return false;
  },

  updateUserRole: async (userId: string, role: UserRole): Promise<boolean> => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.role = role;
      return true;
    }
    return false;
  },

  createUser: async (userData: Omit<User, 'username'> & { username: string; password?: string }, createdByAdmin: boolean = false): Promise<ManagedUser> => {
    const newUser: ManagedUser = {
      id: (mockUsers.length + 1).toString(),
      ...userData,
      active: createdByAdmin, // Accounts created by admin are active by default
    };
    mockUsers.push(newUser);
    return newUser;
  },
};
